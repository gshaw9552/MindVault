import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config/config";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Logo } from "../icons/Logo";

export function VerifySignup() {
  const otpRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      navigate("/signup");
      return;
    }
    setEmail(emailFromState);
  }, [location.state, navigate]);

  async function verifyOTP() {
    const otp = otpRef.current?.value;

    if (!otp) {
      setError("Please enter the verification code");
      return;
    }

    if (otp.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/verify-signup-otp`, {
        email,
        otp
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Verify OTP error", err.response?.data || err.message);
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyOTP();
    }
  };

  const resendOTP = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${API_BASE}/resend-signup-otp`, {
        email,
      });
      setError("");
      alert("New verification code sent!");
    } catch (err: any) {
      setError("Failed to resend code. Please try signing up again.");
    } finally {
      setIsLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>
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
                    Verification Code
                  </label>
                  <Input
                    placeholder="Enter 6-digit code"
                    inputRef={otpRef}
                    onKeyDown={handleKeyDown}
                    maxLength={6}
                  />
                </div>
              </div>

              <Button
                onClick={verifyOTP}
                variant="primary"
                text={isLoading ? "Verifying..." : "Verify Email"}
                fullWidth={true}
                loading={isLoading}
              />
            </div>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={resendOTP}
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline focus:outline-none focus:underline"
                  disabled={isLoading}
                >
                  Resend code
                </button>
              </p>
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => navigate("/signup")}
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline focus:outline-none focus:underline"
                >
                  Back to signup
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}