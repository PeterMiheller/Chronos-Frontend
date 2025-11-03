import "./ChronosCalendarView.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const ChronosCalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Hardcoded events for now
  const events = [
    { day: 15, type: "vacation", label: "Vacation Day" },
    { day: 20, type: "meeting", label: "Team Meeting" },
    { day: 25, type: "deadline", label: "Project Deadline" },
  ];

  const getEventForDay = (day: number) => {
    return events.find(event => event.day === day);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const event = getEventForDay(day);
      const isToday = 
        day === new Date().getDate() &&
        currentMonth.getMonth() === new Date().getMonth() &&
        currentMonth.getFullYear() === new Date().getFullYear();

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${event ? 'has-event' : ''}`}
        >
          <span className="day-number">{day}</span>
          {event && (
            <div className={`event-indicator ${event.type}`}>
              {event.label}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="calendar-page">
      <main className="calendar-main-content">
        <div className="calendar-container">
          <div className="calendar-header">
            <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
            <div className="calendar-navigation">
              <button onClick={previousMonth} className="nav-btn">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="nav-btn">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>

          <div className="calendar-grid">
            {renderCalendarDays()}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot vacation"></span>
              <span>Vacation</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot meeting"></span>
              <span>Meeting</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot deadline"></span>
              <span>Deadline</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChronosCalendarView;
