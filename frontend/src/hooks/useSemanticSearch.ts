import { useState } from "react";
import { useEmbed } from "./useEmbed";
import { API_BASE } from "../config/config";

export function useSemanticSearch() {
  const { embed } = useEmbed();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(query: string) {
    setLoading(true);
    let vector: number[] = [];
    try {
      vector = await embed(query);
    } catch {
      vector = Array(512).fill(0);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found — user must sign in");
      setLoading(false);
      return;
    }

    const res = await fetch(`${API_BASE}/search/semantic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vector }),
    });
    const json = await res.json();
    setResults(json.results || []);
    setLoading(false);
  }

  return { results, loading, search };
}
