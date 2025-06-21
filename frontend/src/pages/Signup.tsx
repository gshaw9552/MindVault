import axios from "axios";
import { useRef, useState } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config/config";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Logo } from "../icons/Logo";

export function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function signup() {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        email, 
        password
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/verify-signup", {state: { email }});
      }, 2000);
    } catch(err: any) {
      console.error("Signup error", err.response?.data || err.message);
      setError(err.response?.data?.message || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      signup();
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to MindVault!</h2>
              <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
              <p className="text-sm text-gray-500">Redirecting you to sign in...</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <div className="text-white">
                  <Logo />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Start building your personal knowledge vault</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <Input 
                  inputRef={usernameRef} 
                  placeholder="Username"
                  onKeyDown={handleKeyDown}
                />
                <Input 
                  inputRef={emailRef} 
                  placeholder="Email" 
                  type="email"
                  onKeyDown={handleKeyDown}
                />
                <Input 
                  inputRef={passwordRef} 
                  placeholder="Password (min. 8 characters)" 
                  type="password"
                  onKeyDown={handleKeyDown}
                />
              </div>

              <Button 
                onClick={signup} 
                variant="primary" 
                text={isLoading ? "Creating account..." : "Create Account"}
                fullWidth={true} 
                loading={isLoading}
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline focus:outline-none focus:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}