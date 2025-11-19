import { api } from "./config";

export interface Company {
  id: number;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  numberOfEmployees?: number;
}

export const companyService = {
  // Get all companies
  getAllCompanies: async (): Promise<Company[]> => {
    const response = await api.get("/companies");
    return response.data;
  },

  // Get company by ID
  getCompanyById: async (id: number): Promise<Company> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // Create a new company
  createCompany: async (companyData: Omit<Company, "id">): Promise<Company> => {
    const response = await api.post("/companies", companyData);
    return response.data;
  },

  // Update a company
  updateCompany: async (
    id: number,
    companyData: Partial<Company>
  ): Promise<Company> => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  // Delete a company
  deleteCompany: async (id: number): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};
