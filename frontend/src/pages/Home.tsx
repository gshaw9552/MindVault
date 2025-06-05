import { useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons";
import { LightBulb } from "../icons/LightBulb";
import { Logo } from "../icons/Logo";
import { UploadIcon } from "../icons/UploadIcon";


export function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Container with margins on sides */}
      <div className="mx-auto max-w-6xl min-h-screen">
        {/* Main content area with subtle background */}
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-8 py-12">
          
          {/* Content container */}
          <div className="text-center max-w-4xl">
            
            {/* Logo */}
            <div className="text-purple-600 mb-6 flex justify-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <Logo />
              </div>
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl font-bold mb-4 text-center text-gray-900">
              NeuraLink
            </h1>
            
            {/* Primary description */}
            <p className="text-xl text-gray-600 mb-6 text-center max-w-2xl mx-auto">
              Save, organize, and explore your personal content with AI-powered search.
            </p>
            
            {/* Secondary description */}
            <p className="text-md text-gray-500 mb-8 text-center max-w-xl mx-auto leading-relaxed">
              Build your digital second brain. Store content and retrieve it effortlessly with intelligent search.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                onClick={() => navigate("/signup")}
                variant="primary"
                text="Get Started"
                startIcon={<LightBulb />}
              />
              <Button
                onClick={() => navigate("/public-brains")}
                variant="secondary"
                text="Explore Shared Brains"
                startIcon={<UploadIcon />}
              />
            </div>
            
            {/* Sign in link */}
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="text-purple-600 cursor-pointer hover:underline"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}