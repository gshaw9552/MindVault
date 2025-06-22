import React, { MouseEvent, useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Buttons";
import { Input } from "./Input";
import { API_BASE } from "../config/config";
import { useToast } from "./ToastProvider";


interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { showToast } = useToast();

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleBackdropClick = () => {
    onClose();
  };

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const currentPassword = currentPasswordRef.current?.value || "";
    const newPassword = newPasswordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Password change failed");
      }

      showToast("Password changed successfully!", "success");
      
      // Clear form
      if (currentPasswordRef.current) currentPasswordRef.current.value = "";
      if (newPasswordRef.current) newPasswordRef.current.value = "";
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
      
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            <div className="h-6 w-6 text-gray-600 hover:text-gray-800">
              <CrossIcon />
            </div>
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Change Password
        </h2>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <Input
            inputRef={currentPasswordRef}
            type="password"
            placeholder="Current password"
            required
          />
          <Input
            inputRef={newPasswordRef}
            type="password"
            placeholder="New password"
            required
          />
          <Input
            inputRef={confirmPasswordRef}
            type="password"
            placeholder="Confirm new password"
            required
          />

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            text={loading ? "Changing..." : "Change Password"}
            fullWidth
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}