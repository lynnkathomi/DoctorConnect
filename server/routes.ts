import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { format } from "date-fns";
import { 
  insertAppointmentSchema, 
  insertUserSchema, 
  insertDoctorSchema,
  SPECIALTIES
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  const apiRouter = express.Router();

  // Authentication middleware for protected routes 
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "You must be logged in to access this resource" });
  };

  // Get all specialties
  apiRouter.get("/specialties", async (_req: Request, res: Response) => {
    res.json(SPECIALTIES);
  });

  // Get all doctors or filter by specialty, location, etc.
  apiRouter.get("/doctors", async (req: Request, res: Response) => {
    const { specialty, location, availableToday, onlineConsultation, acceptsInsurance } = req.query;

    const filters = {
      specialty: specialty as string | undefined,
      location: location as string | undefined,
      availableToday: availableToday === "true",
      onlineConsultation: onlineConsultation === "true",
      acceptsInsurance: acceptsInsurance === "true"
    };

    // Only include defined filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    const doctors = await storage.getDoctors(cleanFilters);
    res.json(doctors);
  });

  // Get a specific doctor by ID
  apiRouter.get("/doctors/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const doctor = await storage.getDoctor(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  });

  // Get available appointment slots for a doctor
  apiRouter.get("/doctors/:id/slots", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const doctor = await storage.getDoctor(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const slots = await storage.getAppointmentSlotsByDoctor(id);
    
    // Format slots for client display
    const formattedSlots = slots.map(slot => {
      const date = new Date(slot.date);
      const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
      const isTomorrow = format(date, "yyyy-MM-dd") === 
        format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd");
      
      let displayDate;
      if (isToday) {
        displayDate = "Today";
      } else if (isTomorrow) {
        displayDate = "Tomorrow";
      } else {
        displayDate = format(date, "EEE");
      }
      
      return {
        id: slot.id,
        date: slot.date,
        time: slot.time,
        displayDate,
        displayTime: slot.time,
        display: `${displayDate}, ${slot.time}`
      };
    });
    
    res.json(formattedSlots);
  });

  // Book an appointment
  apiRouter.post("/appointments", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const appointmentData = insertAppointmentSchema.parse(req.body);
      
      // Check if doctor exists
      const doctor = await storage.getDoctor(appointmentData.doctorId);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      
      // Check if slot exists and is available
      const slot = await storage.getAppointmentSlot(appointmentData.slotId);
      if (!slot) {
        return res.status(404).json({ message: "Appointment slot not found" });
      }
      
      if (!slot.isAvailable) {
        return res.status(400).json({ message: "This appointment slot is no longer available" });
      }
      
      // Create appointment with a unique appointmentId
      const appointmentId = `APT${Math.floor(Math.random() * 90000000) + 10000000}`;
      const appointment = await storage.createAppointment({
        ...appointmentData,
        appointmentId
      });
      
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to book appointment" });
    }
  });

  // Get user appointments
  apiRouter.get("/users/:userId/appointments", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const appointments = await storage.getAppointmentsByUserId(userId);
    
    // Get doctor information for each appointment
    const appointmentsWithDoctors = await Promise.all(appointments.map(async (appointment) => {
      const doctor = await storage.getDoctor(appointment.doctorId);
      return {
        ...appointment,
        doctor
      };
    }));
    
    res.json(appointmentsWithDoctors);
  });

  // Register the API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
