import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./EmployeeManagement.css";
import { userService } from "../api/userService";
import type { User } from "../api/userService";
import { Pencil, Trash2, UserPlus, Users, X } from "lucide-react";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Create Employee Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
    vacationDaysTotal: "",
    expectedWorkload: "",
  });
  const [creating, setCreating] = useState(false);

  // Delete Employee Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<User | null>(null);

  // Edit Employee Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    vacationDaysTotal: "",
    expectedWorkload: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem("userCompanyId");
      if (!companyId) {
        setError("Company information not found");
        setLoading(false);
        return;
      }
      const data = await userService.getEmployeesByCompany(Number(companyId));
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
    setEmployeeToEdit(employee);
    setEditFormData({
      name: employee.name,
      email: employee.email,
      vacationDaysTotal: employee.vacationDaysTotal?.toString() || "",
      expectedWorkload: employee.expectedWorkload?.toString() || "",
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEmployeeToEdit(null);
    setEditFormData({
      name: "",
      email: "",
      vacationDaysTotal: "",
      expectedWorkload: "",
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeToEdit) return;

    setSavingEdit(true);
    try {
      await userService.updateEmployee(employeeToEdit.id, {
        name: editFormData.name,
        email: editFormData.email,
        vacationDaysTotal: Number(editFormData.vacationDaysTotal),
        expectedWorkload: Number(editFormData.expectedWorkload),
      });
      toast.success("Employee updated successfully!");
      handleCloseEditModal();
      await fetchEmployees();
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("Failed to update employee. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = (id: number) => {
    const employee = employees.find((e) => e.id === id);
    if (employee) {
      setEmployeeToDelete(employee);
      setShowDeleteModal(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    setDeletingId(employeeToDelete.id);
    try {
      await userService.deleteEmployee(employeeToDelete.id);
      toast.success("Employee deleted successfully!");
      handleCloseDeleteModal();
      await fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error("Failed to delete employee. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateEmployee = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      name: "",
      email: "",
      password: "",
      vacationDaysTotal: "",
      expectedWorkload: "",
    });
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateFormData({
      ...createFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const companyId = localStorage.getItem("userCompanyId");
      const administratorId = localStorage.getItem("userId");

      if (!companyId || !administratorId) {
        toast.error("Missing company or administrator information");
        setCreating(false);
        return;
      }

      await userService.createEmployee({
        name: createFormData.name,
        email: createFormData.email,
        password: createFormData.password,
        companyId: Number(companyId),
        administratorId: Number(administratorId),
        vacationDaysTotal: Number(createFormData.vacationDaysTotal),
        expectedWorkload: Number(createFormData.expectedWorkload),
      });
      toast.success("Employee created successfully!");
      handleCloseCreateModal();
      await fetchEmployees();
    } catch (err) {
      console.error("Error creating employee:", err);

      // Check if error response contains email already exists message
      const error = err as {
        response?: {
          data?: { error?: string; email?: string; message?: string };
        };
      };
      if (error?.response?.data?.error === "Email already exists") {
        toast.error(`Email already exists: ${error.response.data.email}`);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create employee. Please try again.");
      }
    } finally {
      setCreating(false);
    }
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

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Employee</h3>
              <button onClick={handleCloseCreateModal} className="close-btn">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={createFormData.name}
                    onChange={handleCreateInputChange}
                    placeholder="John Doe"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={createFormData.email}
                    onChange={handleCreateInputChange}
                    placeholder="john.doe@example.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={createFormData.password}
                    onChange={handleCreateInputChange}
                    placeholder="Enter password"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vacationDaysTotal">Vacation Days Total</label>
                  <input
                    type="number"
                    id="vacationDaysTotal"
                    name="vacationDaysTotal"
                    value={createFormData.vacationDaysTotal}
                    onChange={handleCreateInputChange}
                    placeholder="25"
                    className="form-input"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expectedWorkload">
                    Expected Workload (hours)
                  </label>
                  <input
                    type="number"
                    id="expectedWorkload"
                    name="expectedWorkload"
                    value={createFormData.expectedWorkload}
                    onChange={handleCreateInputChange}
                    placeholder="40"
                    className="form-input"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="btn-cancel"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && employeeToEdit && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Employee</h3>
              <button onClick={handleCloseEditModal} className="close-btn">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="editName">Full Name</label>
                  <input
                    type="text"
                    id="editName"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    placeholder="John Doe"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editEmail">Email</label>
                  <input
                    type="email"
                    id="editEmail"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    placeholder="john.doe@example.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editVacationDaysTotal">
                    Vacation Days Total
                  </label>
                  <input
                    type="number"
                    id="editVacationDaysTotal"
                    name="vacationDaysTotal"
                    value={editFormData.vacationDaysTotal}
                    onChange={handleEditInputChange}
                    placeholder="25"
                    className="form-input"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editExpectedWorkload">
                    Expected Workload (hours)
                  </label>
                  <input
                    type="number"
                    id="editExpectedWorkload"
                    name="expectedWorkload"
                    value={editFormData.expectedWorkload}
                    onChange={handleEditInputChange}
                    placeholder="40"
                    className="form-input"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="btn-cancel"
                  disabled={savingEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && employeeToDelete && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Employee</h3>
              <button onClick={handleCloseDeleteModal} className="close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>{employeeToDelete.name}</strong>?
              </p>
              <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="btn-cancel"
                disabled={deletingId === employeeToDelete.id}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn-delete"
                disabled={deletingId === employeeToDelete.id}
              >
                {deletingId === employeeToDelete.id
                  ? "Deleting..."
                  : "Delete Employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeManagement;
