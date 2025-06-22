import { useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons";
import { LightBulb } from "../icons/LightBulb";
import { Logo } from "../icons/Logo";
import { UploadIcon } from "../icons/UploadIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { Footer } from "../components/Footer";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-6xl min-h-screen">

        <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12">


          <div className="text-center max-w-4xl">

            <div className="mb-8 flex justify-center">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <div className="text-white">
                  <Logo />
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-bold mb-6 text-gray-900">
              MindVault
            </h1>

            <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
              Your personal knowledge hub for capturing, organizing, and discovering insights.
            </p>

            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Save articles, notes, and ideas in one place. Find what you need instantly with smart search.
            </p>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <div className="text-blue-600">
                    <LightBulb />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quick Capture</h3>
                <p className="text-sm text-gray-600">Save web pages, notes, and thoughts with smart tagging</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <div className="text-green-600">
                    <SearchIcon />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-sm text-gray-600">Find your content instantly with AI-powered search</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <div className="text-purple-600">
                    <LinkIcon />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Connect Ideas</h3>
                <p className="text-sm text-gray-600">Discover connections between your saved content</p>
              </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={() => navigate("/signup")}
                variant="primary"
                text="Get Started"
                startIcon={
                  <div className="text-white">
                    <LightBulb />
                  </div>
                }
              />
              <Button
                onClick={() => navigate("/public-brains")}
                variant="secondary"
                text="Browse Public Vaults"
                startIcon={
                  <div className="text-gray-600">
                    <UploadIcon />
                  </div>
                }
              />
            </div>

            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="text-purple-600 cursor-pointer hover:underline font-medium"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>

            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                MindVault is free and open source. Build your personal knowledge base and
                share insights with others in the community.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}