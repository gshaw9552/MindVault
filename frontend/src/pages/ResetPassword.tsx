import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Buttons";
import { API_BASE } from "../config/config";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill email if came from forgot password flow
  const prefilledEmail = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const email = emailRef.current?.value.trim() || "";
    const otp = otpRef.current?.value.trim() || "";
    const newPassword = passwordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";

    if (!email || !otp || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Reset failed");
      }

      alert("Password reset successful!");
      navigate("/signin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to your email and set a new password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              inputRef={emailRef}
              type="email"
              placeholder="Email address"
              defaultValue={prefilledEmail}
              required
            />
            <Input
              inputRef={otpRef}
              type="text"
              placeholder="Enter OTP code"
              maxLength={6}
              required
            />
            <Input
              inputRef={passwordRef}
              type="password"
              placeholder="New password"
              required
            />
            <Input
              inputRef={confirmPasswordRef}
              type="password"
              placeholder="Confirm new password"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            text={loading ? "Resetting..." : "Reset Password"}
            fullWidth
            disabled={loading}
          />

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}