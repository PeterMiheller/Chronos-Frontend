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

api.interceptors.request.use(
  (config) => {
    if (config.url?.includes("/auth/")) {
      return config;
    }
    const token = localStorage.getItem("authToken");
    if(token) {
    if (isTokenExpired()) {
      logout();
      return Promise.reject(new Error("Token expired"));
    }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);
