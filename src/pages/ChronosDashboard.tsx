import { Clock } from "lucide-react";
import "./ChronosDashboard.css";
import { useEffect, useState } from "react";

const ChronosDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

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

  const userData = {
    name: "John Doe",
    role: "Employee",
    company: "Tech Solutions GmbH",
    remainingVacationDays: 18,
    totalVacationDays: 25,
    expectedWorkload: 85,
    currentWorkload: 82,
  };



  return (
    <div className="dashboard">
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
              {userData.remainingVacationDays} of {userData.totalVacationDays}{" "}
              days
            </p>
          </div>
          <div className="card">
            <h3>Current Workload</h3>
            <p>
              {userData.currentWorkload}% (Expected: {userData.expectedWorkload}
              %)
            </p>
          </div>
          <div className="card">
            <h3>Company</h3>
            <p>{userData.company}</p>
            <p>Role: {userData.role}</p>
          </div>
        </section>


      </main>
    </div>
  );
};

export default ChronosDashboard;
