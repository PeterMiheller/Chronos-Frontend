import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Plus, LogOut } from "lucide-react";
import { logout, isAuthenticated } from "../utils/auth";
import "./Navbar.css";

const SuperAdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdminDashboard = location.pathname === "/superadmin";
  const isCreateCompany = location.pathname === "/superadmin/create-company";

  // Get user data from localStorage
  const userName = localStorage.getItem("userName") || "SuperAdmin";

  const handleLogoClick = () => {
    if (isAuthenticated()) {
      const userRole = localStorage.getItem("userRole");
      if (userRole === "SUPERADMIN") {
        navigate("/superadmin");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="chronos-navbar">
      <div className="chronos-navbar-inner">
        <h1 className="chronos-navbar-logo" onClick={handleLogoClick}>
          Chronos
        </h1>

        <div className="chronos-navbar-tabs">
          <button
            onClick={() => navigate("/superadmin")}
            className={`chronos-nav-tab ${
              isSuperAdminDashboard ? "active" : ""
            }`}
          >
            <Building2 size={18} /> Companies
          </button>
          <button
            onClick={() => navigate("/superadmin/create-company")}
            className={`chronos-nav-tab ${isCreateCompany ? "active" : ""}`}
          >
            <Plus size={18} /> Create Company
          </button>
        </div>

        <div className="chronos-navbar-user">
          <div
            className="chronos-user-info"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          >
            <div className="chronos-user-avatar">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("") || "SA"}
            </div>
            <span className="chronos-user-name">{userName}</span>
          </div>
          <button
            className="chronos-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;
