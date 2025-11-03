import { useNavigate, useLocation } from "react-router-dom";
import { User, FileText, Calendar, Bell, Settings, LogOut } from "lucide-react";
import "./Navbar.css";

interface NavbarProps {
  userData?: {
    name: string;
  };
}

const Navbar = ({ userData }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const isVacationRequests = location.pathname === "/vacation-requests";
  const isCalendar = location.pathname === "/calendar";
  const isProfile = location.pathname === "/profile";
  const isSettings = location.pathname === "/settings";
  const isLanding = location.pathname === "/";
  const showDashboardNav =
    isDashboard || isVacationRequests || isCalendar || isProfile || isSettings;

  return (
    <nav className="chronos-navbar">
      <div className="chronos-navbar-inner">
        <h1 className="chronos-navbar-logo" onClick={() => navigate("/")}>
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
                <FileText size={18} /> Vacation Requests
              </button>
              <button
                onClick={() => navigate("/calendar")}
                className={`chronos-nav-tab ${isCalendar ? "active" : ""}`}
              >
                <Calendar size={18} /> Work Calendar
              </button>
            </div>

            <div className="chronos-navbar-user">
              <Bell size={20} className="chronos-icon" />
              <Settings
                size={20}
                className="chronos-icon"
                onClick={() => navigate("/settings")}
                style={{ cursor: "pointer" }}
              />
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
                onClick={() => navigate("/auth")}
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
