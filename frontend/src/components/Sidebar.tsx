import { Logo } from "../icons/Logo";
import { MenuIcon } from "../icons/MenuIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItems";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <div
      className={`h-screen fixed top-0 left-0 z-50 overflow-hidden bg-white border-r transition-[width] duration-300 ${
        sidebarOpen ? "w-72" : "w-12 bg-gray-100 border-r-0"
      }`}
    >
      {/* Top Section */}
      <div className="pt-6 px-2 flex justify-between items-center">
        {sidebarOpen ? (
          <>
            <div className="flex items-center text-2xl transition-opacity duration-300 opacity-100">
              <div className="pr-2 text-purple-800">
                <Logo />
              </div>
              <span>NeuraLink</span>
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
        <SidebarItem title="Tweets" icon={<TwitterIcon />} />
        <SidebarItem title="YouTube" icon={<YoutubeIcon />} />
      </div>
    </div>
  );
}
