import { api } from "./config";

export interface User {
  id: number;
  email: string;
  name: string;
  userType: "SUPERADMIN" | "ADMINISTRATOR" | "EMPLOYEE";
  company: {
    id: number;
    name: string;
    address: string;
  } | null;
  vacationDaysTotal: number | null;
  vacationDaysRemaining: number | null;
  expectedWorkload: number | null;
  administratorId: number | null;
}

export const userService = {
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`users/${id}`);
    return response.data;
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const response = await api.get(`users/email/${email}`);
    return response.data;
  },

  getAllEmployees: async (): Promise<User[]> => {
    const response = await api.get("users/employees");
    return response.data;
  },

  getAllAdministrators: async (): Promise<User[]> => {
    const response = await api.get("users/administrators");
    return response.data;
  },

  createAdministrator: async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const response = await api.post("users/admin", data);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put(`users/${id}`, data);
    return response.data;
  },

  getEmployeesByAdministrator: async (adminId: number): Promise<User[]> => {
    const response = await api.get(`/users/administrator/${adminId}/employees`);
    return response.data;
  },

  getEmployeesByCompany: async (companyId: number): Promise<User[]> => {
    const response = await api.get(`/users/employee/${companyId}`);
    return response.data;
  },

  createEmployee: async (data: {
    name: string;
    email: string;
    password: string;
    companyId: number;
    administratorId: number;
    vacationDaysTotal: number;
    expectedWorkload: number;
  }): Promise<User> => {
    const response = await api.post("users/employee/create", data);
    return response.data;
  },

  updateEmployee: async (
    id: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      companyId?: number;
      administratorId?: number;
      vacationDaysTotal?: number;
      vacationDaysRemaining?: number;
      expectedWorkload?: number;
    }
  ): Promise<User> => {
    const response = await api.put(`users/employee/update/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`users/employee/delete/${id}`);
  },

  getAllStaffByCompany: async (companyId: number): Promise<User[]> => {
    const response = await api.get(`users/company/${companyId}/all-staff`);
    return response.data;
  },

  updateAdministrator: async (
    id: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      vacationDaysTotal?: number;
      vacationDaysRemaining?: number;
      expectedWorkload?: number;
    }
  ): Promise<User> => {
    const response = await api.put(`users/administrator/update/${id}`, data);
    return response.data;
  },
};