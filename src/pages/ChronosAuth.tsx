import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChronosAuth.css";
import { api } from "../api/config";
const ChronosAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      if (response.data.expiresAt) {
        localStorage.setItem("tokenExpiry", response.data.expiresAt.toString());
      }

      // Store user information
      if (response.data.id) {
        localStorage.setItem("userId", response.data.id.toString());
      }
      if (response.data.email) {
        localStorage.setItem("userEmail", response.data.email);
      }
      if (response.data.name) {
        localStorage.setItem("userName", response.data.name);
      }
      if (response.data.role) {
        localStorage.setItem("userRole", response.data.role);
      }
      if (response.data.companyId) {
        localStorage.setItem(
          "userCompanyId",
          response.data.companyId.toString()
        );
      }

      // Navigate based on user role
      // No need to call setIsAuthenticated - routes check localStorage directly
      if (response.data.role === "SUPERADMIN") {
        navigate("/superadmin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Auth error:", err);
      const errorMessage =
        (err as any).response?.data?.message ||
        (err as any).response?.data?.error ||
        "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chronos-container">
      <div className="chronos-wrapper">
        <div className="chronos-header">
          <h1 className="chronos-title">Chronos</h1>
          <p className="chronos-subtitle">Welcome back</p>
        </div>

        <div className="chronos-card">
          <h2 className="chronos-form-title">Login</h2>

          {error && <div className="chronos-error">{error}</div>}

          <form className="chronos-form" onSubmit={handleSubmit}>
            <div className="chronos-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="chronos-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="chronos-submit" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        </div>

        <p className="chronos-footer">© 2024 Chronos. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ChronosAuth;
