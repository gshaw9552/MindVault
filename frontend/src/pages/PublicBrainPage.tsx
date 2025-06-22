import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { UserBrainCard } from "../components/UserBrainCard";
import { Button } from "../components/Buttons";
import { PageHeader } from "../components/PageHeader";
import { SearchInput } from "../components/SearchInput";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { API_BASE } from "../config/config";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "../icons/PlusIcon";
import { HomeIcon } from "../icons/HomeIcon";
import { GroupIcon } from "../icons/GroupIcon";
import { SearchIcon } from "../icons/SearchIcon";

interface SharedBrainInfo {
  username: string;
  hash: string;
  createdAt: string;
}

export function PublicBrains() {
  const [brains, setBrains] = useState<SharedBrainInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/public-brains`)
      .then((res) => res.json())
      .then((data) => {
        setBrains(data.brains || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredBrains = brains.filter(brain =>
    brain.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout
      sidebarOpen={false}
      setSidebarOpen={() => { }}
      onFilterChange={() => { }}
      currentFilter="all"
    >
      <PageHeader
        icon={<GroupIcon />}
        title="Public Knowledge Vaults"
        description="Discover and explore curated knowledge collections from the MindVault community"
        subtitle={`Browse through ${brains.length} public vaults filled with insights, articles, and ideas shared by fellow knowledge seekers.`}
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Button
          text="Create Your Own Vault"
          variant="primary"
          onClick={() => navigate('/signin')}
          startIcon={
            <div className="text-white">
              <PlusIcon />
            </div>
          }
        />
        <Button
          text="Back to Home"
          variant="secondary"
          onClick={() => navigate('/')}
          startIcon={<HomeIcon />}
        />
      </div>

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search vaults by username..."
        show={brains.length > 0}
      />

      {loading && <LoadingSpinner message="Loading public vaults..." />}

      {/* Empty State */}
      {!loading && brains.length === 0 && (
        <EmptyState
          icon={<GroupIcon />}
          title="No Public Vaults Yet"
          description="Be the first to share your knowledge with the community. Create a vault and make it public to inspire others."
          buttonText="Create the First Vault"
          buttonIcon={
            <div className="text-white">
              <PlusIcon />
            </div>
          }
          onButtonClick={() => navigate('/signin')}
        />
      )}

      {!loading && brains.length > 0 && filteredBrains.length === 0 && (
        <EmptyState
          icon={<SearchIcon />}
          title="No Results Found"
          description={`No vaults match your search term "${searchTerm}". Try a different search or browse all available vaults.`}
          buttonText="Clear Search"
          buttonIcon={undefined}
          onButtonClick={() => setSearchTerm("")}
        />
      )}

      {!loading && filteredBrains.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? `Search Results (${filteredBrains.length})` : `All Vaults (${brains.length})`}
            </h2>
            <p className="text-gray-600">
              {searchTerm
                ? `Found ${filteredBrains.length} vault${filteredBrains.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                : "Explore knowledge collections from the community"
              }
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBrains.map((brain) => (
              <UserBrainCard key={brain.hash} {...brain} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}