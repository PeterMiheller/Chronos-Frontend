import { api } from "./config";


export interface VacationRequest {
  id: number;
  employeeId: number;
  administratorId: number;
  startDate: string;
  endDate: string;
  status: "CREATED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "REVISED" | "RESUBMITTED" | "CANCELLED" | "EXPIRED";
  pdfPath: string | null;
}

export type VacationStatus = VacationRequest['status'];

export const vacationService = {
  getVacationRequestsByEmployee: async (employeeId: number): Promise<VacationRequest[]> => {
    const response = await api.get(`vacation-requests/employee/${employeeId}`);
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
    const response = await api.get(`/vacation-requests/administrator/${adminId}`);
    return response.data;
  },

  getVacationRequestsByAdministrator: async (): Promise<VacationRequest[]> => {
    const response = await api.get(`vacation-requests/administrator`);
    return response.data;
  },

  updateVacationRequestStatus: async (id: number, status: VacationStatus): Promise<VacationRequest> => {
    const response = await api.put(`/vacation-requests/${id}/status`, { status });
    return response.data;
  }
};