// import axios from "axios";
// import { useState, useEffect } from "react";
// import "./ChronosVacationRequests.css";
// import { useNavigate, useLocation } from "react-router-dom";

// interface VacationRequest {
//   id: number;
//   startDate: string;
//   endDate: string;
//   days: number;
//   status: string;
//   approvedBy: string;
// }

// const ChronosVacationRequests = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);

//   return (
//     <div className="vacation-requests-page">
//       <main className="vacation-main-content">
//         <section className="requests-section">
//           <div className="requests-header">
//             <h2>Vacation Requests</h2>

//             <button
//               className="new-request"
//               onClick={() =>
//                 navigate("/vacation-requests/new", {
//                   state: { backgroundLocation: location }
//                 })
//               }
//             >
//               + New Request
//             </button>
//           </div>

//           <table className="requests-table">
//             <thead>
//               <tr>
//                 <th>Start</th>
//                 <th>End</th>
//                 <th>Days</th>
//                 <th>Status</th>
//                 <th>Approved By</th>
//               </tr>
//             </thead>

//             <tbody>
//               {vacationRequests.map((req) => (
//                 <tr key={req.id}>
//                   <td>{req.startDate}</td>
//                   <td>{req.endDate}</td>
//                   <td>{req.days}</td>
//                   <td>{req.status}</td>
//                   <td>{req.approvedBy}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default ChronosVacationRequests;
import axios from "axios";
import { useState, useEffect } from "react";
import "./ChronosVacationRequests.css";
import { useNavigate, useLocation } from "react-router-dom";

interface VacationRequest {
  id: number;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  approvedBy: string;
}

const ChronosVacationRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    axios
      .get(`http://localhost:8080/api/vacation-requests/employee/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setVacationRequests(res.data))
      .catch((err) => console.error("Error loading vacation requests:", err));
  }, []);

  return (
    <div className="vacation-requests-page">
      <main className="vacation-main-content">
        <section className="requests-section">
          <div className="requests-header">
            <h2>Vacation Requests</h2>

            <button
              className="new-request"
              onClick={() =>
                navigate("/vacation-requests/new", {
                  state: { backgroundLocation: location }
                })
              }
            >
              + New Request
            </button>
          </div>

          <table className="requests-table">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Status</th>
                <th>Approved By</th>
              </tr>
            </thead>

            <tbody>
              {vacationRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>{req.days}</td>
                  <td>{req.status}</td>
                  <td>{req.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default ChronosVacationRequests;
