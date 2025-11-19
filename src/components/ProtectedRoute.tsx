import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { isTokenExpired } from "../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [checkedToken, setCheckedToken] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Read token from localStorage
    const token = localStorage.getItem("authToken");

    // Check if token exists and is not expired
    if (token && !isTokenExpired()) {
      setIsValidToken(true);
    } else {
      // Clear any expired or invalid auth data
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userCompanyId");
      setIsValidToken(false);
    }

    // Mark that token check is done
    setCheckedToken(true);
  }, []);

  // While checking token, render nothing (or a loader)
  if (!checkedToken) return null;

  // Redirect to login if token is invalid
  if (!isValidToken) {
    return <Navigate to="/auth" replace />;
  }

  // Token is valid, render children
  return <>{children}</>;
}

export default ProtectedRoute;
