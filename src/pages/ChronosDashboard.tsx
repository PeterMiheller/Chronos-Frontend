
import { Clock, Calendar, FileText, User, Bell, Settings } from 'lucide-react';
import './ChronosDashboard.css';
import {useEffect, useState} from "react"; //

const ChronosDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCheckIn = () => {
        setIsCheckedIn(true);
        setCheckInTime(currentTime.toLocaleTimeString());
    };

    const handleCheckOut = () => {
        setIsCheckedIn(false);
        setCheckInTime(null);
        alert('Checked out successfully!');
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const userData = {
        name: 'John Doe',
        role: 'Employee',
        company: 'Tech Solutions GmbH',
        remainingVacationDays: 18,
        totalVacationDays: 25,
        expectedWorkload: 85,
        currentWorkload: 82,
    };

    const vacationRequests = [
        { id: 1, startDate: '2024-12-20', endDate: '2024-12-27', days: 6, status: 'Approved', approvedBy: 'Sarah Miller' },
        { id: 2, startDate: '2024-11-15', endDate: '2024-11-18', days: 2, status: 'Pending', approvedBy: '-' },
        { id: 3, startDate: '2024-10-10', endDate: '2024-10-12', days: 3, status: 'Approved', approvedBy: 'Sarah Miller' },
        { id: 4, startDate: '2024-08-05', endDate: '2024-08-16', days: 10, status: 'Rejected', approvedBy: 'Sarah Miller' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'status-approved';
            case 'Pending': return 'status-pending';
            case 'Rejected': return 'status-rejected';
            default: return 'status-default';
        }
    };

    return (
        <div className="dashboard">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold text-primary">Chronos</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <button onClick={() => setActiveTab('dashboard')} className={`btn nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}>
                                    <User className="me-1" /> Dashboard
                                </button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => setActiveTab('requests')} className={`btn nav-link ${activeTab === 'requests' ? 'active' : ''}`}>
                                    <FileText className="me-1" /> Vacation Requests
                                </button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => setActiveTab('calendar')} className={`btn nav-link ${activeTab === 'calendar' ? 'active' : ''}`}>
                                    <Calendar className="me-1" /> Work Calendar
                                </button>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            <Bell className="me-3" />
                            <Settings className="me-3" />
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px' }}>
                                    {userData.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span>{userData.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>


            {/* Main Content */}
            <main className="main-content">
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
                        <button onClick={handleCheckIn} disabled={isCheckedIn}>Clock In</button>
                        <button onClick={handleCheckOut} disabled={!isCheckedIn}>Clock Out</button>
                    </div>
                </section>

                <section className="info-section">
                    <div className="card">
                        <h3>Remaining Vacation</h3>
                        <p>{userData.remainingVacationDays} of {userData.totalVacationDays} days</p>
                    </div>
                    <div className="card">
                        <h3>Current Workload</h3>
                        <p>{userData.currentWorkload}% (Expected: {userData.expectedWorkload}%)</p>
                    </div>
                    <div className="card">
                        <h3>Company</h3>
                        <p>{userData.company}</p>
                        <p>Role: {userData.role}</p>
                    </div>
                </section>

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
                                <td><span className={`status-badge ${getStatusColor(req.status)}`}>{req.status}</span></td>
                                <td>{req.approvedBy}</td>
                                <td><button className="view-btn">View PDF</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default ChronosDashboard;
