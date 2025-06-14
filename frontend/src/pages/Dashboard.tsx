import { useState } from "react";
import { Button } from "../components/Buttons";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Layout } from "../components/Layout";
import { ContentGrid } from "../components/ContentGrid";
import { useContent } from "../hooks/useContent";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");

  // Use the custom hook for all content-related operations
  const { contentList, loading, error, createContent, deleteContent } = useContent();

  const visibleItems = filterType === "all" ? contentList : contentList.filter((item) => item.type === filterType);

  return (
    <>
      <Layout
      onFilterChange={setFilterType}
      currentFilter={filterType}  
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
      >
        {/* Add Content Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={createContent}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4 mb-2">
          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            text="Add Content"
            startIcon={<PlusIcon />}
          />
          <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />} />
        </div>

        {/* Loading or Error State (if any) */}
        {loading && <p className="text-center text-gray-600">Loading your content…</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Content Grid */}
        <ContentGrid items={visibleItems} onDelete={deleteContent} />
      </Layout>
    </>
  );
}

export default Dashboard;
