import React, { useState, MouseEvent, useRef } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Buttons";
import { Input } from "./Input";
import { useToast } from "./ToastProvider";
import { useEmbed } from "../hooks/useEmbed";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    link: string;
    type: string;
    description?: string;
    embedding: number[];
  }) => void;
}

export function CreateContentModal({
  open,
  onClose,
  onSubmit,
}: CreateContentModalProps) {
  const { showToast } = useToast();
  const { embed } = useEmbed();
  const [isLoading, setIsLoading] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  if (!open) return null;

  const handleBackdropClick = () => onClose();
  const handleModalClick = (e: MouseEvent) => e.stopPropagation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value.trim() || "";
    const link = linkRef.current?.value.trim() || "";
    const type = typeRef.current?.value.trim() || "";
    const rawDesc = descRef.current?.value.trim() || "";
    const description = rawDesc.length > 0 ? rawDesc : undefined;

    // Basic validation
    if (!title || !type) {
      showToast("Title and Type are required.", "error");
      return;
    }
    if (type !== "note" && !link) {
      showToast("Link is required for this content type.", "error");
      return;
    }
    if (type === "note" && !description) {
      showToast("Description is required for Note type.", "error");
      return;
    }

    setIsLoading(true);

    // Generate embedding
    let embedding: number[];
    try {
      embedding = await embed(`${title} ${description || ""}`);
    } catch (err) {
      console.error("Embedding failed:", err);
      showToast("Embedding failed, using fallback vector.", "error");
      embedding = Array(512).fill(0);
    }

    if (titleRef.current) titleRef.current.value = "";
    if (linkRef.current) linkRef.current.value = "";
    if (typeRef.current) typeRef.current.value = "";
    if (descRef.current) descRef.current.value = "";

    onSubmit({ title, link: type === "note" ? "#" : link, type, description, embedding });

    setIsLoading(false);
    onClose();
  };

  const handleTypeChange = () => {
    if (typeRef.current?.value === "note" && linkRef.current) {
      linkRef.current.value = "";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
        onClick={handleModalClick}
      >
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="Close modal">
            <div className="h-6 w-6 text-gray-600 hover:text-gray-800"> <CrossIcon /> </div>
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Add New Content
        </h2>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <Input inputRef={titleRef} placeholder="Title" />

          {/* Conditional Link field */}
          <div id="link-field">
            <Input inputRef={linkRef} placeholder="Link (URL)" />
          </div>

          <label className="block w-full">
            <select
              ref={typeRef}
              defaultValue=""
              onChange={handleTypeChange}
              className="px-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="" disabled>
                Choose a type…
              </option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="link">Link</option>
              <option value="music">Music</option>
              <option value="note">Note</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">
              Description
            </span>
            <textarea
              ref={descRef}
              placeholder="Write a short note…"
              className="w-full mt-1 p-2 border rounded h-24 resize-y focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </label>

          <Button
            type="submit"
            variant="primary"
            text={isLoading ? "Adding…" : "Submit"}
            fullWidth
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
