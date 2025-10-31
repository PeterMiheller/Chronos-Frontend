import ChronosAuth from "./pages/ChronosAuth.tsx";
import { Routes, Route, useLocation } from "react-router-dom";
import ChronosDashboard from "./pages/ChronosDashboard";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useState } from "react";
import ChronosLandingPage from "./pages/ChronosLandingPage.tsx";
import ChronosVacationRequests from "./pages/ChronosVacationRequests.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();

  const userData = {
    name: "John Doe",
    role: "Employee",
    company: "Tech Solutions GmbH",
  };

  return (
    <div className="App">
      {location.pathname !== "/auth" && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userData={userData}
        />
      )}
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
      </Routes>
    </div>
  );
}

export default App;
