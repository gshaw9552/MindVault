import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { PrivateRoute } from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { PublicBrains } from "./pages/PublicBrainPage";
import { SharedBrainView } from "./pages/SharedBrainView";
import { Profile } from "./pages/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoute } from "./components/PublicRoute";
import { VerifySignup } from "./pages/VerifySignup";
import { ResetPassword } from "./pages/ResetPassword";
import { ForgotPassword } from "./pages/ForgotPassword";
import { SemanticSearch } from "./pages/SemanticSearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <Signin />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-signup"
          element={
            <PublicRoute>
              <VerifySignup />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SemanticSearch />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/public-brains" element={<PublicBrains />} />
        <Route path="/brain/share/:shareLink" element={<SharedBrainView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
