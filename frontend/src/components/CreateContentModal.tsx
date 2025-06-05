import React, { MouseEvent, useRef } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Buttons";
import { Input } from "./Input";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; link: string; type: string }) => void;
}

export function CreateContentModal({
  open,
  onClose,
  onSubmit,
}: CreateContentModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);

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

    if (!title || !link || !type) {
      alert("All fields are required.");
      return;
    }

    onSubmit({ title, link, type });

    // Clear for next time
    if (titleRef.current) titleRef.current.value = "";
    if (linkRef.current) linkRef.current.value = "";
    if (typeRef.current) typeRef.current.value = "";

    onClose();
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
          <Input inputRef={linkRef} placeholder="Link (URL)" />

          <label className="block w-full">
            <select
              ref={typeRef}
              defaultValue=""
              className="px-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="" disabled>
                Choose a type…
              </option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
              <option value="link">Link</option>
              <option value="music">Music</option>

            </select>
          </label>

          <Button type="submit" variant="primary" text="Submit" fullWidth />
        </form>
      </div>
    </div>
  );
}
