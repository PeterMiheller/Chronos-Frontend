
export function isTokenExpired(): boolean {
  const expiryTimestamp = localStorage.getItem("tokenExpiry");

  if (!expiryTimestamp) {
    return true; 
  }

  const now = Date.now(); 
  const expiry = parseInt(expiryTimestamp, 10);

  return now >= expiry; 
}


export function isTokenExpiringSoon(): boolean {
  const expiryTimestamp = localStorage.getItem("tokenExpiry");
  if (!expiryTimestamp) return false;

  const expiry = parseInt(expiryTimestamp);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000; 
  return expiry - now < fiveMinutes && expiry - now > 0;
}


export function getAuthHeaders(): HeadersInit {
  if (isTokenExpired()) {
    logout();
    throw new Error("Token expired");
  }

  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function logout(): void {
  // Clear all stored auth data
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userCompanyId");

  window.location.href = "/auth";
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("authToken");
  return !!token && !isTokenExpired();
}
