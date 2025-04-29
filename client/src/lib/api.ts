import { apiRequest } from "./queryClient";
import type { 
  Doctor, 
  SearchFilters, 
  AppointmentSlot, 
  InsertAppointment, 
  Appointment 
} from "@shared/schema";

// Doctor API
export async function getDoctors(filters?: SearchFilters): Promise<Doctor[]> {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.specialty) queryParams.append("specialty", filters.specialty);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.availableToday) queryParams.append("availableToday", "true");
    if (filters.onlineConsultation) queryParams.append("onlineConsultation", "true");
    if (filters.acceptsInsurance) queryParams.append("acceptsInsurance", "true");
  }
  
  const queryString = queryParams.toString();
  const url = `/api/doctors${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiRequest("GET", url);
  return response.json();
}

export async function getDoctor(id: number): Promise<Doctor> {
  const response = await apiRequest("GET", `/api/doctors/${id}`);
  return response.json();
}

// Appointment Slots API
export async function getDoctorSlots(doctorId: number): Promise<AppointmentSlot[]> {
  const response = await apiRequest("GET", `/api/doctors/${doctorId}/slots`);
  return response.json();
}

// Appointment API
export async function bookAppointment(appointment: InsertAppointment): Promise<Appointment> {
  const response = await apiRequest("POST", "/api/appointments", appointment);
  return response.json();
}

export async function getUserAppointments(userId: number): Promise<Appointment[]> {
  const response = await apiRequest("GET", `/api/users/${userId}/appointments`);
  return response.json();
}

// Specialties API
export async function getSpecialties(): Promise<string[]> {
  const response = await apiRequest("GET", "/api/specialties");
  return response.json();
}
