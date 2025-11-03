import { Mail, Phone, MapPin, Briefcase, Calendar, Clock } from "lucide-react";
import "./ChronosProfile.css";

const ChronosProfile = () => {
  // Hardcoded user data
  const userData = {
    name: "John Doe",
    email: "john.doe@techsolutions.com",
    phone: "+49 123 456 7890",
    role: "Senior Software Engineer",
    department: "Engineering",
    company: "Tech Solutions GmbH",
    location: "Berlin, Germany",
    joinDate: "January 15, 2022",
    employeeId: "EMP-2022-1234",
    vacationDays: {
      total: 30,
      used: 12,
      remaining: 18,
    },
    workSchedule: {
      hoursPerWeek: 40,
      workDays: "Monday - Friday",
      startTime: "09:00",
      endTime: "17:00",
    },
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1 className="profile-title">My Profile</h1>

        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {userData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="profile-header-info">
            <h2>{userData.name}</h2>
            <p className="profile-role">{userData.role}</p>
            <p className="profile-employee-id">ID: {userData.employeeId}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="profile-section">
          <h3 className="profile-section-title">Contact Information</h3>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <Mail size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Email</p>
                <p className="profile-info-value">{userData.email}</p>
              </div>
            </div>
            <div className="profile-info-item">
              <Phone size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Phone</p>
                <p className="profile-info-value">{userData.phone}</p>
              </div>
            </div>
            <div className="profile-info-item">
              <MapPin size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Location</p>
                <p className="profile-info-value">{userData.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="profile-section">
          <h3 className="profile-section-title">Employment Details</h3>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <Briefcase size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Department</p>
                <p className="profile-info-value">{userData.department}</p>
              </div>
            </div>
            <div className="profile-info-item">
              <Calendar size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Join Date</p>
                <p className="profile-info-value">{userData.joinDate}</p>
              </div>
            </div>
            <div className="profile-info-item">
              <Briefcase size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Company</p>
                <p className="profile-info-value">{userData.company}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Schedule */}
        <div className="profile-section">
          <h3 className="profile-section-title">Work Schedule</h3>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <Clock size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Hours per Week</p>
                <p className="profile-info-value">
                  {userData.workSchedule.hoursPerWeek} hours
                </p>
              </div>
            </div>
            <div className="profile-info-item">
              <Calendar size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Work Days</p>
                <p className="profile-info-value">
                  {userData.workSchedule.workDays}
                </p>
              </div>
            </div>
            <div className="profile-info-item">
              <Clock size={20} className="profile-icon" />
              <div>
                <p className="profile-info-label">Working Hours</p>
                <p className="profile-info-value">
                  {userData.workSchedule.startTime} -{" "}
                  {userData.workSchedule.endTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vacation Days */}
        <div className="profile-section">
          <h3 className="profile-section-title">Vacation Days</h3>
          <div className="vacation-stats">
            <div className="vacation-stat-card">
              <p className="vacation-stat-value">{userData.vacationDays.total}</p>
              <p className="vacation-stat-label">Total Days</p>
            </div>
            <div className="vacation-stat-card">
              <p className="vacation-stat-value used">{userData.vacationDays.used}</p>
              <p className="vacation-stat-label">Used Days</p>
            </div>
            <div className="vacation-stat-card">
              <p className="vacation-stat-value remaining">
                {userData.vacationDays.remaining}
              </p>
              <p className="vacation-stat-label">Remaining Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChronosProfile;
