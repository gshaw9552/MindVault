import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItems";

export function Sidebar() {
  return (
    <div className="h-screen bg-white border-r w-72 fixed left-0 top-0  pl-6">
      <div className="flex text-2xl pt-8 items-center">
        <div className="pr-2 text-purple-800"> 
            <Logo /> 
        </div>
        NeuraLink
      </div>
      <div className="pt-8 pl-4">
        <SidebarItem title="Tweets" icon={<TwitterIcon />} />
        <SidebarItem title="YouTube" icon={<YoutubeIcon />} />
      </div>
    </div>
  );
}
