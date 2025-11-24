import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vacationService } from "../api/vacationService";
import "./ChronosAddVacationRequest.css";

const ChronosAddVacationRequest = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(0);
  
  const today = new Date().toISOString().split("T")[0];

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
      alert("Vacation request must contain at least 1 working day.");
      return;
    }
    
    const token = localStorage.getItem("authToken");
    const employeeId = Number(localStorage.getItem("userId"));
    const administratorId = Number(localStorage.getItem("administratorId"));

    if (!token) {
      alert("You are not logged in.");
      return;
    }

    if (!employeeId ) {
      console.error("Missing userId in localStorage.");
      alert("Error: invalid account configuration.");
      return;
    }

    try {
      await vacationService.createVacationRequest({
        employeeId,
        administratorId,
        startDate,
        endDate,
      });

      navigate("/vacation-requests");
      window.location.reload();

    } catch (error: any) {
      console.error("Error creating vacation request:", error);

      if (error.response && error.response.data && typeof error.response.data === "string") {
        alert(error.response.data);
      } else {
        alert("Unexpected error. Please try again.");
      }
    }
  };

  return (
    <div className="page-overlay">
      <div className="page-modal">
        <h2>Create Vacation Request</h2>

        <form className="add-request-form" onSubmit={handleSubmit}>
          <label>Start Date:</label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)
            }
          />

          <label>End Date:</label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <div className="days-preview">Working days: {days}</div>

          <div className="button-row">
            <button
              className="cancel-btn"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button className="submit-btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChronosAddVacationRequest;
