import React from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onFilterChange: (type: string) => void;
  currentFilter: string;
  children: React.ReactNode;
}

export function Layout({ sidebarOpen, setSidebarOpen, onFilterChange, currentFilter, children }: LayoutProps) {
  return (
    <div className="flex">
      <Sidebar
        onFilterChange={onFilterChange}
        currentFilter={currentFilter}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen} />
      <main className={`flex-1 p-4 ${sidebarOpen ? "ml-72" : "ml-16"} bg-gray-100 min-h-screen`}>
        {children}
      </main>
    </div>
  );
}
