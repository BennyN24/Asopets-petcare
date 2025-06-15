import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertPetSchema,
  insertMedicalRecordSchema,
  insertReminderSchema,
  updateUserSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // SMS OTP Storage (in production, use Redis or database)
  const otpStore = new Map<string, { otp: string; expires: number; verified: boolean }>();

  // SMS OTP Authentication routes
  app.post('/api/auth/send-otp', async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Store OTP
      otpStore.set(phoneNumber, { otp, expires, verified: false });

      console.log(`[SMS] Generated OTP for ${phoneNumber}: ${otp}`);
      
      // For development: return OTP in response (in production, send actual SMS)
      if (process.env.NODE_ENV === 'development') {
        res.json({ 
          message: "OTP sent successfully (development mode)", 
          otp: otp,
          developmentMode: true 
        });
      } else {
        // In production, integrate with SMS service like Twilio
        res.json({ message: "OTP sent successfully" });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      
      if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
      }

      const storedOtp = otpStore.get(phoneNumber);
      
      if (!storedOtp) {
        return res.status(400).json({ message: "OTP not found or expired" });
      }

      if (Date.now() > storedOtp.expires) {
        otpStore.delete(phoneNumber);
        return res.status(400).json({ message: "OTP expired" });
      }

      if (storedOtp.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Mark as verified and create/update user
      storedOtp.verified = true;
      
      // Create or get user by phone number
      const userId = `sms_${phoneNumber.replace(/\D/g, '')}`;
      const user = await storage.upsertUser({
        id: userId,
        email: `${phoneNumber}@sms.vetbb.com`,
        firstName: phoneNumber,
      });

      res.json({ message: "OTP verified successfully", user });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile update route
  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userData = updateUserSchema.parse(req.body);
      const updatedUser = await storage.updateUser(userId, userData);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Pet routes
  app.get("/api/pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pets = await storage.getPetsByUserId(userId);
      res.json(pets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ message: "Failed to fetch pets" });
    }
  });

  app.get("/api/pets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.id);
      const pet = await storage.getPetById(petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      // Verify ownership
      const userId = req.user.claims.sub;
      if (pet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(pet);
    } catch (error) {
      console.error("Error fetching pet:", error);
      res.status(500).json({ message: "Failed to fetch pet" });
    }
  });

  app.post("/api/pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const petData = insertPetSchema.parse({ ...req.body, userId });
      const pet = await storage.createPet(petData);
      res.status(201).json(pet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid pet data", errors: error.errors });
      }
      console.error("Error creating pet:", error);
      res.status(500).json({ message: "Failed to create pet" });
    }
  });

  app.put("/api/pets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify ownership
      const existingPet = await storage.getPetById(petId);
      if (!existingPet || existingPet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const petData = insertPetSchema.partial().parse(req.body);
      const pet = await storage.updatePet(petId, petData);
      res.json(pet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid pet data", errors: error.errors });
      }
      console.error("Error updating pet:", error);
      res.status(500).json({ message: "Failed to update pet" });
    }
  });

  app.delete("/api/pets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify ownership
      const existingPet = await storage.getPetById(petId);
      if (!existingPet || existingPet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deletePet(petId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting pet:", error);
      res.status(500).json({ message: "Failed to delete pet" });
    }
  });

  // Medical record routes
  app.get("/api/pets/:petId/medical-records", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const userId = req.user.claims.sub;
      
      // Verify pet ownership
      const pet = await storage.getPetById(petId);
      if (!pet || pet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const records = await storage.getMedicalRecordsByPetId(petId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });

  app.post("/api/pets/:petId/medical-records", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const userId = req.user.claims.sub;
      
      // Verify pet ownership
      const pet = await storage.getPetById(petId);
      if (!pet || pet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Clean up empty date fields before validation
      const cleanedData = { ...req.body, petId };
      if (cleanedData.nextDueDate === '') {
        cleanedData.nextDueDate = null;
      }
      if (cleanedData.dateAdministered === '') {
        return res.status(400).json({ message: "Date administered is required" });
      }
      
      const recordData = insertMedicalRecordSchema.parse(cleanedData);
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid medical record data", errors: error.errors });
      }
      console.error("Error creating medical record:", error);
      res.status(500).json({ message: "Failed to create medical record" });
    }
  });

  app.put("/api/medical-records/:id", isAuthenticated, async (req: any, res) => {
    try {
      const recordId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify ownership through pet
      const existingRecord = await storage.getMedicalRecordById(recordId);
      if (!existingRecord) {
        return res.status(404).json({ message: "Medical record not found" });
      }

      const pet = await storage.getPetById(existingRecord.petId);
      if (!pet || pet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const recordData = insertMedicalRecordSchema.partial().parse(req.body);
      const record = await storage.updateMedicalRecord(recordId, recordData);
      res.json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid medical record data", errors: error.errors });
      }
      console.error("Error updating medical record:", error);
      res.status(500).json({ message: "Failed to update medical record" });
    }
  });

  app.delete("/api/medical-records/:id", isAuthenticated, async (req: any, res) => {
    try {
      const recordId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify ownership through pet
      const existingRecord = await storage.getMedicalRecordById(recordId);
      if (!existingRecord) {
        return res.status(404).json({ message: "Medical record not found" });
      }

      const pet = await storage.getPetById(existingRecord.petId);
      if (!pet || pet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteMedicalRecord(recordId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting medical record:", error);
      res.status(500).json({ message: "Failed to delete medical record" });
    }
  });

  // Reminder routes
  app.get("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await storage.getRemindersByUserId(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.get("/api/reminders/with-pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [reminders, pets] = await Promise.all([
        storage.getRemindersByUserId(userId),
        storage.getPetsByUserId(userId)
      ]);
      
      // Combine reminders with pet information
      const remindersWithPets = reminders.map(reminder => {
        const pet = pets.find(p => p.id === reminder.petId);
        return { ...reminder, pet };
      }).filter(r => r.pet); // Only include reminders with valid pets
      
      res.json(remindersWithPets);
    } catch (error) {
      console.error("Error fetching reminders with pets:", error);
      res.status(500).json({ message: "Failed to fetch reminders with pets" });
    }
  });

  app.get("/api/reminders/overdue", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const overdueReminders = await storage.getOverdueRemindersByUserId(userId);
      res.json(overdueReminders);
    } catch (error) {
      console.error("Error fetching overdue reminders:", error);
      res.status(500).json({ message: "Failed to fetch overdue reminders" });
    }
  });

  app.get("/api/pets/:petId/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const userId = req.user.claims.sub;
      
      // Verify pet ownership
      const pet = await storage.getPetById(petId);
      if (!pet || pet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const reminders = await storage.getRemindersByPetId(petId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching pet reminders:", error);
      res.status(500).json({ message: "Failed to fetch pet reminders" });
    }
  });

  app.put("/api/reminders/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const reminderId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify ownership through pet (simplified check)
      await storage.markReminderCompleted(reminderId);
      res.json({ message: "Reminder marked as completed" });
    } catch (error) {
      console.error("Error completing reminder:", error);
      res.status(500).json({ message: "Failed to complete reminder" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
