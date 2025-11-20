import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { isTokenExpired } from "../utils/auth";

interface RoleSpecificRouteProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

function RoleSpecificRoute({
  allowedRoles,
  children,
  fallback,
}: RoleSpecificRouteProps) {
  const [checkedToken, setCheckedToken] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token && !isTokenExpired()) {
      setIsValidToken(true);
      const role = localStorage.getItem("userRole");
      setUserRole(role);
    } else {
      // Clear all auth data if token is missing or expired
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userCompanyId");
      setIsValidToken(false);
      setUserRole(null);
    }

    setCheckedToken(true);
  }, []);

  // While checking token, render nothing (or a loader)
  if (!checkedToken) return null;

  // Redirect to login if token is invalid
  if (!isValidToken) {
    return <Navigate to="/auth" replace />;
  }

  // Check role
  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <>
        {fallback || (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        )}
      </>
    );
  }

  // Token is valid and role is allowed
  return <>{children}</>;
}

export default RoleSpecificRoute;
