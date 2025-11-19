import axios from "axios";
import { isTokenExpired, logout } from "../utils/auth";

export const API_BASE_URL = "http://localhost:8080/api/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request and check expiration
api.interceptors.request.use(
  (config) => {
    // Skip token check for auth endpoints
    if (config.url?.includes("/auth/")) {
      return config;
    }

    // Check if token is expired before making request
    if (isTokenExpired()) {
      logout();
      return Promise.reject(new Error("Token expired"));
    }

    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Redirect on 401 (unauthorized) - token is invalid or expired
    if (error.response?.status === 401) {
      logout();
    }
    // Don't redirect on 403 (forbidden) - user doesn't have permission
    // This is a different issue from authentication
    return Promise.reject(error);
  }
);
