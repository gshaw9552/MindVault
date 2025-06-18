import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";
import { MenuIcon } from "../icons/MenuIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { NoteIcon } from "../icons/NoteIcon";
import { MusicIcon } from "../icons/MusicIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { Button } from "./Buttons";
import { SidebarItem } from "./SidebarItems";
import { getCardTypeConfig } from "../config/cardConfig";
import { CardType } from "../types/cardTypes";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onFilterChange: (type: string) => void;
  currentFilter: string;
}

export function Sidebar({ sidebarOpen, setSidebarOpen, onFilterChange, currentFilter }: SidebarProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  // Helper function to get icon color for each content type
  const getIconColor = (type: CardType): string => {
    return getCardTypeConfig(type).color;
  };

  // Define sidebar items with their corresponding filter types
  const sidebarItems = [
    {
      title: "All Content",
      filterType: "all",
      icon: <div className="text-gray-600">📁</div>
    },
    {
      title: "Tweets",
      filterType: "twitter",
      icon: <div className={getIconColor("twitter")}><TwitterIcon /></div>
    },
    {
      title: "YouTube",
      filterType: "youtube", 
      icon: <div className={getIconColor("youtube")}><YoutubeIcon /></div>
    },
    {
      title: "Instagram",
      filterType: "instagram",
      icon: <div className={getIconColor("instagram")}><InstagramIcon /></div>
    },
    {
      title: "Music",
      filterType: "music",
      icon: <div className={getIconColor("music")}><MusicIcon /></div>
    },
    {
      title: "Notes",
      filterType: "note",
      icon: <div className={getIconColor("note")}><NoteIcon /></div>
    },
    {
      title: "Links",
      filterType: "link",
      icon: <div className={getIconColor("link")}><LinkIcon /></div>
    }
  ];

  return (
    <div
      className={`flex flex-col h-screen fixed top-0 left-0 z-50 overflow-hidden bg-white border-r transition-[width] duration-300 ${
        sidebarOpen ? "w-72" : "w-12 bg-gray-100 border-r-0"
      }`}
    >
      {/* Top Section */}
      <div className="pt-6 px-2 flex justify-between items-center">
        {sidebarOpen ? (
          <>
            <div className="flex items-center text-2xl opacity-100">
              <div className="pr-2 text-purple-800">
                <Logo />
              </div>
              <a href="/"><span>MindVault</span></a> 
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 hover:text-purple-700 transition-colors duration-200"
            >
              <MenuIcon />
            </button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-purple-700 transition-colors duration-200"
            >
              <MenuIcon />
            </button>
          </div>
        )}
      </div>

      {/* Navigation items */}
      <div
        className={`pt-8 transition-all duration-300 ${
          sidebarOpen
            ? "opacity-100 pl-2 max-h-[500px]"
            : "opacity-0 pl-0 max-h-0 pointer-events-none"
        }`}
      >
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.filterType}
            title={item.title}
            icon={item.icon}
            onClick={() => onFilterChange(item.filterType)}
            selected={currentFilter === item.filterType}
          />
        ))}
      </div>

      <div className="flex-grow" />

      {sidebarOpen && (
        <div className="p-4 mb-4">
          <Button
            onClick={handleSignOut}
            variant="primary"
            text="Sign Out"
            fullWidth
          />
        </div>
      )}
    </div>
  );
}