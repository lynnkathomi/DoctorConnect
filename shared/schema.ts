import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  insuranceProvider: text("insurance_provider"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  dateOfBirth: true,
  insuranceProvider: true,
});

// Doctor schema
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  experience: text("experience"),
  acceptsInsurance: boolean("accepts_insurance").default(true),
  rating: text("rating"),
  reviewCount: integer("review_count"),
  availableToday: boolean("available_today"),
  onlineConsultation: boolean("online_consultation"),
  imageUrl: text("image_url"),
});

export const insertDoctorSchema = createInsertSchema(doctors).pick({
  name: true,
  specialty: true,
  location: true,
  address: true,
  experience: true,
  acceptsInsurance: true,
  rating: true,
  reviewCount: true,
  availableToday: true,
  onlineConsultation: true,
  imageUrl: true,
});

// Appointment slots schema
export const appointmentSlots = pgTable("appointment_slots", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  isAvailable: boolean("is_available").default(true),
});

export const insertAppointmentSlotSchema = createInsertSchema(appointmentSlots).pick({
  doctorId: true,
  date: true,
  time: true,
  isAvailable: true,
});

// Appointments schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  doctorId: integer("doctor_id").notNull(),
  slotId: integer("slot_id").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  patientName: text("patient_name").notNull(),
  patientEmail: text("patient_email").notNull(),
  patientPhone: text("patient_phone"),
  patientDob: text("patient_dob"),
  insuranceProvider: text("insurance_provider"),
  reasonForVisit: text("reason_for_visit"),
  appointmentId: text("appointment_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  userId: true,
  doctorId: true,
  slotId: true,
  date: true,
  time: true,
  patientName: true,
  patientEmail: true,
  patientPhone: true,
  patientDob: true,
  insuranceProvider: true,
  reasonForVisit: true,
  appointmentId: true,
});

// Define relations after all tables are defined to avoid circular dependencies
export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
}));

export const doctorsRelations = relations(doctors, ({ many }) => ({
  appointmentSlots: many(appointmentSlots),
  appointments: many(appointments),
}));

export const appointmentSlotsRelations = relations(appointmentSlots, ({ one, many }) => ({
  doctor: one(doctors, {
    fields: [appointmentSlots.doctorId],
    references: [doctors.id],
  }),
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
  slot: one(appointmentSlots, {
    fields: [appointments.slotId],
    references: [appointmentSlots.id],
  }),
}));

// Specialties array
export const SPECIALTIES = [
  "All Specialties",
  "Gynecologist",
  "Dentist",
  "Dermatologist",
  "Cardiologist",
  "Neurologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Ophthalmologist",
];

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type AppointmentSlot = typeof appointmentSlots.$inferSelect;
export type InsertAppointmentSlot = z.infer<typeof insertAppointmentSlotSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Type for search filters
export interface SearchFilters {
  specialty?: string;
  location?: string;
  availableToday?: boolean;
  onlineConsultation?: boolean;
  acceptsInsurance?: boolean;
}
