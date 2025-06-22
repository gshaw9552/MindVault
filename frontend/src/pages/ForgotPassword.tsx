import axios from "axios";
import { useRef, useState } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config/config";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Logo } from "../icons/Logo";

export function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function sendResetCode() {
    const email = emailRef.current?.value;

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${BACKEND_URL}/api/v1/forgot-password`, {
        email
      });

      // Navigate to reset password page with email
      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      console.error("Forgot password error", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendResetCode();
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive a reset code</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    inputRef={emailRef}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <Button
                onClick={sendResetCode}
                variant="primary"
                text={isLoading ? "Sending..." : "Send Reset Code"}
                fullWidth={true}
                loading={isLoading}
              />
            </div>

            <div className="flex items-center mt-6 text-center">
              <p className="text-gray-600">
                Remember your password?{" "}
              </p>
              <Button
                onClick={() => navigate("/signin")}
                variant="normal"
                text="Sign in here"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}