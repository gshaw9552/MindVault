import { Logo } from "../icons/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-white">
                  <Logo />
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">MindVault</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Your personal knowledge hub for capturing, organizing, and discovering insights.
              Build your personal knowledge base and share insights with others.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Routes</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-purple-600 transition-colors">Home</a></li>
              <li><a href="/public-brains" className="text-gray-600 hover:text-purple-600 transition-colors">Public Vaults</a></li>
              <li><a href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
            <ul className="space-y-2">
              <li><a href="/signin" className="text-gray-600 hover:text-purple-600 transition-colors">Sign In</a></li>
              <li><a href="/signup" className="text-gray-600 hover:text-purple-600 transition-colors">Sign Up</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} MindVault. Free and open source.
          </p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">Terms</a>
            <a href="https://github.com/gshaw9552" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}