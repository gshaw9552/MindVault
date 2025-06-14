import { ReactElement } from "react";

interface SidebarItemProp {
  title: string;
  icon: ReactElement;
  onClick: () => void;
  selected?: boolean;
}

export function SidebarItem({ title, icon, onClick, selected }: SidebarItemProp) {
  return (
    <div
      onClick={onClick}
      className={`
        flex p-2 items-center max-w-48 cursor-pointer rounded transition-all duration-300
        ${selected ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-500 hover:bg-gray-200"}
      `}
    >
      <div className="pr-2">{icon}</div>
      {title}
    </div>
  );
}
