import ChronosAuth from "./pages/ChronosAuth.tsx";
import { Routes, Route, useLocation } from "react-router-dom";
import ChronosDashboard from "./pages/ChronosDashboard";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useState } from "react";
import ChronosLandingPage from "./pages/ChronosLandingPage.tsx";
import ChronosVacationRequests from "./pages/ChronosVacationRequests.tsx";
import ChronosCalendarView from "./pages/ChronosCalendarView.tsx";
import ChronosProfile from "./pages/ChronosProfile.tsx";
import ChronosSettings from "./pages/ChronosSettings.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const location = useLocation();

  const userData = {
    name: "John Doe",
    role: "Employee",
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
