/**
 * Check if the authentication token is expired
 * @returns {boolean} True if token is expired or missing
 */
export function isTokenExpired(): boolean {
  const expiryTimestamp = localStorage.getItem("tokenExpiry");

  if (!expiryTimestamp) {
    return true; // No expiry means no valid token
  }

  const now = Date.now(); // Current time in milliseconds
  const expiry = parseInt(expiryTimestamp);

  return now >= expiry; // Returns true if current time is past expiry
}

/**
 * Check if token is expiring soon (within 5 minutes)
 * @returns {boolean} True if token expires in less than 5 minutes
 */
export function isTokenExpiringSoon(): boolean {
  const expiryTimestamp = localStorage.getItem("tokenExpiry");
  if (!expiryTimestamp) return false;

  const expiry = parseInt(expiryTimestamp);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Returns true if token expires in less than 5 minutes
  return expiry - now < fiveMinutes && expiry - now > 0;
}

/**
 * Get authentication headers for API calls
 * Automatically checks token expiration and redirects if expired
 * @returns {HeadersInit} Headers object with Authorization token
 * @throws {Error} If token is expired
 */
export function getAuthHeaders(): HeadersInit {
  // Check if token is expired
  if (isTokenExpired()) {
    // Clear all auth data
    logout();
    throw new Error("Token expired");
  }

  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Logout user by clearing all auth data and redirecting to login
 */
export function logout(): void {
  // Clear all stored auth data
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userCompanyId");

  // Redirect to login page
  window.location.href = "/auth";
}

/**
 * Check if user is authenticated with a valid token
 * @returns {boolean} True if user has valid token
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("authToken");
  return !!token && !isTokenExpired();
}
