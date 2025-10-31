import "./ChronosVacationRequests.css";

const ChronosVacationRequests = () => {
  const vacationRequests = [
    {
      id: 1,
      startDate: "2024-12-20",
      endDate: "2024-12-27",
      days: 6,
      status: "Approved",
      approvedBy: "Sarah Miller",
    },
    {
      id: 2,
      startDate: "2024-11-15",
      endDate: "2024-11-18",
      days: 2,
      status: "Pending",
      approvedBy: "-",
    },
    {
      id: 3,
      startDate: "2024-10-10",
      endDate: "2024-10-12",
      days: 3,
      status: "Approved",
      approvedBy: "Sarah Miller",
    },
    {
      id: 4,
      startDate: "2024-08-05",
      endDate: "2024-08-16",
      days: 10,
      status: "Rejected",
      approvedBy: "Sarah Miller",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Pending":
        return "status-pending";
      case "Rejected":
        return "status-rejected";
      default:
        return "status-default";
    }
  };

  return (
    <div className="vacation-requests-page">
      <main className="vacation-main-content">
        <section className="requests-section">
          <div className="requests-header">
            <h2>Vacation Requests</h2>
            <button className="new-request">+ New Request</button>
          </div>
          <table className="requests-table">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Status</th>
                <th>Approved By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vacationRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>{req.days}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusColor(req.status)}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>{req.approvedBy}</td>
                  <td>
                    <button className="view-btn">View PDF</button>
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
