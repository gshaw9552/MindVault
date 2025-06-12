import React, { MouseEvent, useRef } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Buttons";
import { Input } from "./Input";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; link: string; type: string; description?: string }) => void;
}

export function CreateContentModal({
  open,
  onClose,
  onSubmit,
}: CreateContentModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  if (!open) return null;

  // Close when clicking the backdrop
  const handleBackdropClick = () => {
    onClose();
  };

  // Prevent closing when clicking inside the white box
  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value.trim() || "";
    const link = linkRef.current?.value.trim() || "";
    const type = typeRef.current?.value.trim() || "";
    const raw = descRef.current?.value.trim();
    const description = raw && raw.length > 0 ? raw : undefined;

    // Modified validation - Note type doesn't require a link
    if (!title || !type) {
      alert("Title and Type are required.");
      return;
    }

    // For non-note types, link is required
    if (type !== "note" && !link) {
      alert("Link is required for this content type.");
      return;
    }

    // For note type, description is required
    if (type === "note" && !description) {
      alert("Description is required for Note type.");
      return;
    }

    onSubmit({ 
      title, 
      link: type === "note" ? "#" : link, // Use placeholder link for notes
      type, 
      description 
    });

    // Clear for next time
    if (titleRef.current) titleRef.current.value = "";
    if (linkRef.current) linkRef.current.value = "";
    if (typeRef.current) typeRef.current.value = "";
    if (descRef.current) descRef.current.value = "";

    onClose();
  };

  // Get current selected type to show/hide link field
  const handleTypeChange = () => {
    // This will trigger a re-render when type changes
    const selectedType = typeRef.current?.value;
    if (selectedType === "note" && linkRef.current) {
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
           <div className="h-6 w-6 text-gray-600 hover:text-gray-800" > <CrossIcon /> </div>
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Add New Content
        </h2>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <Input inputRef={titleRef} placeholder="Title" />
          
          {/* Conditional Link field - hidden for Note type */}
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
              <option value="link">Link</option>
              <option value="music">Music</option>
              <option value="note">Note</option>
              <option value="instagram">Instagram</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">
              Description 
              {/* Show required indicator for Note type */}
              <span id="desc-required" className="text-red-500 hidden"> *</span>
              <span id="desc-optional" className="text-gray-500"> (optional)</span>
            </span>
            <textarea
              ref={descRef}
              placeholder="Write a short note…"
              className="w-full mt-1 p-2 border rounded h-24 resize-y focus:outline-none focus:ring-2 focus:ring-purple-400" 
            />
          </label>

          <Button type="submit" variant="primary" text="Submit" fullWidth />
        </form>
      </div>
    </div>
  );
}