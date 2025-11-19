import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { isTokenExpired } from "../utils/auth";

interface RoleSpecificRouteProps {
  isAuthenticated: boolean;
  allowedRoles: string[];
  children: JSX.Element;
  fallback?: JSX.Element;
}

function RoleSpecificRoute({
  isAuthenticated,
  allowedRoles,
  children,
  fallback,
}: RoleSpecificRouteProps) {
  // Check both authentication state and token expiration
  if (!isAuthenticated || isTokenExpired()) {
    // Clear expired token data
    if (isTokenExpired()) {
      localStorage.clear();
    }
    return <Navigate to="/auth" replace />;
  }

  const userRole = localStorage.getItem("userRole");

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      fallback || (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      )
    );
  }

  return children;
}

export default RoleSpecificRoute;
