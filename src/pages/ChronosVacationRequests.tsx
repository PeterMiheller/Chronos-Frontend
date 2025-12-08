import { useState, useEffect } from "react";
import "./ChronosVacationRequests.css";
import { useNavigate, useLocation } from "react-router-dom";
import { vacationService, type VacationRequest as ServiceVacationRequest } from "../api/vacationService";
import { Download } from "lucide-react";
import { toast } from "react-toastify";

const ChronosVacationRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vacationRequests, setVacationRequests] = useState<ServiceVacationRequest[]>([]);
  const [filter, setFilter] = useState<string>("all");

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

    if (!userId) return;

    // Use centralized API service which handles base URL and auth
    vacationService
      .getVacationRequestsByEmployee(Number(userId))
      .then((res) => setVacationRequests(res))
      .catch((err) => console.error("Error loading vacation requests:", err));
  }, []);

  const handleDownloadPdf = async (id: number) => {
    try {
      const blob = await vacationService.downloadPdf(id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vacation_request_${id}.pdf`);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Error downloading PDF:", err);
      const status = err.response?.status;
      if (status === 404) {
        toast.error("PDF not found for this request.");
      } else if (status === 403) {
        toast.error("You do not have permission to download this PDF.");
      } else {
        toast.error("Failed to download PDF.");
      }
    }
  };
 
  const filteredRequests = vacationRequests.filter((req) => {
    if (filter === "all") return true;
    return req.status.toLowerCase() === filter;
  });

  return (
    <div className="vacation-requests-page">
      <main className="vacation-main-content">
        <section className="requests-section">

          <div className="requests-header">
            <h2>Vacation Requests</h2>

            <div className="top-controls">
              <select
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

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
          </div>

          {/* TABLE */}
          <table className="requests-table">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Status</th>
                <th>PDF</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>{calculateWorkingDays(req.startDate, req.endDate)}</td>
                  <td className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </td>
                  <td>
                    {req.status === "APPROVED" ? (
                      <button
                        onClick={() => handleDownloadPdf(req.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 1rem",
                          background: "white",
                          color: "#2563eb",
                          border: "1px solid #2563eb",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#2563eb";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.color = "#2563eb";
                        }}
                        title="Download PDF"
                      >
                        <Download size={16} /> Download
                      </button>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>—</span>
                    )}
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
