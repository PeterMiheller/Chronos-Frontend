import "./ChronosEmployeeRequests.css";
import  { useState } from 'react';
import { vacationService } from "../api/vacationService";
import type { VacationStatus} from "../api/vacationService";


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
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);


    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved": return "status-approved";
            case "Pending": return "status-pending";
            case "Rejected": return "status-rejected";
            default: return "status-default";
        }
    };

    const processRequest = async (id: number, newStatus: VacationStatus) => {
        setActionLoading(true);
        setApiError(null);

        const requestToMove = pendingRequests.find(req => req.id === id);
        if (!requestToMove) {
            setApiError("Error: Request not found in the pending list.");
            setActionLoading(false);
            return;
        }

        try {

            await vacationService.updateVacationRequestStatus(id, newStatus);

            setPendingRequests(current => current.filter(req => req.id !== id));

            setProcessedRequests(current => [{ ...requestToMove, status: newStatus }, ...current]);

        } catch (err) {
            console.error(err);

            setApiError(`Failed to update request #${id}. Please try again.`);
        } finally {
            setActionLoading(false); // Re-enable buttons
        }
    };

    const handleApprove = (id: number) => {
        processRequest(id, "APPROVED");
    };

    const handleReject = (id: number) => {
        processRequest(id, "REJECTED");
    };

    const calculateDays = (start: string, end: string): number => {
            const date1 = new Date(start);
            const date2 = new Date(end);
            const diffTime = Math.abs(date2.getTime() - date1.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays + 1;
    };
    return (
        <div className="vacation-requests-page">
            <main className="vacation-main-content">

                {/* --- SECTION 1: ACTIONABLE REQUESTS --- */}
                <section className="requests-section">
                    <div className="requests-header">
                        <h2>Pending Employee Requests</h2>
                    </div>

                    {apiError && (
                        <div style={{ color: 'red', marginBottom: '1rem', border: '1px solid red', padding: '0.5rem', borderRadius: '0.5rem' }}>
                            <strong>Error:</strong> {apiError}
                        </div>
                    )}

                    <table className="requests-table">
                        <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pendingRequests.length > 0 ? (
                            pendingRequests.map((req) => (
                                <tr key={req.id}>
                                    <td>{req.employeeName}</td>
                                    <td>{new Date(req.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(req.endDate).toLocaleDateString()}</td>
                                    <td>{calculateDays(req.startDate, req.endDate)}</td>
                                    <td>
                                         <button
                                            onClick={() => handleApprove(req.id)}
                                            className="admin-action-btn admin-approve-btn"
                                            title="Approve Request"
                                            disabled={actionLoading}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            className="admin-action-btn admin-reject-btn"
                                            title="Reject Request"
                                            disabled={actionLoading}
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

                {/* --- SECTION 2: PROCESSED REQUESTS (from hardcoded data) --- */}
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
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {processedRequests.length > 0 ? (
                            processedRequests.map((req) => (
                                <tr key={req.id}>
                                    <td>{req.employeeName}</td>
                                    <td>{new Date(req.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(req.endDate).toLocaleDateString()}</td>
                                    <td>{calculateDays(req.startDate, req.endDate)}</td>
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