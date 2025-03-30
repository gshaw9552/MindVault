import { ReactElement } from "react";

export function SidebarItem({
  title,
  icon,
}: {
  title: string;
  icon: ReactElement;
}) {
  return (
    <div className="flex p-2 items-center text-gray-500 hover:bg-gray-200 rounded max-w-48 cursor-pointer transition-all duration-300">
      <div className="pr-2">{icon}</div>
      {title}
    </div>
  );
}
