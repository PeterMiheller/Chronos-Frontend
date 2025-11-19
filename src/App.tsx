import ChronosAuth from "./pages/ChronosAuth.tsx";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ChronosDashboard from "./pages/ChronosDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreateCompany from "./pages/CreateCompany";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import RoleSpecificRoute from "./components/RoleSpecificRoute.tsx";
import { useState, useEffect } from "react";
import ChronosLandingPage from "./pages/ChronosLandingPage.tsx";
import ChronosVacationRequests from "./pages/ChronosVacationRequests.tsx";
import ChronosCalendarView from "./pages/ChronosCalendarView.tsx";
import ChronosProfile from "./pages/ChronosProfile.tsx";
import Navbar from "./components/Navbar.tsx";
import { isTokenExpired } from "./utils/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for existing token on app load and validate expiration
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const publicRoutes = ["/auth", "/"];
    const currentPath = location.pathname;

    if (token && !isTokenExpired()) {
      setIsAuthenticated(true);
    } else if (token && isTokenExpired()) {
      // Token exists but is expired - clear it
      localStorage.clear();
      setIsAuthenticated(false);
      if (!publicRoutes.includes(currentPath)) {
        navigate("/auth");
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [location.pathname, navigate]);

  // Get user data from localStorage or use defaults
  const userData = {
    name: localStorage.getItem("userName") ?? "Guest",
    role: localStorage.getItem("userRole") ?? "Employee",
    company: "Tech Solutions GmbH",
  };

  return (
    <div className="App">
      {location.pathname !== "/auth" && 
       !location.pathname.startsWith("/superadmin") && 
       <Navbar userData={userData} />}
      <Routes>
        <Route
          path="/auth"
          element={<ChronosAuth setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/" element={<ChronosLandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChronosDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vacation-requests"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChronosVacationRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChronosCalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChronosProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin"
          element={
            <RoleSpecificRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["SUPERADMIN"]}
            >
              <SuperAdminDashboard />
            </RoleSpecificRoute>
          }
        />
        <Route
          path="/superadmin/create-company"
          element={
            <RoleSpecificRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["SUPERADMIN"]}
            >
              <CreateCompany />
            </RoleSpecificRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
