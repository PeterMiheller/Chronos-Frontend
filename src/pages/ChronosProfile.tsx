import { Mail, MapPin, Briefcase, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import type { User } from "../api/userService";
import "./ChronosProfile.css";

const ChronosProfile = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userEmail = localStorage.getItem("userEmail");

        if (!userEmail) {
          setError("User not authenticated");
          return;
        }

        const user = await userService.getUserByEmail(userEmail);
        setUserData(user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <p>Error: {error || "User data not found"}</p>
        </div>
      </div>
    );
  }

  const vacationDaysUsed = userData.vacationDaysTotal && userData.vacationDaysRemaining
    ? userData.vacationDaysTotal - userData.vacationDaysRemaining
    : 0;

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
            <p className="profile-role">
              {userData.userType === "SUPERADMIN"
                ? "Super Administrator"
                : userData.userType === "ADMINISTRATOR"
                ? "Administrator"
                : "Employee"}
            </p>
            <p className="profile-employee-id">ID: {userData.id}</p>
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
            {userData.company && (
              <div className="profile-info-item">
                <MapPin size={20} className="profile-icon" />
                <div>
                  <p className="profile-info-label">Location</p>
                  <p className="profile-info-value">{userData.company.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Employment Details */}
        {userData.company && (
          <div className="profile-section">
            <h3 className="profile-section-title">Employment Details</h3>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <Briefcase size={20} className="profile-icon" />
                <div>
                  <p className="profile-info-label">Company</p>
                  <p className="profile-info-value">{userData.company.name}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <Briefcase size={20} className="profile-icon" />
                <div>
                  <p className="profile-info-label">User Type</p>
                  <p className="profile-info-value">{userData.userType}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Work Schedule */}
        {userData.expectedWorkload && (
          <div className="profile-section">
            <h3 className="profile-section-title">Work Schedule</h3>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <Clock size={20} className="profile-icon" />
                <div>
                  <p className="profile-info-label">Expected Workload</p>
                  <p className="profile-info-value">
                    {userData.expectedWorkload} hours/week
                  </p>
                </div>
              </div>
              <div className="profile-info-item">
                <Calendar size={20} className="profile-icon" />
                <div>
                  <p className="profile-info-label">Work Days</p>
                  <p className="profile-info-value">Monday - Friday</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vacation Days */}
        {userData.vacationDaysTotal !== null && userData.vacationDaysRemaining !== null && (
          <div className="profile-section">
            <h3 className="profile-section-title">Vacation Days</h3>
            <div className="vacation-stats">
              <div className="vacation-stat-card">
                <p className="vacation-stat-value">{userData.vacationDaysTotal}</p>
                <p className="vacation-stat-label">Total Days</p>
              </div>
              <div className="vacation-stat-card">
                <p className="vacation-stat-value used">{vacationDaysUsed}</p>
                <p className="vacation-stat-label">Used Days</p>
              </div>
              <div className="vacation-stat-card">
                <p className="vacation-stat-value remaining">
                  {userData.vacationDaysRemaining}
                </p>
                <p className="vacation-stat-label">Remaining Days</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChronosProfile;
