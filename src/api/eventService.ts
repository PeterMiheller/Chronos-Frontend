import { api } from "./config";

export interface Event {
  id: number;
  type: "TEAM_MEETING" | "PROJECT_DEADLINE";
  eventDateTime: string;
  projectName?: string;
  companyId: number;
  createdByName: string;
}

export interface CreateEventRequest {
  type: "TEAM_MEETING" | "PROJECT_DEADLINE";
  eventDateTime: string;
  projectName?: string;
}

export const eventService = {
  createEvent: async (eventData: CreateEventRequest): Promise<Event> => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get("/events");
    return response.data;
  },

  getEventsForMonth: async (year: number, month: number): Promise<Event[]> => {
    const response = await api.get(`/events/month/${year}/${month}`);
    return response.data;
  },

  deleteEvent: async (eventId: number): Promise<void> => {
    await api.delete(`/events/${eventId}`);
  },
};
