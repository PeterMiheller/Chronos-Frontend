import { Users, Building2, TrendingUp } from "lucide-react";
import "./SuperAdminDashboard.css";
import { useEffect, useState } from "react";
import { userService, type User } from "../api/userService";
import SuperAdminNavbar from "../components/SuperAdminNavbar";

interface CompanyStats {
  totalCompanies: number;
  totalEmployees: number;
  totalAdministrators: number;
}

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<CompanyStats>({
    totalCompanies: 0,
    totalEmployees: 0,
    totalAdministrators: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all employees
      const allUsers = await userService.getAllEmployees();
      setUsers(allUsers);

      // Calculate stats
      const companies = new Set(
        allUsers.map((u) => u.company?.id).filter(Boolean)
      );
      const employees = allUsers.filter((u) => u.userType === "EMPLOYEE");
      const admins = allUsers.filter((u) => u.userType === "ADMINISTRATOR");

      setStats({
        totalCompanies: companies.size,
        totalEmployees: employees.length,
        totalAdministrators: admins.length,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <SuperAdminNavbar userData={userData} />
        <div className="superadmin-dashboard">
          <main className="main-content">
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <p>Loading...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SuperAdminNavbar userData={userData} />
        <div className="superadmin-dashboard">
          <main className="main-content">
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#ef4444" }}
            >
              <p>{error}</p>
              <button
                onClick={fetchDashboardData}
                style={{ marginTop: "1rem" }}
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SuperAdminNavbar/>
      <div className="superadmin-dashboard">
        <main className="main-content">
          <div className="header">
            <h1>SuperAdmin Dashboard</h1>
            <p className="subtitle">System Overview & Management</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon companies">
                <Building2 />
              </div>
              <div className="stat-info">
                <h3>{stats.totalCompanies}</h3>
                <p>Total Companies</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon employees">
                <Users />
              </div>
              <div className="stat-info">
                <h3>{stats.totalEmployees}</h3>
                <p>Total Employees</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon admins">
                <Users />
              </div>
              <div className="stat-info">
                <h3>{stats.totalAdministrators}</h3>
                <p>Administrators</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon activity">
                <TrendingUp />
              </div>
              <div className="stat-info">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          <section className="users-section">
            <div className="section-header">
              <h2>Recent Users</h2>
              <span className="user-count">{users.length} users</span>
            </div>

            {users.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  padding: "2rem",
                }}
              >
                No users found
              </p>
            ) : (
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Company</th>
                      <th>Vacation Days</th>
                      <th>Workload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={`type-badge ${user.userType.toLowerCase()}`}
                          >
                            {user.userType}
                          </span>
                        </td>
                        <td>{user.company?.name || "N/A"}</td>
                        <td>
                          {user.vacationDaysRemaining !== null &&
                          user.vacationDaysTotal !== null
                            ? `${user.vacationDaysRemaining} / ${user.vacationDaysTotal}`
                            : "N/A"}
                        </td>
                        <td>
                          {user.expectedWorkload !== null
                            ? `${user.expectedWorkload}%`
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Company Distribution */}
          <section className="companies-section">
            <h2>Company Distribution</h2>
            <div className="companies-grid">
              {Array.from(
                new Set(users.map((u) => u.company?.name).filter(Boolean))
              ).map((companyName) => {
                const companyUsers = users.filter(
                  (u) => u.company?.name === companyName
                );
                return (
                  <div key={companyName} className="company-card">
                    <h3>{companyName}</h3>
                    <div className="company-stats">
                      <div className="company-stat">
                        <span className="stat-label">Employees</span>
                        <span className="stat-value">
                          {
                            companyUsers.filter(
                              (u) => u.userType === "EMPLOYEE"
                            ).length
                          }
                        </span>
                      </div>
                      <div className="company-stat">
                        <span className="stat-label">Admins</span>
                        <span className="stat-value">
                          {
                            companyUsers.filter(
                              (u) => u.userType === "ADMINISTRATOR"
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
