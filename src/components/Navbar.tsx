import { useNavigate, useLocation } from "react-router-dom";
import { User, FileText, Calendar, Bell, Settings } from "lucide-react";
import "./Navbar.css";

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  userData?: {
    name: string;
  };
}

const Navbar = ({ activeTab, setActiveTab, userData }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const isVacationRequests = location.pathname === "/vacation-requests";
  const isLanding = location.pathname === "/";
  const showDashboardNav = isDashboard || isVacationRequests;

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
                onClick={() => {
                  setActiveTab?.("dashboard");
                  navigate("/dashboard");
                }}
                className={`chronos-nav-tab ${isDashboard ? "active" : ""}`}
              >
                <User size={18} /> Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab?.("requests");
                  navigate("/vacation-requests");
                }}
                className={`chronos-nav-tab ${
                  isVacationRequests ? "active" : ""
                }`}
              >
                <FileText size={18} /> Vacation Requests
              </button>
              <button
                onClick={() => setActiveTab?.("calendar")}
                className={`chronos-nav-tab ${
                  activeTab === "calendar" ? "active" : ""
                }`}
              >
                <Calendar size={18} /> Work Calendar
              </button>
            </div>

            <div className="chronos-navbar-user">
              <Bell size={20} className="chronos-icon" />
              <Settings size={20} className="chronos-icon" />
              <div className="chronos-user-info">
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
