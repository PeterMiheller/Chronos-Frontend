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
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
  },

  getAllEmployees: async (): Promise<User[]> => {
    const response = await api.get("/users/employees");
    return response.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  getEmployeesByAdministrator: async (adminId: number): Promise<User[]> => {
    const response = await api.get(`/users/administrator/${adminId}/employees`);
    return response.data;
  },
};