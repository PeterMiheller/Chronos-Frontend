import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { isTokenExpired } from "../utils/auth";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: JSX.Element;
}

function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
  // Check both authentication state and token expiration
  if (!isAuthenticated || isTokenExpired()) {
    // Clear expired token data
    if (isTokenExpired()) {
      localStorage.clear();
    }
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
