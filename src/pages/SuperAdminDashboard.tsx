import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./SuperAdminDashboard.css";
import SuperAdminNavbar from "../components/SuperAdminNavbar";
import { companyService } from "../api/companyService";
import type { Company } from "../api/companyService";
import { userService } from "../api/userService";
import type { User } from "../api/userService";
import { Pencil, Trash2, Building2, Plus, X } from "lucide-react";

const SuperAdminDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [editFormData, setEditFormData] = useState({
    companyName: "",
    companyAddress: "",
    adminId: "",
  });
  const [admins, setAdmins] = useState<User[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getAllCompaniesWithAdmins();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError("Failed to load companies");
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const data = await userService.getAllAdministrators();
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchAdmins();
  }, []);

  const handleDelete = async (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setCompanyToDelete(company);
      setShowDeleteModal(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCompanyToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;

    setDeletingId(companyToDelete.id);
    try {
      await companyService.deleteCompany(companyToDelete.id);
      toast.success("Company deleted successfully!");
      handleCloseDeleteModal();
      await fetchCompanies();
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error("Failed to delete company. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (company: Company) => {
    setCompanyToEdit(company);
    setEditFormData({
      companyName: company.name,
      companyAddress: company.address || "",
      adminId: "", // Will need to get admin ID from backend
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCompanyToEdit(null);
    setEditFormData({
      companyName: "",
      companyAddress: "",
      adminId: "",
    });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyToEdit) return;

    setSavingEdit(true);
    try {
      const updateData: {
        name: string;
        address: string;
        adminId?: number;
      } = {
        name: editFormData.companyName,
        address: editFormData.companyAddress,
      };

      // Only include adminId if a new admin is selected
      if (editFormData.adminId) {
        updateData.adminId = Number(editFormData.adminId);
      }

      await companyService.updateCompanyBySuperAdmin(
        companyToEdit.id,
        updateData
      );
      toast.success("Company updated successfully!");
      handleCloseEditModal();
      await fetchCompanies();
    } catch (err) {
      console.error("Error updating company:", err);
      toast.error("Failed to update company. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <>
      <SuperAdminNavbar />
      <div className="superadmin-dashboard">
        <main className="main-content">
          <div className="header">
            <div>
              <h1>Company Management</h1>
              <p>Manage all companies in the system</p>
            </div>
            <button
              className="create-company-btn"
              onClick={() => navigate("/superadmin/create-company")}
            >
              <Plus size={20} />
              Create Company
            </button>
          </div>

          {loading && <div className="loading">Loading companies...</div>}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && companies.length === 0 && (
            <div className="empty-state">
              <Building2 size={48} />
              <h3>No companies yet</h3>
              <p>Create your first company to get started</p>
            </div>
          )}

          {!loading && !error && companies.length > 0 && (
            <div className="companies-table-container">
              <table className="companies-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company Name</th>
                    <th>Address</th>
                    <th>Admin Name</th>
                    <th>Contact Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td>{company.id}</td>
                      <td className="company-name">
                        <Building2 size={16} />
                        {company.name}
                      </td>
                      <td>{company.address || "-"}</td>
                      <td>{company.adminContactName || "-"}</td>
                      <td>{company.adminContactEmail || "-"}</td>
                      <td className="actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(company)}
                          title="Edit Company"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(company.id)}
                          title="Delete Company"
                          disabled={deletingId === company.id}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && companyToDelete && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Company</h3>
              <button onClick={handleCloseDeleteModal} className="close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>{companyToDelete.name}</strong>?
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
                disabled={deletingId === companyToDelete.id}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn-delete"
                disabled={deletingId === companyToDelete.id}
              >
                {deletingId === companyToDelete.id
                  ? "Deleting..."
                  : "Delete Company"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && companyToEdit && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Company</h3>
              <button onClick={handleCloseEditModal} className="close-btn">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={editFormData.companyName}
                    onChange={handleEditInputChange}
                    placeholder="Enter company name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyAddress">Company Address</label>
                  <input
                    type="text"
                    id="companyAddress"
                    name="companyAddress"
                    value={editFormData.companyAddress}
                    onChange={handleEditInputChange}
                    placeholder="123 Main Street, Vienna"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adminId">
                    Assign Administrator (Optional)
                  </label>
                  <select
                    id="adminId"
                    name="adminId"
                    value={editFormData.adminId}
                    onChange={handleEditInputChange}
                    className="form-input"
                  >
                    <option value="">Keep current administrator</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} ({admin.email})
                      </option>
                    ))}
                  </select>
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
    </>
  );
};

export default SuperAdminDashboard;
