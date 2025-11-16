import "./ChronosEmployeeRequests.css";
import  { useState } from 'react';

// This is our full hardcoded data source
const allRequests = [
    { id: 1, startDate: "2024-12-20", endDate: "2024-12-27", days: 6, status: "Approved", employeeName: "Mihai Popescu" },
    { id: 2, startDate: "2024-11-15", endDate: "2024-11-18", days: 2, status: "Pending", employeeName: "Ana Ionescu" },
    { id: 3, startDate: "2024-10-10", endDate: "2024-10-12", days: 3, status: "Approved", employeeName: "Mihai Popescu" },
    { id: 4, startDate: "2024-08-05", endDate: "2024-08-16", days: 10, status: "Rejected", employeeName: "Vlad Stoica" },
    { id: 5, startDate: "2024-12-23", endDate: "2024-12-23", days: 1, status: "Pending", employeeName: "Ana Ionescu" },
];

// Define the type for a request (good practice)
interface EmployeeRequest {
    id: number;
    startDate: string;
    endDate: string;
    days: number;
    status: string;
    employeeName: string;
}

const ChronosEmployeeRequests = () => {


    const [pendingRequests, setPendingRequests] = useState<EmployeeRequest[]>(() =>
        allRequests.filter(req => req.status === "Pending")
    );
    const [processedRequests, setProcessedRequests] = useState<EmployeeRequest[]>(() =>
        allRequests.filter(req => req.status === "Approved" || req.status === "Rejected")
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved": return "status-approved";
            case "Pending": return "status-pending";
            case "Rejected": return "status-rejected";
            default: return "status-default";
        }
    };


    const handleApprove = (id: number) => {
        alert(`Approving request #${id}. (This will be an API call)`);

        // Find the request to move
        const requestToMove = pendingRequests.find(req => req.id === id);
        if (!requestToMove) return;

        // 1. Remove from pending list
        setPendingRequests(current => current.filter(req => req.id !== id));

        // 2. Add to processed list with the new status
        setProcessedRequests(current => [{ ...requestToMove, status: "Approved" }, ...current]);
    };

    // Simulates rejecting a request
    const handleReject = (id: number) => {
        alert(`Rejecting request #${id}. (This will be an API call)`);

        const requestToMove = pendingRequests.find(req => req.id === id);
        if (!requestToMove) return;

        // 1. Remove from pending list
        setPendingRequests(current => current.filter(req => req.id !== id));

        // 2. Add to processed list with the new status
        setProcessedRequests(current => [{ ...requestToMove, status: "Rejected" }, ...current]);
    };
    // --- END UPDATED ACTION LOGIC ---

    return (
        <div className="vacation-requests-page">
            <main className="vacation-main-content">

                {/* --- SECTION 1: ACTIONABLE REQUESTS --- */}
                <section className="requests-section">
                    <div className="requests-header">
                        <h2>Pending Employee Requests</h2>
                    </div>
                    <table className="requests-table">
                        <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            {/* The 'Status' column is removed, as they are all pending */}
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pendingRequests.length > 0 ? (
                            pendingRequests.map((req) => (
                                <tr key={req.id}>
                                    <td>{req.employeeName}</td>
                                    <td>{req.startDate}</td>
                                    <td>{req.endDate}</td>
                                    <td>{req.days}</td>
                                    <td>
                                        <button
                                            onClick={() => handleApprove(req.id)}
                                            className="admin-action-btn admin-approve-btn"
                                            title="Approve Request"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            className="admin-action-btn admin-reject-btn"
                                            title="Reject Request"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: '#6b7280' }}>
                                    No pending requests.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </section>

                {/* --- SECTION 2: PROCESSED REQUESTS --- */}
                <section className="requests-section" style={{ marginTop: '2rem' }}>
                    <div className="requests-header">
                        <h2>Processed Requests</h2>
                    </div>
                    <table className="requests-table">
                        <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Status</th> {/* Status column is back */}
                        </tr>
                        </thead>
                        <tbody>
                        {processedRequests.length > 0 ? (
                            processedRequests.map((req) => (
                                <tr key={req.id}>
                                    <td>{req.employeeName}</td>
                                    <td>{req.startDate}</td>
                                    <td>{req.endDate}</td>
                                    <td>{req.days}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusColor(req.status)}`}>
                                          {req.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: '#6b7280' }}>
                                    No processed requests yet.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </section>

            </main>
        </div>
    );
};

export default ChronosEmployeeRequests;