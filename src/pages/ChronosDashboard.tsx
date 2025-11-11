import { Clock } from "lucide-react";
import "./ChronosDashboard.css";
import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import type { User } from "../api/userService";
import { vacationService } from "../api/vacationService";
import type { VacationRequest } from "../api/vacationService";

const ChronosDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // demo only until login
  const EMPLOYEE_ID = 5;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user data
      const user = await userService.getUserById(EMPLOYEE_ID);
      setUserData(user);

      // Fetch vacation requests
      const requests = await vacationService.getVacationRequestsByEmployee(EMPLOYEE_ID);
      setVacationRequests(requests);

    } catch (err) {
      console.error("Error fetching employee data:", err);
      setError("Failed to load employee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(currentTime.toLocaleTimeString());
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    alert("Checked out successfully!");
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#22c55e";
      case "REJECTED":
        return "#ef4444";
      case "SUBMITTED":
        return "#3b82f6";
      case "CREATED":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "3rem", color: "#ef4444" }}>
            <p>{error}</p>
            <button onClick={fetchEmployeeData} style={{ marginTop: "1rem" }}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard">
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p>No user data found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <main className="main-content">
        <div style={{ marginBottom: "2rem" }}>
          <h1>Welcome, {userData.name}!</h1>
          <p style={{ color: "#6b7280" }}>
            {userData.company?.name || "No Company"} • {userData.userType}
          </p>
        </div>

        <section className="time-section">
          <h2>Time Clock</h2>
          <Clock className="clock-icon" />
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>

          {isCheckedIn ? (
            <div className="status in">Clocked In — Since {checkInTime}</div>
          ) : (
            <div className="status out">Clocked Out</div>
          )}

          <div className="buttons">
            <button onClick={handleCheckIn} disabled={isCheckedIn}>
              Clock In
            </button>
            <button onClick={handleCheckOut} disabled={!isCheckedIn}>
              Clock Out
            </button>
          </div>
        </section>

        <section className="info-section">
          <div className="card">
            <h3>Remaining Vacation</h3>
            <p>
              {userData.vacationDaysRemaining || 0} of {userData.vacationDaysTotal || 0} days
            </p>
            <div
              style={{
                width: "100%",
                height: "8px",
                background: "#e5e7eb",
                borderRadius: "4px",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  width: `${
                    userData.vacationDaysTotal
                      ? ((userData.vacationDaysRemaining || 0) / userData.vacationDaysTotal) * 100
                      : 0
                  }%`,
                  height: "100%",
                  background: "#3b82f6",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
          <div className="card">
            <h3>Expected Workload</h3>
            <p>{userData.expectedWorkload || 0}%</p>
          </div>
          <div className="card">
            <h3>Company</h3>
            <p>{userData.company?.name || "N/A"}</p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {userData.company?.address || "No address"}
            </p>
          </div>
        </section>

        <section className="vacation-requests" style={{ marginTop: "2rem" }}>
          <h2>Vacation Requests</h2>
          {vacationRequests.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
              No vacation requests found
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "1rem", textAlign: "left" }}>ID</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>Start Date</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>End Date</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "1rem", textAlign: "left" }}>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {vacationRequests.map((request) => (
                    <tr key={request.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "1rem" }}>#{request.id}</td>
                      <td style={{ padding: "1rem" }}>
                        {new Date(request.startDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {new Date(request.endDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            background: getStatusColor(request.status) + "20",
                            color: getStatusColor(request.status),
                          }}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {request.pdfPath ? (
                          <a
                            href={request.pdfPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#3b82f6", textDecoration: "underline" }}
                          >
                            View PDF
                          </a>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ChronosDashboard;