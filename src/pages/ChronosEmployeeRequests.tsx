import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

// Import necessary types and services
import { vacationService, type VacationRequest, type VacationStatus } from "../api/vacationService";
import { userService } from '../api/userService';
import "./ChronosEmployeeRequests.css";

// Extended interface for the UI, combining raw request data with the employee's name (fetched separately)
interface UIRequest extends VacationRequest {
    employeeName: string;
}

const ChronosEmployeeRequests = () => {
    // State to store raw requests fetched from the backend (which only contain employeeId)
    const [requests, setRequests] = useState<VacationRequest[]>([]);

    // Local cache for employee names: { employeeId: employeeName }
    // This is crucial for performance (avoiding N+1 queries by fetching names once).
    const [employeeNamesCache, setEmployeeNamesCache] = useState<Record<number, string>>({});

    // State to track which request is currently being processed (ID or null)
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [apiError, setApiError] = useState<string | null>(null);

    // State for confirmation dialog
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        id: number;
        action: 'APPROVED' | 'REJECTED';
        message: string;
    } | null>(null);

    // Function to fetch vacation requests and populate the employee names cache
    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            // Get the logged-in admin's ID
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }

            // Step 1: Get all vacation requests assigned to the current administrator using ID
            // Changed from getVacationRequestsByAdministrator() to getVacationRequestsForAdmin(id)
            const data: VacationRequest[] = await vacationService.getVacationRequestsForAdmin(Number(userId));
            setRequests(data);

            // Step 2: Identify unique employee IDs present in the fetched requests
            const uniqueEmployeeIds = [...new Set(data.map(req => req.employeeId))];

            // Step 3: Filter IDs that are not already in the cache
            const idsToFetch = uniqueEmployeeIds.filter(id => !employeeNamesCache[id]);

            // Step 4: Asynchronously fetch the names for the new employee IDs
            const namePromises = idsToFetch.map(id =>
                // Fetch user data using the employee ID
                userService.getUserById(String(id))
                    .then(user => ({ id, name: user.name }))
                    // Handle failure to fetch a specific user name
                    .catch(() => ({ id, name: `User #${id} (Error)` }))
            );

            const fetchedNames = await Promise.all(namePromises);

            // Step 5: Update the local cache ONLY IF new names were fetched (Fix for infinite loop)
            if (fetchedNames.length > 0) {
                setEmployeeNamesCache(currentCache => {
                    const newCache = { ...currentCache };
                    fetchedNames.forEach(item => {
                        newCache[item.id] = item.name;
                    });
                    return newCache;
                });
            } // <--- BRACE CORRECTED HERE (closing 'if' block)

        } catch (err: any) { // <--- CATCH BLOCK IS NOW CORRECTLY PLACED (closing 'try' block)
            console.error("Error fetching requests:", err);
            // Error handling for API fetch
            const message = err.response?.data?.message || err.message || "Unknown error";
            setApiError(`Failed to load employee data: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [employeeNamesCache]); // Dependency ensures that cache updates trigger a re-fetch if needed

    useEffect(() => {
        // Initial data fetch on component mount
        fetchRequests();
    }, [fetchRequests]);

    // Memoized list: Combines raw requests with employee names from the cache
    const uiRequests: UIRequest[] = useMemo(() => {
        return requests.map(req => ({
            ...req,
            // Look up the employee name from the cache
            employeeName: employeeNamesCache[req.employeeId] || `Loading User ID: ${req.employeeId}`
        }));
    }, [requests, employeeNamesCache]);

    // Filter requests for the Pending table (only PENDING status)
    const pendingRequests = useMemo(() =>
            uiRequests.filter(req => req.status === "PENDING"),
        [uiRequests]
    );

    // Filter requests for the Processed table
    const processedRequests = useMemo(() =>
            uiRequests.filter(req => req.status === "APPROVED" || req.status === "REJECTED"),
        [uiRequests]
    );

    /**
     * Handles the approval or rejection process for a specific request.
     * @param id The ID of the vacation request.
     * @param newStatus The new status ("APPROVED" or "REJECTED").
     */
    const processRequest = async (id: number, newStatus: VacationStatus) => {
        setActionLoading(id);
        setApiError(null);
        setShowConfirmDialog(false);

        try {
            console.log(`Updating vacation request ${id} to status: "${newStatus}"`);
            await vacationService.updateVacationRequestStatus(id, newStatus);

            const successMessage = newStatus === "APPROVED"
                ? `Request #${id} has been approved successfully.`
                : `Request #${id} has been rejected.`;

            toast.success(successMessage, {
                position: "top-center",
                autoClose: 3000,
            });

            // Refresh the entire list to reflect the status change and move the request between tables
            await fetchRequests();

        } catch (err: any) {
            console.error("API Error:", err);
            console.error("Error response:", err.response);

            // Extract the most relevant error message
            let apiMessage = `Failed to process request #${id}.`;

            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    apiMessage = err.response.data;
                } else if (err.response.data.message) {
                    apiMessage = err.response.data.message;
                } else if (err.response.data.error) {
                    apiMessage = err.response.data.error;
                }
            }

            // Provide helpful message for insufficient vacation days
            if (err.response?.status === 400 && !apiMessage.toLowerCase().includes('vacation')) {
                apiMessage = "Not enough vacation days remaining for this employee.";
            }

            console.error("Error message:", apiMessage);
            toast.error(apiMessage, {
                position: "top-center",
                autoClose: 5000,
            });
            setApiError(apiMessage);
        } finally {
            setActionLoading(null);
        }
    };

    // Handler for approving a request
    const handleApprove = (id: number) => {
        setConfirmAction({
            id,
            action: 'APPROVED',
            message: 'Are you sure you want to approve this vacation request? This will deduct days from the employee\'s remaining vacation balance.'
        });
        setShowConfirmDialog(true);
    };

    // Handler for rejecting a request
    const handleReject = (id: number) => {
        setConfirmAction({
            id,
            action: 'REJECTED',
            message: 'Are you sure you want to reject this vacation request?'
        });
        setShowConfirmDialog(true);
    };

    // Handler for confirming the action
    const handleConfirm = () => {
        if (confirmAction) {
            processRequest(confirmAction.id, confirmAction.action);
        }
    };

    // Handler for canceling the action
    const handleCancel = () => {
        setShowConfirmDialog(false);
        setConfirmAction(null);
    };

    /**
     * Calculates the number of days between two ISO date strings (inclusive).
     * @param start Start date string (ISO format).
     * @param end End date string (ISO format).
     */
    const calculateDays = (start: string, end: string): number => {
        const date1 = new Date(start);
        const date2 = new Date(end);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1; // +1 to include the start day
    };

    /**
     * Returns the appropriate CSS class for the status badge.
     * @param status The vacation status string.
     */
    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "status-approved";
            case "REJECTED": return "status-rejected";
            case "PENDING": return "status-pending";
            default: return "status-default";
        }
    };

    // --- RENDER CONDITIONS ---

    // Display a loader while fetching initial data
    if (loading) {
        return <div className="vacation-requests-page" style={{ textAlign: 'center', padding: '3rem' }}>Loading requests...</div>;
    }

    // --- MAIN RENDER ---
    return (
        <div className="vacation-requests-page">
            <main className="vacation-main-content">
                <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '1.5rem' }}>
                    Vacation Approvals
                </h1>

                {/* API Error Notification (visible if an action or fetch failed) */}
                {apiError && (
                    <div className="error-message" style={{ color: '#dc2626', marginBottom: '1rem', border: '1px solid #fee2e2', background: '#fef2f2', padding: '1rem', borderRadius: '0.5rem' }}>
                        <strong>Attention:</strong> {apiError}
                    </div>
                )}

                {/* --- SECTION 1: PENDING REQUESTS --- */}
                <section className="requests-section">
                    <div className="requests-header">
                        <h2>Pending Requests ({pendingRequests.length})</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="requests-table">
                            <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
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
                                        <td>#{req.id}</td>
                                        <td>{req.employeeId}</td>
                                        {/* Display name from cache */}
                                        <td>{req.employeeName}</td>
                                        <td>{new Date(req.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(req.endDate).toLocaleDateString()}</td>
                                        <td>{calculateDays(req.startDate, req.endDate)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="admin-action-btn admin-approve-btn"
                                                    title="Approve Request"
                                                    disabled={actionLoading === req.id || actionLoading !== null}
                                                >
                                                    {actionLoading === req.id ? 'Processing...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.id)}
                                                    className="admin-action-btn admin-reject-btn"
                                                    title="Reject Request"
                                                    disabled={actionLoading === req.id || actionLoading !== null}
                                                >
                                                    {actionLoading === req.id ? 'Processing...' : 'Reject'}
                                                </button>
                                                {req.pdfPath && (
                                                    <a
                                                        href={req.pdfPath}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="view-btn"
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        View PDF
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>
                                         No pending requests.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* --- SECTION 2: PROCESSED REQUESTS --- */}
                <section className="requests-section" style={{ marginTop: '2rem' }}>
                    <div className="requests-header">
                        <h2>Processed Requests ({processedRequests.length})</h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="requests-table">
                            <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Days</th>
                                <th>Status</th>
                                <th>PDF</th>
                            </tr>
                            </thead>
                            <tbody>
                            {processedRequests.length > 0 ? (
                                processedRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td>#{req.id}</td>
                                        <td>{req.employeeId}</td>
                                        <td>{req.employeeName}</td>
                                        <td>{new Date(req.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(req.endDate).toLocaleDateString()}</td>
                                        <td>{calculateDays(req.startDate, req.endDate)}</td>
                                        <td>
                                                <span className={`status-badge ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                        </td>
                                        <td>
                                            {req.pdfPath ? (
                                                <a
                                                    href={req.pdfPath}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="view-btn"
                                                    style={{ border: 'none', background: 'transparent' }}
                                                >
                                                    View PDF
                                                </a>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>
                                        No processed requests yet.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>

            {/* Confirmation Dialog Modal */}
            {showConfirmDialog && confirmAction && (
                <div className="page-overlay">
                    <div className="confirmation-modal">
                        <h2 className="confirmation-title">
                            {confirmAction.action === 'APPROVED' ? 'Approve Request' : 'Reject Request'}
                        </h2>
                        <p className="confirmation-message">{confirmAction.message}</p>
                        <div className="confirmation-buttons">
                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                                disabled={actionLoading !== null}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={handleConfirm}
                                disabled={actionLoading !== null}
                            >
                                {actionLoading !== null ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChronosEmployeeRequests;