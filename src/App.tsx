import ChronosAuth from "./pages/ChronosAuth.tsx";
import { Routes, Route, useLocation } from "react-router-dom";
import ChronosDashboard from "./pages/ChronosDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreateCompany from "./pages/CreateCompany";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import RoleSpecificRoute from "./components/RoleSpecificRoute.tsx";
import ChronosLandingPage from "./pages/ChronosLandingPage.tsx";
import ChronosVacationRequests from "./pages/ChronosVacationRequests.tsx";
import ChronosCalendarView from "./pages/ChronosCalendarView.tsx";
import ChronosProfile from "./pages/ChronosProfile.tsx";
import Navbar from "./components/Navbar.tsx";
import ChronosAddVacationRequest from "./pages/ChronosAddVacationRequest.tsx";
import "react-toastify/dist/ReactToastify.css";



function App() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  // Get user data from localStorage for navbar display
  const userData = {
    name: localStorage.getItem("userName") ?? "Guest",
    role: localStorage.getItem("userRole") ?? "Employee",
    company: "Tech Solutions GmbH",
  };

  return (
    <div className="App">
      {/* Show navbar on all pages except login and superadmin routes */}
      {location.pathname !== "/auth" &&
        !location.pathname.startsWith("/superadmin") && (
          <Navbar userData={userData} />
        )}

      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<ChronosAuth />} />
        <Route path="/" element={<ChronosLandingPage />} />

        {/* Protected routes - require valid JWT token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ChronosDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vacation-requests"
          element={
            <ProtectedRoute>
              <ChronosVacationRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <ChronosCalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ChronosProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vacation-requests/new"
          element={
            <ProtectedRoute>
              <ChronosAddVacationRequest />
            </ProtectedRoute>
          }
        />


        {/* Role-specific routes - require valid JWT + specific role */}
        <Route
          path="/superadmin"
          element={
            <RoleSpecificRoute allowedRoles={["SUPERADMIN"]}>
              <SuperAdminDashboard />
            </RoleSpecificRoute>
          }
        />
        <Route
          path="/superadmin/create-company"
          element={
            <RoleSpecificRoute allowedRoles={["SUPERADMIN"]}>
              <CreateCompany />
            </RoleSpecificRoute>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
