import { useState } from "react";
import { Button } from "../components/Buttons";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Layout } from "../components/Layout";
import { ContentGrid } from "../components/ContentGrid";
import { useContent } from "../hooks/useContent";
import { ShareBrainModal } from "../components/ShareBrainModal";
import { EmptyState } from "../components/EmptyState";
import { SearchIcon } from "../icons/SearchIcon";
import { useNavigate } from "react-router-dom";
import { GroupIcon } from "../icons/GroupIcon";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();

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

        {/* Share Brain Modal */}
        <ShareBrainModal 
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4 mb-2">
          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            text="Add Content"
            startIcon={<PlusIcon />}
          />
          <Button 
            onClick={() => setShareModalOpen(true)}
            variant="secondary" 
            text="Share Brain" 
            startIcon={<ShareIcon />} 
          />
          <Button
            onClick={() => navigate("/profile")}
            variant="ghost"
            text="Profile"
            startIcon={<GroupIcon />}
          />
        </div>

        {/* Loading or Error State (if any) */}
        {loading && <p className="text-center text-gray-600">Loading your content…</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Content Grid */}
        {visibleItems && visibleItems.length > 0 ? 
        (<ContentGrid items={visibleItems} onDelete={deleteContent} />) : 
        (<EmptyState  icon={ <SearchIcon /> } title="No Content to Display"  description="use the Add Content Button to add your personlized content " />)}
      </Layout>
    </>
  );
}

export default Dashboard;