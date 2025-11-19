import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNavbar from "../components/SuperAdminNavbar";
import "./CreateCompany.css";

const CreateCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                <h2>Administrator Details</h2>

                <div className="form-field">
                  <label htmlFor="adminName">Administrator Name</label>
                  <input
                    type="text"
                    id="adminName"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    placeholder="Enter admin name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="adminEmail">Administrator Email</label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="adminPassword">Administrator Password</label>
                  <input
                    type="password"
                    id="adminPassword"
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <small>Minimum 8 characters</small>
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
      </div>
    </>
  );
};

export default CreateCompany;
