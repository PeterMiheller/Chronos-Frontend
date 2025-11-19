import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdminDashboard.css";
import SuperAdminNavbar from "../components/SuperAdminNavbar";
import { companyService } from "../api/companyService";
import type { Company } from "../api/companyService";
import { Pencil, Trash2, Building2, Plus } from "lucide-react";

const SuperAdminDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companyService.deleteCompany(id);
        fetchCompanies();
      } catch (err) {
        console.error("Error deleting company:", err);
        alert("Failed to delete company");
      }
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
                          title="Edit Company"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(company.id)}
                          title="Delete Company"
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

export default SuperAdminDashboard;
