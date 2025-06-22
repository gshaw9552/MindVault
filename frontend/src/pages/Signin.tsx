import axios from "axios";
import { useRef, useState } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config/config";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Logo } from "../icons/Logo";


export function Signin() {
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function signin() {
    const identifier = identifierRef.current?.value;
    const password = passwordRef.current?.value;

    if (!identifier || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        email: identifier?.includes("@") ? identifier : undefined,
        username: !identifier?.includes("@") ? identifier : undefined,
        password
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signin error", err.response?.data || err.message);
      setError(err.response?.data?.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      signin();
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your MindVault account</p>
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
                  placeholder="Username or Email"
                  inputRef={identifierRef}
                  onKeyDown={handleKeyDown}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  inputRef={passwordRef}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <Button
                onClick={signin}
                variant="primary"
                text={isLoading ? "Signing in..." : "Sign In"}
                fullWidth={true}
                loading={isLoading}
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline focus:outline-none focus:underline"
                >
                  Create one here
                </button>
              </p>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline focus:outline-none focus:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}