import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full px-4 lg:px-6 py-4 border-b border-gray-200 shadow-sm bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <button
          className="flex items-center gap-3 text-xl font-bold text-purple-600 hover:text-purple-700 focus:text-purple-700 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg p-2 -m-2"
          onClick={() => navigate("/")}
          aria-label="Go to MindVault homepage"
        >
          <div className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Logo />
          </div>
          <span className="hidden sm:block">MindVault</span>
        </button>

        {/* Navigation Actions - placeholder for future navigation items */}
        <div className="flex items-center gap-4">
          {/* Add navigation items here in the future */}
        </div>
      </div>
    </header>
  );
}