import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { logout } from "../utils/auth";
import "./Navbar.css";

const SuperAdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdminDashboard = location.pathname === "/superadmin";
  const isUsers = location.pathname === "/superadmin/users";
  const isCompanies = location.pathname === "/superadmin/companies";

  // Get user data from localStorage
  const userName = localStorage.getItem("userName") || "SuperAdmin";

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="chronos-navbar">
      <div className="chronos-navbar-inner">
        <h1 className="chronos-navbar-logo" onClick={() => navigate("/")}>
          Chronos
        </h1>

        <div className="chronos-navbar-tabs">
          <button
            onClick={() => navigate("/superadmin")}
            className={`chronos-nav-tab ${
              isSuperAdminDashboard ? "active" : ""
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button
            onClick={() => navigate("/superadmin/users")}
            className={`chronos-nav-tab ${isUsers ? "active" : ""}`}
          >
            <Users size={18} /> Users
          </button>
          <button
            onClick={() => navigate("/superadmin/companies")}
            className={`chronos-nav-tab ${isCompanies ? "active" : ""}`}
          >
            <Building2 size={18} /> Companies
          </button>
        </div>

        <div className="chronos-navbar-user">
          <Bell size={20} className="chronos-icon" />
          <Settings
            size={20}
            className="chronos-icon"
            onClick={() => navigate("/superadmin/settings")}
            style={{ cursor: "pointer" }}
          />
          <div className="chronos-user-info" style={{ cursor: "pointer" }}>
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
