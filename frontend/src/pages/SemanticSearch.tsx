import React, { useState } from "react";
import { SearchInput } from "../components/SearchInput";
import { ContentGrid } from "../components/ContentGrid";
import { useSemanticSearch } from "../hooks/useSemanticSearch";
import { Footer } from "../components/Footer";

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const { results, loading, search } = useSemanticSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-4xl mx-auto py-8 px-4">
        <form onSubmit={handleSubmit}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search your content semantically…"
            show={true}
          />
        </form>
        <div className="mb-4 text-sm text-gray-600">
          {loading
            ? "Searching…"
            : `Showing ${results.length} result${results.length !== 1 ? "s" : ""}`}
        </div>
        <ContentGrid items={results} readOnly />
      </main>

      <Footer />
    </div>
  );
}
