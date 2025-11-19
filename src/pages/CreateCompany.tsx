import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNavbar from "../components/SuperAdminNavbar";
import { X, UserPlus } from "lucide-react";
import "./CreateCompany.css";

interface Admin {
  id: number;
  name: string;
  email: string;
}

const CreateCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    adminId: "",
  });
  const [adminFormData, setAdminFormData] = useState({
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get("administrators");
      // setAdmins(response.data);

      // Placeholder data
      setAdmins([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ]);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAdminModal = () => {
    setShowAdminModal(true);
  };

  const handleCloseAdminModal = () => {
    setShowAdminModal(false);
    setAdminFormData({
      adminName: "",
      adminEmail: "",
      adminPassword: "",
    });
  };

  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API call to create administrator
      console.log("Creating administrator with data:", adminFormData);

      // Placeholder - replace with actual API call
      // const response = await api.post("administrators/create", adminFormData);
      // const newAdmin = response.data;

      // Simulate new admin creation
      const newAdmin = {
        id: admins.length + 1,
        name: adminFormData.adminName,
        email: adminFormData.adminEmail,
      };

      setAdmins([...admins, newAdmin]);
      setFormData({ ...formData, adminId: String(newAdmin.id) });

      alert("Administrator created successfully!");
      handleCloseAdminModal();
    } catch (err: any) {
      console.error("Error creating administrator:", err);
      alert("Failed to create administrator. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: API call to create company
      console.log("Creating company with data:", formData);

      // Placeholder - replace with actual API call
      // const response = await api.post("companies/create", formData);

      // Success - redirect back to dashboard
      navigate("/superadmin");
    } catch (err: any) {
      console.error("Error creating company:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create company. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/superadmin");
  };

  return (
    <>
      <SuperAdminNavbar />
      <div className="create-company-container">
        <div className="create-company-wrapper">
          <div className="create-company-header">
            <h1>Create New Company</h1>
            <p>Add a new company and assign an administrator</p>
          </div>

          <div className="create-company-card">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="create-company-form">
              <div className="form-section">
                <h2>Company Details</h2>

                <div className="form-field">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="companyEmail">Company Email</label>
                  <input
                    type="email"
                    id="companyEmail"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    placeholder="company@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Assign Administrator</h2>

                <div className="form-field">
                  <label htmlFor="adminId">Select Administrator</label>
                  <div className="admin-selector">
                    <select
                      id="adminId"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select an administrator</option>
                      {admins.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.name} ({admin.email})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="create-admin-inline-btn"
                      onClick={handleOpenAdminModal}
                      title="Create new administrator"
                    >
                      <UserPlus size={20} />
                    </button>
                  </div>
                  <small>
                    Select an existing administrator or create a new one
                  </small>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating..." : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Create Administrator Modal */}
        {showAdminModal && (
          <div className="modal-overlay" onClick={handleCloseAdminModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create Administrator</h3>
                <button onClick={handleCloseAdminModal} className="close-btn">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitAdmin}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="adminName">Administrator Name</label>
                    <input
                      type="text"
                      id="adminName"
                      name="adminName"
                      value={adminFormData.adminName}
                      onChange={handleAdminInputChange}
                      placeholder="Enter administrator name"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adminEmail">Administrator Email</label>
                    <input
                      type="email"
                      id="adminEmail"
                      name="adminEmail"
                      value={adminFormData.adminEmail}
                      onChange={handleAdminInputChange}
                      placeholder="admin@example.com"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adminPassword">
                      Administrator Password
                    </label>
                    <input
                      type="password"
                      id="adminPassword"
                      name="adminPassword"
                      value={adminFormData.adminPassword}
                      onChange={handleAdminInputChange}
                      placeholder="••••••••"
                      className="form-input"
                      required
                      minLength={8}
                    />
                    <small>Minimum 8 characters</small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={handleCloseAdminModal}
                    className="btn-cancel"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Administrator"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateCompany;
