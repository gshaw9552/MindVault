import axios from "axios";

import { useRef } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";

export function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function signup() {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        email, 
        password
    })
    alert("You have signed up!");
  }
  
  
   
  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-md p-6 w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <div className="space-y-3">
          <Input ref={usernameRef} placeholder="Username" />
          <Input ref={emailRef} placeholder="Email" type="email" />
          <Input ref={passwordRef} placeholder="Password" type="password" />
          <Button onClick={signup} variant="primary" text="Sign Up" fullWidth={true} loading={false} />
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account? <a href="/signin" className="text-purple-600">Login</a>
        </p>
      </div>
    </div>
  );
}
