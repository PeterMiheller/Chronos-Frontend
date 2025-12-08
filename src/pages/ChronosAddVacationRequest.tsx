import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vacationService } from "../api/vacationService";
import { userService } from "../api/userService";
import "./ChronosAddVacationRequest.css";
import { toast } from "react-toastify";

const ChronosAddVacationRequest = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(0);
  const [remainingVacationDays, setRemainingVacationDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const today = new Date().toISOString().split("T")[0];

  // Fetch user's remaining vacation days
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("User ID not found. Please log in again.");
          navigate("/auth");
          return;
        }

        const userData = await userService.getUserById(userId);
        setRemainingVacationDays(userData.vacationDaysRemaining ?? 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load vacation days information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const calculateWorkingDays = (start: string, end: string) => {
    if (!start || !end) return 0;

    const s = new Date(start);
    const e = new Date(end);

    if (s > e) return 0;

    let count = 0;
    let current = new Date(s);

    while (current <= e) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  useEffect(() => {
    setDays(calculateWorkingDays(startDate, endDate));
  }, [startDate, endDate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (days < 1) {
      toast.error("Vacation request must contain at least 1 working day.");
      return;
    }

    // Validate against remaining vacation days
    if (remainingVacationDays !== null && days > remainingVacationDays) {
      toast.error(
        `Insufficient vacation days. You have ${remainingVacationDays} days remaining, but requested ${days} days.`,
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
      return;
    }
    
    const token = localStorage.getItem("authToken");
    const employeeId = Number(localStorage.getItem("userId"));
    const administratorId = Number(localStorage.getItem("administratorId"));

    if (!token) {
      toast.error("You are not logged in.");
      return;
    }

    if (!employeeId) {
      console.error("Missing userId in localStorage.");
      toast.error("Error: invalid account configuration.");
      return;
    }

    try {
      await vacationService.createVacationRequest({
        employeeId,
        administratorId,
        startDate,
        endDate,
      });

      toast.success("Vacation request created successfully!");
      navigate("/vacation-requests");
      window.location.reload();

    } catch (error: any) {
      console.error("Error creating vacation request:", error);
      
      // Extract error message from response
      let errorMessage = "Failed to create vacation request.";
      
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  if (loading) {
    return (
      <div className="page-overlay">
        <div className="page-modal">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-overlay">
      <div className="page-modal">
        <h2>Create Vacation Request</h2>

        {remainingVacationDays !== null && (
          <div style={{
            background: "#dbeafe",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            fontSize: "0.875rem",
            color: "#1e40af",
            fontWeight: 600
          }}>
            Available vacation days: {remainingVacationDays}
          </div>
        )}

        <form className="add-request-form" onSubmit={handleSubmit}>
          <label>Start Date:</label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label>End Date:</label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <div className="days-preview">
            Working days: {days}
            {remainingVacationDays !== null && days > remainingVacationDays && (
              <span style={{ color: "#dc2626", marginLeft: "0.5rem" }}>
                (Exceeds available days!)
              </span>
            )}
          </div>

          <div className="button-row">
            <button
              className="cancel-btn"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              className="submit-btn" 
              type="submit"
              disabled={remainingVacationDays !== null && days > remainingVacationDays}
              style={{
                opacity: remainingVacationDays !== null && days > remainingVacationDays ? 0.5 : 1,
                cursor: remainingVacationDays !== null && days > remainingVacationDays ? "not-allowed" : "pointer"
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChronosAddVacationRequest;
