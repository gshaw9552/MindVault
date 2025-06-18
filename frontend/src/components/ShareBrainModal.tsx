import { MouseEvent, useState, useEffect } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Buttons";
import { ShareIcon } from "../icons/ShareIcon";
import { CopyIcon } from "../icons/CopyIcon";
import { CheckIcon } from "../icons/CheckIcon";
import { API_BASE } from "../config/config";

interface ShareBrainModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShareBrainModal({ open, onClose }: ShareBrainModalProps) {
  if (!open) return null;

  const [isShared, setIsShared] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

  // 1) On open, fetch current share link
  useEffect(() => {
    if (!open || !token) return;

    setLoading(true);
    fetch(`${API_BASE}/brain/me/link`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not shared");
        return res.json();
      })
      .then((data: { hash: string; username: string }) => {
        setIsShared(true);
        setUsername(data.username);
        // Ensure correct route segment
        const url = `${window.location.origin}/brain/share/${data.hash}`;
        setShareUrl(url);
      })
      .catch(() => {
        setIsShared(false);
        setShareUrl("");
      })
      .finally(() => setLoading(false));
  }, [open, token]);

  // 2) Create share link
  const handleShareBrain = async () => {
    if (!token) return alert("Sign in first.");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/brain/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Share failed");
      const data = (await res.json()) as { hash: string; username: string };
      setIsShared(true);
      setUsername(data.username);
      // Updated route path
      setShareUrl(`${window.location.origin}/brain/share/${data.hash}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3) Unshare (delete link)
  const handleUnshareBrain = async () => {
    if (!window.confirm("Make your brain private?")) return;
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/brain/me/link`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unshare failed");
      setIsShared(false);
      setShareUrl("");
      setCopied(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4) Copy URL
  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Modal render
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="Close">
            <div className="w-6 h-6 text-gray-600 hover:text-gray-800"> <CrossIcon /> </div>
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <div className="text-purple-600"> <ShareIcon /> </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {isShared ? "Brain Sharing" : "Share Your Brain"}
          </h2>
          <p className="text-gray-600 text-sm">
            {isShared
              ? "Your brain is public and accessible to others."
              : "Make your brain public so others can view your content."}
          </p>
        </div>

        {isShared && shareUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Share URL:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-1"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">This link shows: “Brain of {username}”</p>
          </div>
        )}

        <div className="flex gap-3">
          {isShared ? (
            <Button
              onClick={handleUnshareBrain}
              variant="secondary"
              text={loading ? "Unsharing..." : "Unshare Brain"}
              fullWidth
              disabled={loading}
            />
          ) : (
            <Button
              onClick={handleShareBrain}
              variant="primary"
              text={loading ? "Sharing..." : "Share My Brain"}
              startIcon={<ShareIcon />}
              fullWidth
              disabled={loading}
            />
          )}
          <Button onClick={onClose} variant="outline" text="Close" fullWidth />
        </div>
      </div>
    </div>
  );
}
