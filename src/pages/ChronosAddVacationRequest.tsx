import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChronosAddVacationRequest.css";

const ChronosAddVacationRequest = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(0);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return diff >= 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1 : 0;
  };

  useEffect(() => {
    setDays(calculateDays(startDate, endDate));
  }, [startDate, endDate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    navigate("/vacation-requests");
  };

  return (
    <div className="page-overlay">
      <div className="page-modal">
        <h2>Create Vacation Request</h2>

        <form className="add-request-form" onSubmit={handleSubmit}>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <div className="days-preview">Days: {days}</div>

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
