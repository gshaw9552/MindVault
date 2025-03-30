import { Button } from "../components/Buttons";
import { Input } from "../components/Input";

export function Signin() {
  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-md p-6 w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>

        <div className="space-y-3">
          <Input placeholder="Username or Email" />
          {/* <Input placeholder="Email" type="email" /> */}
          <Input placeholder="Password" type="password" />
          <Button variant="primary" text="Sign In" fullWidth={true} loading={true} />
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don't have an account? <a href="/signup" className="text-purple-600">Register</a>
        </p>
      </div>
    </div>
  );
}
