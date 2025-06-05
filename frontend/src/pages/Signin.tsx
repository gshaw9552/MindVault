import axios from "axios";
import { useRef } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export function Signin() {
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
    const identifier = identifierRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        email: identifier?.includes("@") ? identifier : undefined,
        username: !identifier?.includes("@") ? identifier : undefined,
        password
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      alert("Signed in successfully");
      navigate("/dashboard");
    } catch(err: any) {
      console.error("Signin error", err.response?.data || err.message);
      alert(err.response?.data?.message || "Sign in failed");
    }
  }
  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-md p-6 w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>

        <div className="space-y-3">
          <Input placeholder="Username or Email" ref={identifierRef} />
          <Input placeholder="Password" type="password" ref={passwordRef} />
          <Button onClick={signin} variant="primary" text="Sign In" fullWidth={true} loading={false} />
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don't have an account? <a href="/signup" className="text-purple-600">Register</a>
        </p>
      </div>
    </div>
  );
}
