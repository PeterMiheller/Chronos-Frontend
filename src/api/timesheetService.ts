import { api } from "./config";

export type TimesheetEntry = {
  date: string; // YYYY-MM-DD
  hours: number;
};

export const timesheetService = {
  getForMonth: async (year: number, month: number): Promise<TimesheetEntry[]> => {
    const res = await api.get(`/timesheets/month/${year}/${month}`);
    return res.data;
  },
  setHours: async (date: string, hours: number): Promise<TimesheetEntry> => {
    const res = await api.put(`/timesheets`, { date, hours });
    return res.data;
  },
  deleteEntry: async (date: string): Promise<void> => {
    await api.delete(`/timesheets/${date}`);
  },
};
