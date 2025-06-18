import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ContentGrid } from "../components/ContentGrid";
import { Button } from "../components/Buttons";
import { API_BASE } from "../config/config";
import { ContentItem } from "../hooks/useContent";
import { PlusIcon } from "../icons/PlusIcon";
import { GroupIcon } from "../icons/GroupIcon";
import { FileIcon } from "../icons/FileIcon";

interface SharedBrainResponse {
  username: string;
  content: ContentItem[];
}

export function SharedBrainView() {
  const { shareLink } = useParams<{ shareLink: string }>();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shareLink) return;
    
    setLoading(true);
    fetch(`${API_BASE}/brain/${shareLink}`)
      .then((res) => {
        if (!res.ok) throw new Error("Vault not found");
        return res.json() as Promise<SharedBrainResponse>;
      })
      .then((data) => {
        setUsername(data.username);
        setItems(data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        navigate("/public-brains", { replace: true });
      });
  }, [shareLink, navigate]);

  if (loading) {
    return (
      <Layout
        sidebarOpen={false}
        setSidebarOpen={() => {}}
        onFilterChange={() => {}}
        currentFilter="all"
      >
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading vault...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      sidebarOpen={false}
      setSidebarOpen={() => {}}
      onFilterChange={() => {}}
      currentFilter="all"
    >
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-lg border shadow-sm p-8 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {username}'s MindVault
              </h1>
              <p className="text-gray-600">
                {items.length} items in this knowledge collection
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Explore {username}'s curated collection of insights, articles, and ideas. 
            MindVault helps people organize and share their knowledge with the world.
          </p>
          
          <div className="flex gap-4">
            <Button
              text="Create Your Own Vault"
              variant="primary"
              onClick={() => navigate("/signin")}
              startIcon={
                <div className="text-white">
                  <PlusIcon />
                </div>
              }
            />
            <Button
              text="Browse All Vaults"
              variant="outline"
              onClick={() => navigate("/public-brains")}
              startIcon={
                <div className="text-gray-600">
                  <GroupIcon />
                </div>
              }
            />
          </div>
        </div>

        {/* Content */}
        {items.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Knowledge Collection
            </h2>
            <ContentGrid items={items} readOnly />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-gray-400">
                <FileIcon />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This vault is currently empty. Check back later as {username} adds more content.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}