import ChronosAuth from "./pages/ChronosAuth.tsx";
import { Routes, Route, useLocation } from "react-router-dom";
import ChronosDashboard from "./pages/ChronosDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreateCompany from "./pages/CreateCompany";
// import ProtectedRoute from "./components/ProtectedRoute.tsx";
// import RoleSpecificRoute from "./components/RoleSpecificRoute.tsx";
import ChronosLandingPage from "./pages/ChronosLandingPage.tsx";
import ChronosVacationRequests from "./pages/ChronosVacationRequests.tsx";
import ChronosCalendarView from "./pages/ChronosCalendarView.tsx";
import ChronosProfile from "./pages/ChronosProfile.tsx";
import Navbar from "./components/Navbar.tsx";


function App() {
  const location = useLocation();

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
            
              <ChronosDashboard />
           
          }
        />
        <Route
          path="/vacation-requests"
          element={
            
              <ChronosVacationRequests />
            
          }
        />
        <Route
          path="/calendar"
          element={
            
              <ChronosCalendarView />
            
          }
        />
        <Route
          path="/profile"
          element={
            
              <ChronosProfile />
            
          }
        />

        {/* Role-specific routes - require valid JWT + specific role */}
        <Route
          path="/superadmin"
          element={
            
              <SuperAdminDashboard />
            
          }
        />
        <Route
          path="/superadmin/create-company"
          element={
            
              <CreateCompany />
            
          }
        />
      </Routes>
    </div>
  );
}

export default App;
