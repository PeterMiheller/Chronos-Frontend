import "./ChronosCalendarView.css";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { eventService, type Event } from "../api/eventService";

const ChronosCalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isManager, setIsManager] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventType, setEventType] = useState<"TEAM_MEETING" | "PROJECT_DEADLINE">("TEAM_MEETING");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    // Check if user is a manager (ADMINISTRATOR role)
    const userRole = localStorage.getItem("userRole");
    console.log("User role from localStorage:", userRole); // Debug log
    setIsManager(userRole === "ADMINISTRATOR");

    // Fetch events for the current month
    fetchEvents();
  }, [currentMonth]);

  const fetchEvents = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1; // JavaScript months are 0-indexed
      const fetchedEvents = await eventService.getEventsForMonth(year, month);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

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

  const handleAddEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventType("TEAM_MEETING");
    setEventDate("");
    setEventTime("");
    setProjectName("");
  };

  const handleSubmitEvent = async () => {
    try {
      if (!eventDate || !eventTime) {
        alert("Please select both date and time");
        return;
      }

      if (eventType === "PROJECT_DEADLINE" && !projectName) {
        alert("Please enter a project name");
        return;
      }

      const eventDateTime = `${eventDate}T${eventTime}:00`;

      await eventService.createEvent({
        type: eventType,
        eventDateTime,
        projectName: eventType === "PROJECT_DEADLINE" ? projectName : undefined,
      });

      handleCloseModal();
      fetchEvents(); // Refresh events
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  const handleDayClick = (day: number) => {
    const dayEvents = getEventForDay(day);
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setShowDetailsModal(true);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDayEvents([]);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await eventService.deleteEvent(eventId);
      alert("Event deleted successfully!");
      fetchEvents(); // Refresh events
      
      // Update the selected day events
      const updatedEvents = selectedDayEvents.filter(e => e.id !== eventId);
      setSelectedDayEvents(updatedEvents);
      
      // Close modal if no more events
      if (updatedEvents.length === 0) {
        handleCloseDetailsModal();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const formatEventDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.eventDateTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const getEventLabel = (event: Event) => {
    if (event.type === "TEAM_MEETING") {
      return "Team Meeting";
    } else if (event.type === "PROJECT_DEADLINE") {
      return event.projectName || "Project Deadline";
    }
    return "Event";
  };

  const getEventTypeClass = (event: Event) => {
    return event.type === "TEAM_MEETING" ? "meeting" : "deadline";
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventForDay(day);
      const isToday = 
        day === new Date().getDate() &&
        currentMonth.getMonth() === new Date().getMonth() &&
        currentMonth.getFullYear() === new Date().getFullYear();

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-event' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          {dayEvents.map((event, index) => (
            <div key={index} className={`event-indicator ${getEventTypeClass(event)}`}>
              {getEventLabel(event)}
            </div>
          ))}
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
              {isManager && (
                <button onClick={handleAddEvent} className="nav-btn add-event-btn">
                  <Plus size={20} />
                </button>
              )}
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

        {/* Add Event Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Event</h3>
                <button onClick={handleCloseModal} className="close-btn">
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Event Type</label>
                  <div className="event-type-selector">
                    <button
                      className={`type-btn ${eventType === "TEAM_MEETING" ? "active" : ""}`}
                      onClick={() => setEventType("TEAM_MEETING")}
                    >
                      Team Meeting
                    </button>
                    <button
                      className={`type-btn ${eventType === "PROJECT_DEADLINE" ? "active" : ""}`}
                      onClick={() => setEventType("PROJECT_DEADLINE")}
                    >
                      Project Deadline
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="form-input"
                  />
                </div>

                {eventType === "PROJECT_DEADLINE" && (
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button onClick={handleCloseModal} className="btn-cancel">
                  Cancel
                </button>
                <button onClick={handleSubmitEvent} className="btn-submit">
                  Create Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {showDetailsModal && (
          <div className="modal-overlay event-details-modal" onClick={handleCloseDetailsModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Events on this Day</h3>
                <button onClick={handleCloseDetailsModal} className="close-btn">
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                {selectedDayEvents.length > 0 ? (
                  <div className="event-details-list">
                    {selectedDayEvents.map((event) => (
                      <div key={event.id} className="event-detail-item">
                        <div className="event-detail-header">
                          <div>
                            <h4 className="event-detail-title">
                              {getEventLabel(event)}
                              <span className={`event-detail-type ${getEventTypeClass(event)}`}>
                                {event.type === "TEAM_MEETING" ? "Meeting" : "Deadline"}
                              </span>
                            </h4>
                          </div>
                        </div>
                        <div className="event-detail-info">
                          <p><strong>Time:</strong> {formatEventDateTime(event.eventDateTime)}</p>
                          {event.projectName && (
                            <p><strong>Project:</strong> {event.projectName}</p>
                          )}
                          <p><strong>Created by:</strong> {event.createdByName}</p>
                        </div>
                        {isManager && (
                          <button 
                            onClick={() => handleDeleteEvent(event.id)} 
                            className="btn-delete"
                          >
                            Delete Event
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-events-message">No events on this day</p>
                )}
              </div>

              <div className="modal-footer">
                <button onClick={handleCloseDetailsModal} className="btn-cancel">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChronosCalendarView;
