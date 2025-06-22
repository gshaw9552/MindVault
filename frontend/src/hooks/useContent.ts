import { useEffect, useState } from "react";
import { API_BASE } from "../config/config";
import { useToast } from "../components/ToastProvider";

export interface ContentItem {
  _id: string;
  title: string;
  link: string;
  description?: string;
  type: "youtube" | "twitter" | "instagram" | "link" | "music";
  createdAt: string;
}

export function useContent() {
  const { showToast } = useToast();
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch content on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}/content`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch content");
        }
        const data = await res.json();
        return data.content as ContentItem[];
      })
      .then((items) => {
        setContentList(items);
      })
      .catch((err: any) => {
        console.error("useContent fetch error:", err);
        setError(err.message || "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Create a new content item
  async function createContent(data: {
    title: string;
    link: string;
    type: string;
    description?: string;
  }): Promise<ContentItem | null> {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be signed in to add content.", "error");
      return null;
    }

    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Create content failed");
      }

      const body = await res.json() as { content: ContentItem; message: string };
      const createdItem = body.content;

      setContentList((prev) => [...prev, createdItem]);
      return createdItem;
    } catch (err: any) {
      console.error("useContent create error:", err);
      showToast("Failed to add content: " + err.message, "error");
      return null;
    }
  }


  async function deleteContent(contentId: string): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be signed in to delete.", "error");
      return false;
    }
    if (!window.confirm("Delete this item?")) {
      return false;
    }

    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Delete failed");
      }
      setContentList((prev) => prev.filter((i) => i._id !== contentId));
      return true;
    } catch (err: any) {
      console.error("useContent delete error:", err);
      showToast("Failed to delete: " + err.message, "error");
      return false;
    }
  }

  return {
    contentList,
    loading,
    error,
    createContent,
    deleteContent,
  };
}

export async function semanticSearch(query: string): Promise<ContentItem[]> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/search/semantic?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const body = await res.json();
  return body.results;
}