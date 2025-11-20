import axios from "axios";
import { useState, useEffect } from "react";
import "./ChronosVacationRequests.css";
import { useNavigate, useLocation } from "react-router-dom";

interface VacationRequest {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  administratorId: number;
}

const ChronosVacationRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);

  const calculateWorkingDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    let count = 0;

    while (s <= e) {
      const day = s.getDay();
      if (day !== 0 && day !== 6) count++;
      s.setDate(s.getDate() + 1);
    }

    return count;
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const administratorId = localStorage.getItem("administratorId");

    console.log("VacationRequests userId=", userId, "token=", !!token);

    if (!userId || !token) {
        console.warn("No userId or token found, skipping request.");
        return;
    }

    axios
        .get(`http://localhost:8080/api/vacation-requests/employee/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setVacationRequests(res.data))
        .catch((err) => console.error("Error loading vacation requests:", err));
}, []);


  return (
    <div className="vacation-requests-page">
      <main className="vacation-main-content">
        <section className="requests-section">
          <div className="requests-header">
            <h2>Vacation Requests</h2>

            <button
              className="new-request"
              onClick={() =>
                navigate("/vacation-requests/new", {
                  state: { backgroundLocation: location },
                })
              }
            >
              + New Request
            </button>
          </div>

          <table className="requests-table">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Status</th>
                <th>Approved By</th>
              </tr>
            </thead>

            <tbody>
              {vacationRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>{calculateWorkingDays(req.startDate, req.endDate)}</td>
                  <td className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </td>
                  <td>
                    {req.status === "APPROVED"
                      ? `Admin #${req.administratorId}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default ChronosVacationRequests;
