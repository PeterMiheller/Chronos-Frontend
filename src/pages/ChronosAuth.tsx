import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChronosAuth.css";
import type { ChronosAuthProps } from "../interfaces/ChronosAuthProps";
import { api } from "../api/config";

const ChronosAuth = ({ setIsAuthenticated }: ChronosAuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    companyName: "",
    role: "employee",
  });

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      if (isLogin) {
        // Login request
        const response = await api.post("auth/login", {
          email: formData.email,
          password: formData.password,
        });
        console.log("Login successful:", response.data);

        // Store token and user data from backend response
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
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

        // Mark user as authenticated
        setIsAuthenticated(true);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        // Register request
        const response = await api.post("auth/register", {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          role: formData.role,
        });
        console.log("Registration successful:", response.data);

        // After successful registration, switch to login
        alert("Registration successful! Please login.");
        toggleForm();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      companyName: "",
      role: "employee",
    });
  };

  return (
    <div className="chronos-container">
      <div className="chronos-wrapper">
        <div className="chronos-header">
          <h1 className="chronos-title">Chronos</h1>
          <p className="chronos-subtitle">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="chronos-card">
          <h2 className="chronos-form-title">
            {isLogin ? "Login" : "Register"}
          </h2>

          {error && <div className="chronos-error">{error}</div>}

          <form className="chronos-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="chronos-row">
                  <div className="chronos-field">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="chronos-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="chronos-field">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="chronos-field">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </>
            )}

            <div className="chronos-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
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
              />
            </div>

            {!isLogin && (
              <div className="chronos-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>
            )}

            {isLogin && (
              <div className="chronos-remember">
                <label className="chronos-checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Forgot password - to be implemented")}
                  className="chronos-forgot"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="chronos-submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <div className="chronos-toggle">
            <p>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button onClick={toggleForm} className="chronos-toggle-btn">
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>

        <p className="chronos-footer">© 2024 Chronos. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ChronosAuth;
