import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Clock,
} from "lucide-react";
import "./ChronosSettings.css";

const ChronosSettings = () => {
  // Hardcoded settings state
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    vacationApprovals: true,
    scheduleReminders: true,
    weeklyReports: false,

    // Appearance
    theme: "light", // light, dark, system

    // Language & Region
    language: "English",
    timezone: "Europe/Berlin",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",

    // Privacy
    profileVisibility: "team", // team, company, private
    showEmail: true,
    showPhone: false,
  });

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSelect = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <h1 className="settings-title">Settings</h1>

        {/* Notification Settings */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Bell size={24} className="settings-section-icon" />
            <h2 className="settings-section-title">Notifications</h2>
          </div>
          <p className="settings-section-description">
            Manage how you receive notifications
          </p>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-info">
                <Mail size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Email Notifications</p>
                  <p className="settings-item-description">
                    Receive updates via email
                  </p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle("emailNotifications")}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Smartphone size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Push Notifications</p>
                  <p className="settings-item-description">
                    Receive push notifications on your device
                  </p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle("pushNotifications")}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Bell size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Vacation Approvals</p>
                  <p className="settings-item-description">
                    Get notified when vacation requests are approved
                  </p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.vacationApprovals}
                  onChange={() => handleToggle("vacationApprovals")}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Clock size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Schedule Reminders</p>
                  <p className="settings-item-description">
                    Remind me about upcoming events
                  </p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.scheduleReminders}
                  onChange={() => handleToggle("scheduleReminders")}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Mail size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Weekly Reports</p>
                  <p className="settings-item-description">
                    Receive weekly summary emails
                  </p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={() => handleToggle("weeklyReports")}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Monitor size={24} className="settings-section-icon" />
            <h2 className="settings-section-title">Appearance</h2>
          </div>
          <p className="settings-section-description">
            Customize how Chronos looks
          </p>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-info">
                <Sun size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Theme</p>
                  <p className="settings-item-description">
                    Choose your interface theme
                  </p>
                </div>
              </div>
              <div className="settings-theme-buttons">
                <button
                  className={`settings-theme-btn ${
                    settings.theme === "light" ? "active" : ""
                  }`}
                  onClick={() => handleSelect("theme", "light")}
                >
                  <Sun size={18} /> Light
                </button>
                <button
                  className={`settings-theme-btn ${
                    settings.theme === "dark" ? "active" : ""
                  }`}
                  onClick={() => handleSelect("theme", "dark")}
                >
                  <Moon size={18} /> Dark
                </button>
                <button
                  className={`settings-theme-btn ${
                    settings.theme === "system" ? "active" : ""
                  }`}
                  onClick={() => handleSelect("theme", "system")}
                >
                  <Monitor size={18} /> System
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Globe size={24} className="settings-section-icon" />
            <h2 className="settings-section-title">Language & Region</h2>
          </div>
          <p className="settings-section-description">
            Set your language and regional preferences
          </p>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-info">
                <Globe size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Language</p>
                  <p className="settings-item-description">
                    Interface language
                  </p>
                </div>
              </div>
              <select
                className="settings-select"
                value={settings.language}
                onChange={(e) => handleSelect("language", e.target.value)}
              >
                <option value="English">English</option>
                <option value="German">Deutsch</option>
                <option value="French">Français</option>
                <option value="Spanish">Español</option>
              </select>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Clock size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Timezone</p>
                  <p className="settings-item-description">
                    Your local timezone
                  </p>
                </div>
              </div>
              <select
                className="settings-select"
                value={settings.timezone}
                onChange={(e) => handleSelect("timezone", e.target.value)}
              >
                <option value="Europe/Berlin">Europe/Berlin (GMT+1)</option>
                <option value="America/New_York">America/New York (GMT-5)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Clock size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Date Format</p>
                  <p className="settings-item-description">
                    How dates are displayed
                  </p>
                </div>
              </div>
              <select
                className="settings-select"
                value={settings.dateFormat}
                onChange={(e) => handleSelect("dateFormat", e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Clock size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Time Format</p>
                  <p className="settings-item-description">
                    12-hour or 24-hour clock
                  </p>
                </div>
              </div>
              <select
                className="settings-select"
                value={settings.timeFormat}
                onChange={(e) => handleSelect("timeFormat", e.target.value)}
              >
                <option value="24h">24-hour</option>
                <option value="12h">12-hour (AM/PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Lock size={24} className="settings-section-icon" />
            <h2 className="settings-section-title">Privacy</h2>
          </div>
          <p className="settings-section-description">
            Control your privacy and visibility
          </p>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-info">
                <User size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Profile Visibility</p>
                  <p className="settings-item-description">
                    Who can see your profile
                  </p>
                </div>
              </div>
              <select
                className="settings-select"
                value={settings.profileVisibility}
                onChange={(e) =>
                  handleSelect("profileVisibility", e.target.value)
                }
              >
                <option value="team">Team Only</option>
                <option value="company">Entire Company</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Mail size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Show Email</p>
                  <p className="settings-item-description">
                    Display email on your profile
                  </p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.showEmail}
                  onChange={() => handleToggle("showEmail")}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <Smartphone size={20} className="settings-item-icon" />
                <div>
                  <p className="settings-item-label">Show Phone</p>
                  <p className="settings-item-description">
                    Display phone number on your profile
                  </p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.showPhone}
                  onChange={() => handleToggle("showPhone")}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-actions">
          <button className="settings-save-btn">Save Changes</button>
          <button className="settings-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChronosSettings;
