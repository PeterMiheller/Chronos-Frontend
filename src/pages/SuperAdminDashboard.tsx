import "./SuperAdminDashboard.css";
import SuperAdminNavbar from "../components/SuperAdminNavbar";

const SuperAdminDashboard = () => {
  return (
    <>
      <SuperAdminNavbar />
      <div className="superadmin-dashboard">
        <main className="main-content">
          <div className="header">
            <h1>Company Management</h1>
            <p className="subtitle">Manage all companies in the system</p>
          </div>

          
        </main>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
