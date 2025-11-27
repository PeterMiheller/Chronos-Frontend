import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  FileText,
  Calendar,
  Bell,
  LogOut,
  Briefcase,
} from "lucide-react";
import { logout, isAuthenticated } from "../utils/auth";
import "./Navbar.css";

interface NavbarProps {
  userData?: {
    name: string;
  };
}

const Navbar = ({ userData }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "ADMINISTRATOR";
  const isDashboard = location.pathname === "/dashboard";
  const isVacationRequests = location.pathname === "/vacation-requests";
  const isCalendar = location.pathname === "/calendar";
  const isProfile = location.pathname === "/profile";
  const isEmployeeRequests = location.pathname === "/employee-requests";
  const isSettings = location.pathname === "/settings";
  const isLanding = location.pathname === "/";
  const isEmployeeManagement = location.pathname === "/employee-management";
  const showDashboardNav =
    isDashboard ||
    isVacationRequests ||
    isCalendar ||
    isProfile ||
    isSettings ||
    isEmployeeRequests ||
    isEmployeeManagement;

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

        {showDashboardNav && (
          <>
            <div className="chronos-navbar-tabs">
              <button
                onClick={() => navigate("/dashboard")}
                className={`chronos-nav-tab ${isDashboard ? "active" : ""}`}
              >
                <User size={18} /> Dashboard
              </button>
              <button
                onClick={() => navigate("/vacation-requests")}
                className={`chronos-nav-tab ${
                  isVacationRequests ? "active" : ""
                }`}
              >
                <FileText size={18} />
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    lineHeight: "1.2",
                  }}
                >
                  <span>Create Vacation</span>
                  <span>Requests</span>
                </span>
              </button>
              <button
                onClick={() => navigate("/calendar")}
                className={`chronos-nav-tab ${isCalendar ? "active" : ""}`}
              >
                <Calendar size={18} /> Work Calendar
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigate("/employee-requests")}
                  className={`chronos-nav-tab ${
                    isEmployeeRequests ? "active" : ""
                  }`}
                >
                  <Briefcase size={18} /> Vacation Approvals
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => navigate("/employee-management")}
                  className={`chronos-nav-tab ${
                    isEmployeeManagement ? "active" : ""
                  }`}
                >
                  <Briefcase size={18} /> Employee Management
                </button>
              )}
            </div>

            <div className="chronos-navbar-user">
              <Bell size={20} className="chronos-icon" />
              <div
                className="chronos-user-info"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                <div className="chronos-user-avatar">
                  {userData?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </div>
                <span className="chronos-user-name">
                  {userData?.name || "User"}
                </span>
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
          </>
        )}

        {isLanding && (
          <button
            onClick={() => navigate("/auth")}
            className="chronos-navbar-btn"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
