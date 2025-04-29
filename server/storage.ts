import { 
  users, 
  doctors, 
  appointmentSlots, 
  appointments,
  type User, 
  type InsertUser, 
  type Doctor, 
  type InsertDoctor,
  type AppointmentSlot,
  type InsertAppointmentSlot,
  type Appointment,
  type InsertAppointment,
  type SearchFilters
} from "@shared/schema";
import { format, addDays } from "date-fns";
import { nanoid } from "nanoid";
import { eq, and, like } from "drizzle-orm";
import { db } from "./db";

import session from "express-session";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Doctor methods
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctors(filters?: SearchFilters): Promise<Doctor[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Appointment slot methods
  getAppointmentSlot(id: number): Promise<AppointmentSlot | undefined>;
  getAppointmentSlotsByDoctor(doctorId: number): Promise<AppointmentSlot[]>;
  createAppointmentSlot(slot: InsertAppointmentSlot): Promise<AppointmentSlot>;
  updateAppointmentSlot(id: number, isAvailable: boolean): Promise<AppointmentSlot | undefined>;

  // Appointment methods
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentByAppointmentId(appointmentId: string): Promise<Appointment | undefined>;
  getAppointmentsByUserId(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  
  // Session storage
  sessionStore: session.Store;
}

import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private doctors: Map<number, Doctor>;
  private appointmentSlots: Map<number, AppointmentSlot>;
  private appointments: Map<number, Appointment>;
  
  private userCurrentId: number;
  private doctorCurrentId: number;
  private slotCurrentId: number;
  private appointmentCurrentId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.appointmentSlots = new Map();
    this.appointments = new Map();
    
    this.userCurrentId = 1;
    this.doctorCurrentId = 1;
    this.slotCurrentId = 1;
    this.appointmentCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });

    // Seed doctors and appointment slots
    this.seedDoctors();
  }

  private seedDoctors() {
    // Add sample doctors
    const sampleDoctors: InsertDoctor[] = [
      {
        name: "Dr. Sarah Johnson",
        specialty: "Gynecologist",
        location: "New York",
        address: "Medical Center, 123 Main St, New York",
        experience: "15+ years experience",
        acceptsInsurance: true,
        rating: "4.8",
        reviewCount: 256,
        availableToday: true,
        onlineConsultation: false,
        imageUrl: "https://randomuser.me/api/portraits/women/36.jpg"
      },
      {
        name: "Dr. Michael Chen",
        specialty: "Dentist",
        location: "New York",
        address: "Downtown Dental Clinic, 456 Park Ave, New York",
        experience: "8+ years experience",
        acceptsInsurance: true,
        rating: "4.2",
        reviewCount: 189,
        availableToday: false,
        onlineConsultation: true,
        imageUrl: "https://randomuser.me/api/portraits/men/64.jpg"
      },
      {
        name: "Dr. Emily Rodriguez",
        specialty: "Dermatologist",
        location: "New York",
        address: "Skin Care Center, 789 Broadway, New York",
        experience: "12+ years experience",
        acceptsInsurance: true,
        rating: "5.0",
        reviewCount: 312,
        availableToday: true,
        onlineConsultation: false,
        imageUrl: "https://randomuser.me/api/portraits/women/65.jpg"
      },
      {
        name: "Dr. James Wilson",
        specialty: "Cardiologist",
        location: "New York",
        address: "Heart Center, 567 Fifth Ave, New York",
        experience: "20+ years experience",
        acceptsInsurance: true,
        rating: "4.9",
        reviewCount: 423,
        availableToday: false,
        onlineConsultation: true,
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        name: "Dr. Lisa Patel",
        specialty: "Pediatrician",
        location: "New York",
        address: "Children's Medical, 890 West St, New York",
        experience: "10+ years experience",
        acceptsInsurance: true,
        rating: "4.7",
        reviewCount: 278,
        availableToday: true,
        onlineConsultation: false,
        imageUrl: "https://randomuser.me/api/portraits/women/45.jpg"
      },
      {
        name: "Dr. Robert Kim",
        specialty: "Neurologist",
        location: "New York",
        address: "Neuro Institute, 234 East 42nd St, New York",
        experience: "17+ years experience",
        acceptsInsurance: true,
        rating: "4.6",
        reviewCount: 156,
        availableToday: false,
        onlineConsultation: true,
        imageUrl: "https://randomuser.me/api/portraits/men/22.jpg"
      }
    ];

    // Add doctors to storage
    sampleDoctors.forEach(doctor => {
      this.createDoctor(doctor);
    });

    // Generate appointment slots for each doctor
    const doctors = Array.from(this.doctors.values());
    doctors.forEach(doctor => {
      this.generateAppointmentSlots(doctor.id);
    });
  }

  // Generate sample appointment slots for a doctor
  private generateAppointmentSlots(doctorId: number) {
    const today = new Date();
    const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    
    // Create slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(today, i);
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      
      // Select 3-5 random slots per day
      const numSlots = Math.floor(Math.random() * 3) + 3; // 3-5 slots
      const selectedIndices = new Set<number>();
      
      while (selectedIndices.size < numSlots) {
        const randomIndex = Math.floor(Math.random() * timeSlots.length);
        selectedIndices.add(randomIndex);
      }
      
      selectedIndices.forEach(index => {
        const slot: InsertAppointmentSlot = {
          doctorId,
          date: formattedDate,
          time: timeSlots[index],
          isAvailable: true
        };
        this.createAppointmentSlot(slot);
      });
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Doctor methods
  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctors(filters?: SearchFilters): Promise<Doctor[]> {
    let doctors = Array.from(this.doctors.values());
    
    if (filters) {
      if (filters.specialty && filters.specialty !== "All Specialties") {
        doctors = doctors.filter(doctor => 
          doctor.specialty.toLowerCase() === filters.specialty?.toLowerCase()
        );
      }
      
      if (filters.location) {
        doctors = doctors.filter(doctor => 
          doctor.location.toLowerCase().includes(filters.location?.toLowerCase() || "")
        );
      }
      
      if (filters.availableToday) {
        doctors = doctors.filter(doctor => doctor.availableToday);
      }
      
      if (filters.onlineConsultation) {
        doctors = doctors.filter(doctor => doctor.onlineConsultation);
      }
      
      if (filters.acceptsInsurance) {
        doctors = doctors.filter(doctor => doctor.acceptsInsurance);
      }
    }
    
    return doctors;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.doctorCurrentId++;
    const doctor: Doctor = { ...insertDoctor, id };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Appointment slot methods
  async getAppointmentSlot(id: number): Promise<AppointmentSlot | undefined> {
    return this.appointmentSlots.get(id);
  }

  async getAppointmentSlotsByDoctor(doctorId: number): Promise<AppointmentSlot[]> {
    return Array.from(this.appointmentSlots.values())
      .filter(slot => slot.doctorId === doctorId && slot.isAvailable)
      .sort((a, b) => {
        // Sort by date and then by time
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) return dateComparison;
        return a.time.localeCompare(b.time);
      });
  }

  async createAppointmentSlot(insertSlot: InsertAppointmentSlot): Promise<AppointmentSlot> {
    const id = this.slotCurrentId++;
    const slot: AppointmentSlot = { ...insertSlot, id };
    this.appointmentSlots.set(id, slot);
    return slot;
  }

  async updateAppointmentSlot(id: number, isAvailable: boolean): Promise<AppointmentSlot | undefined> {
    const slot = await this.getAppointmentSlot(id);
    if (!slot) return undefined;
    
    const updatedSlot: AppointmentSlot = { ...slot, isAvailable };
    this.appointmentSlots.set(id, updatedSlot);
    return updatedSlot;
  }

  // Appointment methods
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentByAppointmentId(appointmentId: string): Promise<Appointment | undefined> {
    return Array.from(this.appointments.values()).find(
      appointment => appointment.appointmentId === appointmentId
    );
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.userId === userId)
      .sort((a, b) => {
        // Sort by date and then by time
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) return dateComparison;
        return a.time.localeCompare(b.time);
      });
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentCurrentId++;
    
    // Generate a unique appointmentId if not provided
    const appointmentId = insertAppointment.appointmentId || `APT${nanoid(8)}`;
    
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      appointmentId,
      createdAt: new Date()
    };
    
    this.appointments.set(id, appointment);
    
    // Set the appointment slot to unavailable
    await this.updateAppointmentSlot(appointment.slotId, false);
    
    return appointment;
  }
}

import { pool } from "./db";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Doctor methods
  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor || undefined;
  }

  async getDoctors(filters?: SearchFilters): Promise<Doctor[]> {
    let query = db.select().from(doctors);
    
    if (filters) {
      if (filters.specialty && filters.specialty !== "All Specialties") {
        query = query.where(eq(doctors.specialty, filters.specialty));
      }
      
      if (filters.location) {
        query = query.where(like(doctors.location, `%${filters.location}%`));
      }
      
      if (filters.availableToday) {
        query = query.where(eq(doctors.availableToday, true));
      }
      
      if (filters.onlineConsultation) {
        query = query.where(eq(doctors.onlineConsultation, true));
      }
      
      if (filters.acceptsInsurance) {
        query = query.where(eq(doctors.acceptsInsurance, true));
      }
    }
    
    return await query;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db
      .insert(doctors)
      .values(insertDoctor)
      .returning();
    return doctor;
  }

  // Appointment slot methods
  async getAppointmentSlot(id: number): Promise<AppointmentSlot | undefined> {
    const [slot] = await db.select().from(appointmentSlots).where(eq(appointmentSlots.id, id));
    return slot || undefined;
  }

  async getAppointmentSlotsByDoctor(doctorId: number): Promise<AppointmentSlot[]> {
    return await db
      .select()
      .from(appointmentSlots)
      .where(and(
        eq(appointmentSlots.doctorId, doctorId),
        eq(appointmentSlots.isAvailable, true)
      ))
      .orderBy(appointmentSlots.date, appointmentSlots.time);
  }

  async createAppointmentSlot(insertSlot: InsertAppointmentSlot): Promise<AppointmentSlot> {
    const [slot] = await db
      .insert(appointmentSlots)
      .values(insertSlot)
      .returning();
    return slot;
  }

  async updateAppointmentSlot(id: number, isAvailable: boolean): Promise<AppointmentSlot | undefined> {
    const [updatedSlot] = await db
      .update(appointmentSlots)
      .set({ isAvailable })
      .where(eq(appointmentSlots.id, id))
      .returning();
    return updatedSlot || undefined;
  }

  // Appointment methods
  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getAppointmentByAppointmentId(appointmentId: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.appointmentId, appointmentId));
    return appointment || undefined;
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(appointments.date, appointments.time);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    // Generate a unique appointmentId if not provided
    const appointmentData = {
      ...insertAppointment,
      appointmentId: insertAppointment.appointmentId || `APT${nanoid(8)}`
    };
    
    // Create the appointment
    const [appointment] = await db
      .insert(appointments)
      .values(appointmentData)
      .returning();
    
    // Set the appointment slot to unavailable
    await this.updateAppointmentSlot(appointment.slotId, false);
    
    return appointment;
  }

  // Seed initial data if needed
  async seedInitialData() {
    // Check if doctors already exist
    const existingDoctors = await db.select().from(doctors);
    if (existingDoctors.length > 0) {
      console.log("Database already seeded with doctors");
      return;
    }

    // Add sample doctors
    const sampleDoctors: InsertDoctor[] = [
      {
        name: "Dr. Sarah Johnson",
        specialty: "Gynecologist",
        location: "New York",
        address: "Medical Center, 123 Main St, New York",
        experience: "15+ years experience",
        acceptsInsurance: true,
        rating: "4.8",
        reviewCount: 256,
        availableToday: true,
        onlineConsultation: false,
        imageUrl: "https://randomuser.me/api/portraits/women/36.jpg"
      },
      {
        name: "Dr. Michael Chen",
        specialty: "Dentist",
        location: "New York",
        address: "Downtown Dental Clinic, 456 Park Ave, New York",
        experience: "8+ years experience",
        acceptsInsurance: true,
        rating: "4.2",
        reviewCount: 189,
        availableToday: false,
        onlineConsultation: true,
        imageUrl: "https://randomuser.me/api/portraits/men/64.jpg"
      },
      {
        name: "Dr. Emily Rodriguez",
        specialty: "Dermatologist",
        location: "New York",
        address: "Skin Care Center, 789 Broadway, New York",
        experience: "12+ years experience",
        acceptsInsurance: true,
        rating: "5.0",
        reviewCount: 312,
        availableToday: true,
        onlineConsultation: false,
        imageUrl: "https://randomuser.me/api/portraits/women/65.jpg"
      },
      {
        name: "Dr. James Wilson",
        specialty: "Cardiologist",
        location: "New York",
        address: "Heart Center, 567 Fifth Ave, New York",
        experience: "20+ years experience",
        acceptsInsurance: true,
        rating: "4.9",
        reviewCount: 423,
        availableToday: false,
        onlineConsultation: true,
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        name: "Dr. Lisa Patel",
        specialty: "Pediatrician",
        location: "New York",
        address: "Children's Medical, 890 West St, New York",
        experience: "10+ years experience",
        acceptsInsurance: true,
        rating: "4.7",
        reviewCount: 278,
        availableToday: true,
        onlineConsultation: false,
        imageUrl: "https://randomuser.me/api/portraits/women/45.jpg"
      },
      {
        name: "Dr. Robert Kim",
        specialty: "Neurologist",
        location: "New York",
        address: "Neuro Institute, 234 East 42nd St, New York",
        experience: "17+ years experience",
        acceptsInsurance: true,
        rating: "4.6",
        reviewCount: 156,
        availableToday: false,
        onlineConsultation: true,
        imageUrl: "https://randomuser.me/api/portraits/men/22.jpg"
      }
    ];

    // Add doctors to database
    for (const doctorData of sampleDoctors) {
      const doctor = await this.createDoctor(doctorData);
      // Generate appointment slots for each doctor
      await this.generateAppointmentSlots(doctor.id);
    }
    
    console.log("Database seeded successfully with doctors and appointment slots");
  }

  // Generate sample appointment slots for a doctor
  private async generateAppointmentSlots(doctorId: number) {
    const today = new Date();
    const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    
    // Create slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(today, i);
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      
      // Select 3-5 random slots per day
      const numSlots = Math.floor(Math.random() * 3) + 3; // 3-5 slots
      const selectedIndices = new Set<number>();
      
      while (selectedIndices.size < numSlots) {
        const randomIndex = Math.floor(Math.random() * timeSlots.length);
        selectedIndices.add(randomIndex);
      }
      
      // Create each appointment slot
      for (const index of selectedIndices) {
        const slot: InsertAppointmentSlot = {
          doctorId,
          date: formattedDate,
          time: timeSlots[index],
          isAvailable: true
        };
        await this.createAppointmentSlot(slot);
      }
    }
  }
}

// Use database storage in production, memory storage in development for fast prototyping
export const storage = new DatabaseStorage();
