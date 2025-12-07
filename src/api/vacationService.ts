import { api } from "./config";


export interface VacationRequest {
  id: number;
  employeeId: number;
  administratorId: number;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  pdfPath: string | null;
}

export type VacationStatus = VacationRequest['status'];

export const vacationService = {
  getVacationRequestsByEmployee: async (employeeId: number): Promise<VacationRequest[]> => {
    const response = await api.get(`vacation-requests/employee/${employeeId}`);
    return response.data;
  },

  // Fetch requests for employees that belong to an administrator (adminId)
  getVacationRequestsByAdmin: async (adminId: number): Promise<VacationRequest[]> => {
    const response = await api.get(`vacation-requests/employee/adminId/${adminId}`);
    return response.data;
  },

  createVacationRequest: async (data: Partial<VacationRequest>): Promise<VacationRequest> => {
    const response = await api.post("vacation-requests", data);
    return response.data;
  },

  updateVacationRequest: async (id: number, data: Partial<VacationRequest>): Promise<VacationRequest> => {
    const response = await api.put(`vacation-requests/${id}`, data);
    return response.data;
  },

  getVacationRequestsForAdmin: async (adminId: number): Promise<VacationRequest[]> => {
    const response = await api.get(`vacation-requests/administrator/${adminId}`);
    return response.data;
  },

  getVacationRequestsByAdministrator: async (): Promise<VacationRequest[]> => {
    const response = await api.get(`vacation-requests/administrator`);
    return response.data;
  },

  updateVacationRequestStatus: async (id: number, status: VacationStatus): Promise<VacationRequest> => {
    console.log(`API Call: PUT vacation-requests/${id}/status with status:`, status);
    const response = await api.put(`vacation-requests/${id}/status`, { status });
    console.log('API Response:', response.data);
    return response.data;
  }
};