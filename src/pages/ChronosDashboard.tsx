import { Clock, LogOut, LogIn, Briefcase, Calendar, TrendingUp } from "lucide-react";
import "./ChronosDashboard.css";
import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import type { User } from "../api/userService";
import { vacationService } from "../api/vacationService";
import type { VacationRequest } from "../api/vacationService";
import { api } from "../api/config";
import { toast } from "react-toastify";
import { timesheetService } from "../api/timesheetService";

interface DashboardSummary {
  user: User;
  vacationDaysSummary: {
    total: number;
    used: number;
    remaining: number;
  };
  weeklyHours: {
    hoursThisWeek: number;
    targetHours: number;
  };
  pendingRequests: number;
}

interface TimesheetToday {
  id: number;
  employeeId: number;
  clockInTime: string | null;
  clockOutTime: string | null;
  date: string;
  hoursWorked: number | null;
  isClockedIn: boolean;
}

const ChronosDashboard = () => {


  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [todayTimesheet, setTodayTimesheet] = useState<TimesheetToday | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clockingIn, setClockingin] = useState(false);
  const [clockingOut, setClockinOut] = useState(false);



  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const refreshInterval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setError("No user logged in. Please log in again.");
        return;
      }

      const summary = await api.get(`/users/${userId}/dashboard-summary`);
      setDashboardData(summary.data);

      const today = await api.get("/timesheets/today");
      setTodayTimesheet(today.data);

      const week = await api.get("/timesheets/current-week");
      setWeeklyData(week.data);

      // Update calendar with today's hours
      if (today.data?.hoursWorked) {
        await updateCalendarWithTodayHours(today.data.hoursWorked);
      }
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      const errorMessage = err.response?.data?.message || "Failed to load dashboard data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCalendarWithTodayHours = async (hours: number) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await timesheetService.setHours(today, hours);
      console.log("Calendar updated with today's hours:", hours);
    } catch (err) {
      console.error("Error updating calendar:", err);
    }
  };

  const handleClockIn = async () => {
    try {
      setClockingin(true);
      const now = new Date();
      // Format: YYYY-MM-DD
      const today = now.toISOString().split("T")[0];
      // Format: HH:mm:ss (ensure 2 digits for hours/mins/secs)
      const time = now.toLocaleTimeString('en-GB', { hour12: false }); 

      console.log("Clock in request:", { date: today, time });

      await api.post("/timesheets/clock-in", {
        date: today,
        time: time,
      });

      toast.success("Clocked in successfully!");
      await fetchDashboardData();
    } catch (err: any) {
      console.log("Full error response:", err.response?.data);
      // Check if it's the "already clocked in" message
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to clock in";
      
      if (errorMessage.includes("Already clocked in")) {
         toast.info("You are already clocked in for today.");
         // Refresh data to sync state
         await fetchDashboardData();
      } else {
         toast.error(errorMessage);
      }
      console.error("Clock in error:", err);
    } finally {
      setClockingin(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setClockinOut(true);
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const time = now.toLocaleTimeString('en-GB', { hour12: false });

      await api.post("/timesheets/clock-out", {
        date: today,
        time: time,
      });

      toast.success("Clocked out successfully!");
      await fetchDashboardData();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to clock out";
      toast.error(errorMessage);
      console.error("Clock out error:", err);
    } finally {
      setClockinOut(false);
    }
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

  const getCircleProgress = () => {
    if (!todayTimesheet?.hoursWorked) return 0;
    const target = 8; // 8-hour workday
    return Math.min((todayTimesheet.hoursWorked / target) * 100, 100);
  };

  const getVacationProgress = () => {
    if (!dashboardData?.vacationDaysSummary) return 0;
    const { total, remaining } = dashboardData.vacationDaysSummary;
    if (total === 0) return 0;
    return ((total - remaining) / total) * 100;
  };

  const getWorkloadProgress = () => {
    if (!dashboardData?.weeklyHours) return 0;
    const { hoursThisWeek, targetHours } = dashboardData.weeklyHours;
    if (targetHours === 0) return 0;
    return Math.min((hoursThisWeek / targetHours) * 100, 100);
  };

  const circleProgress = getCircleProgress();
  const circumference = 2 * Math.PI * 50; // Increased radius slightly for better look
  const strokeDashoffset = circumference - (circleProgress / 100) * circumference;

  if (loading) {
    return (
      <div className="dashboard">
        <main className="dashboard-main">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="dashboard">
        <main className="dashboard-main">
          <div className="error-container">
            <p className="error-text">{error}</p>
            <button onClick={fetchDashboardData} className="retry-btn">
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        {/* Header Welcome Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Welcome back, {dashboardData?.user.name}!</h1>
            <p className="header-subtitle">
              {dashboardData?.user.company?.name || "Company"} •{" "}
              {dashboardData?.user.userType}
            </p>
          </div>
          {/* Removed the old header-time div since we moved time to the clock card */}
        </div>

        {/* Clock In/Out Section */}
        <section className="clock-section">
          {/* Redesigned Clock Card */}
          <div className="circular-clock-card">
            <div className="clock-card-header">
              <div className="digital-clock">{formatTime(currentTime)}</div>
              <div className="digital-date">{formatDate(currentTime)}</div>
            </div>

            <div className="circular-clock-container">
              <svg className="circle-progress" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="progress-circle"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="clock-center-info">
                <div className="hours-value-large">
                  {todayTimesheet?.hoursWorked ? todayTimesheet.hoursWorked.toFixed(1) : "0.0"}
                </div>
                <div className="hours-label-small">HOURS TODAY</div>
                {todayTimesheet?.isClockedIn ? (
                  <div className="status-pill clocked-in">On Duty</div>
                ) : (
                  <div className="status-pill clocked-out">Off Duty</div>
                )}
              </div>
            </div>

            <div className="clock-actions">
              <button
                className={`action-btn btn-in ${todayTimesheet?.isClockedIn ? 'disabled' : ''}`}
                onClick={handleClockIn}
                disabled={todayTimesheet?.isClockedIn || clockingIn}
              >
                <LogIn size={20} />
                <span>Clock In</span>
              </button>
              <button
                className={`action-btn btn-out ${!todayTimesheet?.isClockedIn ? 'disabled' : ''}`}
                onClick={handleClockOut}
                disabled={!todayTimesheet?.isClockedIn || clockingOut}
              >
                <LogOut size={20} />
                <span>Clock Out</span>
              </button>
            </div>
          </div>

          {/* Redesigned Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper vacation">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Vacation Days</span>
                <div className="stat-number">
                  {dashboardData?.vacationDaysSummary.remaining || 0}
                  <span className="stat-total">/{dashboardData?.vacationDaysSummary.total || 0}</span>
                </div>
              </div>
              <div className="stat-footer">
                <div className="progress-bar-mini">
                  <div
                    className="progress-fill vacation"
                    style={{ width: `${getVacationProgress()}%` }}
                  ></div>
                </div>
                <span className="stat-subtext">{getVacationProgress().toFixed(0)}% Used</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper workload">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Weekly Hours</span>
                <div className="stat-number">
                  {dashboardData?.weeklyHours.hoursThisWeek.toFixed(1) || 0}
                  <span className="stat-unit">h</span>
                </div>
              </div>
              <div className="stat-footer">
                <div className="progress-bar-mini">
                  <div
                    className="progress-fill workload"
                    style={{ width: `${getWorkloadProgress()}%` }}
                  ></div>
                </div>
                <span className="stat-subtext">Target: {dashboardData?.weeklyHours.targetHours}h</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper requests">
                <Briefcase size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Pending Requests</span>
                <div className="stat-number">
                  {dashboardData?.pendingRequests || 0}
                </div>
              </div>
              <div className="stat-footer">
                <span className="stat-subtext">Awaiting approval</span>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Hours Breakdown */}
        {weeklyData.length > 0 && (
          <section className="weekly-section">
            <h2>This Week's Hours</h2>
            <div className="weekly-grid">
              {weeklyData.map((day, index) => {
                const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                return (
                  <div key={index} className="weekly-card">
                    <div className="day-name">{dayNames[index] || `Day ${index + 1}`}</div>
                    <div className="day-hours">
                      {day.hoursWorked ? `${day.hoursWorked.toFixed(1)}h` : "—"}
                    </div>
                    {day.isClockedIn && (
                      <div className="day-status">
                        <span className="status-indicator"></span>
                        Ongoing
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Employee Info Card */}
        {dashboardData?.user && (
          <section className="employee-section">
            <h2>Employee Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Employee ID</label>
                <p>{dashboardData.user.id}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{dashboardData.user.email}</p>
              </div>
              <div className="info-item">
                <label>Company</label>
                <p>{dashboardData.user.company?.name || "N/A"}</p>
              </div>
              <div className="info-item">
                <label>Role</label>
                <p>{dashboardData.user.userType}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ChronosDashboard;