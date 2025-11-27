import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./EmployeeManagement.css";
import { userService } from "../api/userService";
import type { User } from "../api/userService";
import { Pencil, Trash2, UserPlus, Users } from "lucide-react";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError("Failed to load employees");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee: User) => {
    // TODO: Implement edit functionality
    console.log("Edit employee:", employee);
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = async (id: number) => {
    // TODO: Implement delete functionality with confirmation modal
    console.log("Delete employee:", id);
    toast.info("Delete functionality coming soon!");
  };

  const handleCreateEmployee = () => {
    // TODO: Implement create employee functionality
    toast.info("Create employee functionality coming soon!");
  };

  return (
    <>
      <div className="employee-management">
        <main className="main-content">
          <div className="header">
            <div>
              <h1>Employee Management</h1>
              <p>Manage all employees in your company</p>
            </div>
            <button
              className="create-employee-btn"
              onClick={handleCreateEmployee}
            >
              <UserPlus size={20} />
              Create Employee
            </button>
          </div>

          {loading && <div className="loading">Loading employees...</div>}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && employees.length === 0 && (
            <div className="empty-state">
              <Users size={48} />
              <h3>No employees yet</h3>
              <p>Create your first employee to get started</p>
            </div>
          )}

          {!loading && !error && employees.length > 0 && (
            <div className="employees-table-container">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Vacation Days Total</th>
                    <th>Vacation Days Remaining</th>
                    <th>Expected Workload</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td className="employee-name">
                        <Users size={16} />
                        {employee.name}
                      </td>
                      <td>{employee.email}</td>
                      <td>{employee.vacationDaysTotal ?? "-"}</td>
                      <td>{employee.vacationDaysRemaining ?? "-"}</td>
                      <td>{employee.expectedWorkload ?? "-"}h</td>
                      <td className="actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(employee)}
                          title="Edit Employee"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(employee.id)}
                          title="Delete Employee"
                          disabled={deletingId === employee.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default EmployeeManagement;
