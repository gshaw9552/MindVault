import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface PrivateRouteProps {
  children: ReactNode;
}

interface JwtPayload { exp: number; /* plus any custom claims */ }

export function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/signin" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
