import ChronosAuth from "./pages/ChronosAuth.tsx";
import { Routes, Route, useLocation } from "react-router-dom";
import ChronosDashboard from "./pages/ChronosDashboard";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useState, useEffect } from "react";
import ChronosLandingPage from "./pages/ChronosLandingPage.tsx";
import ChronosVacationRequests from "./pages/ChronosVacationRequests.tsx";
import ChronosCalendarView from "./pages/ChronosCalendarView.tsx";
import ChronosProfile from "./pages/ChronosProfile.tsx";
import ChronosSettings from "./pages/ChronosSettings.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Get user data from localStorage or use defaults
  const userData = {
    name: localStorage.getItem("userName") || "John Doe",
    role: localStorage.getItem("userRole") || "Employee",
    company: "Tech Solutions GmbH",
  };

  return (
    <div className="App">
      {location.pathname !== "/auth" && <Navbar userData={userData} />}
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
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChronosSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
