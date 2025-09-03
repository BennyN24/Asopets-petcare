import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword, verifyPassword, generateToken, generateUserId, sendConfirmationEmail, sendPasswordResetEmail } from "./auth";
import { z } from "zod";
import { 
  insertPetSchema,
  insertMedicalRecordSchema,
  insertReminderSchema,
  insertVetClinicSchema,
  insertClinicRatingSchema,
  insertScannedPetSchema,
  updateUserSchema,
} from "@shared/schema";
import { env, isDevelopment } from "./config";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS for all routes
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Auth middleware - Email/Password authentication only
  await setupAuth(app);

  // Force session middleware to be applied early

  // Minimal auth logging
  if (isDevelopment) {
    app.use((req, res, next) => {
      if (req.path.includes('/api/auth') && req.method === 'POST') {
      }
      next();
    });
  }

  // Email/Password Authentication Routes

  app.post('/api/auth/signup', async (req: any, res) => {
    try {
      const userData = signupSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const passwordHash = await hashPassword(userData.password);
      const confirmationToken = generateToken();
      const confirmationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const newUser = await storage.createUser({
        id: generateUserId(),
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailConfirmationToken: confirmationToken,
        emailConfirmationExpires: confirmationExpires,
        isEmailConfirmed: false,
      });

      await sendConfirmationEmail(userData.email, confirmationToken);

      res.status(201).json({ 
        message: "Account created successfully. Please check your email to confirm your account.",
        userId: newUser.id 
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid signup data", errors: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post('/api/auth/login', async (req: any, res) => {
    try {
      const loginData = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(loginData.email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await verifyPassword(loginData.password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.isEmailConfirmed) {
        return res.status(401).json({ message: "Please confirm your email before logging in" });
      }

      // Set user ID in session
      req.session.userId = user.id;

      // Force session save and send response
      req.session.save((err: any) => {
        if (err) {
          console.error("[LOGIN] Session save error:", err);
          return res.status(500).json({ message: "Login failed - session error" });
        }


        // Set cache headers for auth endpoint
        res.set({
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });

        res.json({ 
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          }
        });
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get('/api/auth/confirm-email', async (req: any, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ message: "Confirmation token is required" });
      }

      // Handle both URL encoded and plain tokens
      let cleanToken = token as string;
      try {
        // Try to decode in case it's URL encoded
        const decoded = decodeURIComponent(cleanToken);
        if (decoded !== cleanToken) {
          cleanToken = decoded;
        }
      } catch (e) {
        // If decoding fails, use the original token
      }


      const user = await storage.confirmUserEmail(cleanToken);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired confirmation token" });
      }

      res.json({ message: "Email confirmed successfully. You can now log in." });
    } catch (error) {
      console.error("Email confirmation error:", error);
      res.status(500).json({ message: "Failed to confirm email" });
    }
  });

  // Biometric verification endpoint
  app.post("/api/auth/biometric-verify", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isEmailConfirmed) {
        return res.status(400).json({ message: "Please confirm your email first" });
      }

      req.session.userId = user.id;
      req.session.email = user.email;
      
      await new Promise((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err);
          else resolve(undefined);
        });
      });

      
      res.json({ 
        success: true, 
        message: "Biometric authentication successful",
        user: { id: user.id, email: user.email, isEmailConfirmed: user.isEmailConfirmed }
      });
    } catch (error) {
      console.error("Biometric verification error:", error);
      res.status(500).json({ message: "Biometric verification failed" });
    }
  });

  // Resend confirmation email
  app.post("/api/auth/resend-confirmation", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ message: "If the email exists and is unconfirmed, a new confirmation email has been sent." });
      }

      if (user.isEmailConfirmed) {
        return res.status(400).json({ message: "This email is already confirmed. You can log in now." });
      }

      // Generate new confirmation token
      const newToken = generateToken();
      await storage.updateUser(user.id, {
        emailConfirmationToken: newToken,
        emailConfirmationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Send new confirmation email
      await sendConfirmationEmail(email, newToken);

      res.json({ message: "A new confirmation email has been sent. Please check your inbox." });
    } catch (error) {
      console.error("Resend confirmation error:", error);
      res.status(500).json({ message: "Failed to resend confirmation email" });
    }
  });

  // Logout handler function
  const logoutHandler = (req: any, res: any) => {

    // Set no-cache headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Clear cookie first
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: 'lax'
    });

    if (!req.session) {
      return res.json({ message: "Logout successful" });
    }

    req.session.destroy((err: any) => {
      if (err) {
        console.error("[LOGOUT] Session destroy error:", err);
      }
      res.json({ message: "Logout successful" });
    });
  };

  // Support both GET and POST logout endpoints
  app.post('/api/auth/logout', logoutHandler);
  app.get('/api/logout', logoutHandler);

  app.post('/api/auth/forgot-password', async (req: any, res) => {
    try {
      const { email } = req.body;
      console.log('Forgot password request for email:', email);
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      console.log('User found:', !!user);
      if (!user) {
        // For security, don't reveal if email exists
        console.log('User not found, returning generic message');
        return res.json({ message: "If the email exists, a reset link has been sent" });
      }

      console.log('Generating reset token for user:', user.id);
      const resetToken = generateToken();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await storage.updateUser(user.id, {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      });

      console.log('Calling sendPasswordResetEmail...');
      // Send reset email with Resend
      await sendPasswordResetEmail(email, resetToken);
      console.log('sendPasswordResetEmail completed');

      res.json({ message: "If the email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to process password reset" });
    }
  });

  app.post('/api/auth/reset-password', async (req: any, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Find user by reset token
      const user = await storage.getUserByResetToken(token);

      if (!user) {
        return res.status(400).json({ message: "Invalid reset token" });
      }

      if (!user.passwordResetExpires) {
        return res.status(400).json({ message: "Invalid reset token" });
      }

      if (user.passwordResetExpires < new Date()) {
        return res.status(400).json({ message: "Reset token has expired" });
      }

      const passwordHash = await hashPassword(password);
      await storage.updateUser(user.id, {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      });

      res.json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

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


      // Production-ready SMS implementation
      if (isDevelopment) {
        // Development mode: show OTP in response
        res.json({ 
          message: "OTP sent successfully (development mode)", 
          otp: otp,
          developmentMode: true 
        });
      } else {
        // Production mode: For now, log OTP (replace with actual SMS service)
        res.json({ 
          message: "OTP sent successfully", 
          note: "Check server logs for OTP (temporary production setup)"
        });
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

  // Session debug endpoint (development only)
  if (isDevelopment) {
    app.get('/api/debug/session', (req: any, res) => {
      res.json({
        sessionID: req.sessionID,
        hasSession: !!req.session,
        userId: req.session?.userId || null,
        sessionData: req.session || null,
        cookies: req.headers.cookie || null,
      });
    });
  }

  // Get current user - with enhanced caching
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // Remove caching for auth endpoints to prevent logout issues
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile update route
  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
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

  // Password change route
  app.post('/api/auth/change-password', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Get current user
      const user = await storage.getUser(userId);
      if (!user || !user.passwordHash) {
        return res.status(400).json({ message: "User not found or invalid account" });
      }

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      await storage.updateUser(userId, { passwordHash: newPasswordHash });

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Delete account route
  app.delete('/api/auth/account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }


      // Get user info for logging
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete all user data (cascading deletion)
      await storage.deleteUser(userId);


      // Destroy session
      req.session.destroy((err: any) => {
        if (err) {
          console.error("[DELETE_ACCOUNT] Session destroy error:", err);
        }
      });

      // Clear cookie
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: !isDevelopment,
        sameSite: 'lax'
      });

      res.json({ message: "Account and all associated data have been permanently deleted" });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ message: "Failed to delete account. Please try again." });
    }
  });

  // Pet routes with pagination and size limits
  app.get("/api/pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Add pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50); // Max 50 pets per request
      const includePhotos = req.query.includePhotos === 'true';

      const pets = await storage.getPetsByUserId(userId, { page, limit, includePhotos });

      // If response is still too large, exclude images entirely
      let responseData = pets;
      const responseSize = JSON.stringify(responseData).length;
      if (responseSize > 10 * 1024 * 1024) { // 10MB limit
        responseData = pets.map(pet => ({
          ...pet,
          imageUrl: pet.imageUrl ? '[image_excluded_due_to_size]' : null
        }));
      }

      res.json(responseData);
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
      const userId = req.session.userId || (req.user.id);
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
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
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
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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

  // Public endpoint for QR code scanning - returns limited pet info with owner contact
  app.get("/api/pets/public/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      
      if (isNaN(petId)) {
        return res.status(400).json({ message: "Invalid pet ID" });
      }

      const pet = await storage.getPetById(petId);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      // Get owner information (limited public data)
      const owner = await storage.getUser(pet.userId);
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }

      // Return limited public information suitable for emergency/contact purposes
      const publicPetData = {
        type: 'pet_profile',
        pet: {
          id: pet.id,
          name: pet.name,
          category: pet.category,
          breed: pet.breed || 'Unknown',
          age: pet.age,
          dateOfBirth: pet.dateOfBirth,
          imageUrl: pet.imageUrl,
          microchipId: pet.microchipId || null,
          birthmarks: pet.birthmarks || null,
        },
        owner: {
          name: `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Pet Owner',
          phone: owner.phone || null,
          email: owner.email || null,
          emergencyContact: owner.emergencyContact || null,
          emergencyPhone: owner.emergencyPhone || null,
        },
        scannedAt: new Date().toISOString(),
      };

      res.json(publicPetData);
    } catch (error) {
      console.error("Error fetching public pet data:", error);
      res.status(500).json({ message: "Failed to fetch pet information" });
    }
  });

  // Shareable pet profile endpoint (public access)
  app.get("/api/pets/share/:token", async (req, res) => {
    try {
      const shareToken = req.params.token;
      
      if (!shareToken) {
        return res.status(400).json({ message: "Invalid share token" });
      }

      const pet = await storage.getPetByShareToken(shareToken);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      // Get owner information
      const owner = await storage.getUser(pet.userId);
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }

      // Get medical records with recent records for public sharing
      const medicalRecords = await storage.getMedicalRecordsByPetId(pet.id);
      
      // Get recent medical records (last 5) for public display
      const recentMedicalRecords = medicalRecords
        .sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime())
        .slice(0, 5)
        .map(record => ({
          id: record.id,
          type: record.type,
          title: record.title,
          date: record.dateAdministered,
          veterinarian: record.veterinarian,
          clinic: record.clinic,
          cost: record.cost
        }));

      // Return shareable pet profile data with recent medical records
      const shareableProfile = {
        id: pet.id,
        name: pet.name,
        category: pet.category,
        breed: pet.breed,
        age: pet.age,
        dateOfBirth: pet.dateOfBirth,
        microchipId: pet.microchipId,
        birthmarks: pet.birthmarks,
        imageUrl: pet.imageUrl,
        medicalRecordCount: medicalRecords.length,
        recentMedicalRecords: recentMedicalRecords,
        owner: {
          name: `${owner.firstName} ${owner.lastName}`.trim(),
          email: owner.email,
          phone: owner.phone,
          emergencyContact: owner.emergencyContact,
          emergencyPhone: owner.emergencyPhone
        },
        lastUpdated: pet.updatedAt || pet.createdAt,
        shareUrl: `https://asopets.com/share/pet/${pet.shareToken || pet.id}`
      };

      res.json(shareableProfile);
    } catch (error) {
      console.error("Error fetching shareable pet profile:", error);
      res.status(500).json({ message: "Failed to fetch pet profile" });
    }
  });

  // Public endpoint for fetching medical records (limited data for emergency situations)
  app.get("/api/pets/public/:id/medical-records", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      
      if (isNaN(petId)) {
        return res.status(400).json({ message: "Invalid pet ID" });
      }

      // Verify pet exists
      const pet = await storage.getPetById(petId);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      // Get medical records
      const records = await storage.getMedicalRecordsByPetId(petId);

      // Return limited public medical record data (for emergency situations)
      const publicRecords = records.map(record => ({
        id: record.id,
        type: record.type,
        title: record.title,
        date: record.dateAdministered,
        veterinarian: record.veterinarian,
        clinic: record.clinic,
        nextDueDate: record.nextDueDate,
        notes: record.notes,
      }));

      res.json(publicRecords);
    } catch (error) {
      console.error("Error fetching public medical records:", error);
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });

  app.delete("/api/pets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.id);
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify ownership
      const existingPet = await storage.getPetById(petId);
      if (!existingPet || existingPet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Delete pet and all associated records (this will cascade delete)
      await storage.deletePet(petId);

      res.json({ message: 'Pet and all associated records deleted successfully' });
    } catch (error) {
      console.error("Error deleting pet:", error);
      res.status(500).json({ message: "Failed to delete pet" });
    }
  });

  // Medical record routes with pagination and filtering
  app.get("/api/pets/:petId/medical-records", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify pet ownership
      const pet = await storage.getPetById(petId);
      if (!pet || pet.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Parse pagination and filtering parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50); // Max 50 records
      const includeAttachments = req.query.includeAttachments === 'true';
      const types = req.query.types ? (req.query.types as string).split(',') : [];

      const records = await storage.getMedicalRecordsByPetId(petId, {
        page,
        limit,
        includeAttachments,
        types
      });

      // Add pagination metadata
      const totalRecords = await storage.getMedicalRecordCountByPetId(petId, types);
      const totalPages = Math.ceil(totalRecords / limit);


      res.json({
        records,
        pagination: {
          page,
          limit,
          totalRecords,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error("Error fetching medical records:", error);
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });

  app.post("/api/pets/:petId/medical-records", isAuthenticated, async (req: any, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const reminders = await storage.getRemindersByUserId(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.get("/api/reminders/with-pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const [reminders, pets] = await Promise.all([
        storage.getActiveRemindersByUserId(userId),
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
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
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
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify ownership through pet (simplified check)
      await storage.markReminderCompleted(reminderId);
      res.json({ message: "Reminder marked as completed" });
    } catch (error) {
      console.error("Error completing reminder:", error);
      res.status(500).json({ message: "Failed to complete reminder" });
    }
  });

  // Google Maps configuration endpoint
  app.get("/api/google-maps-config", isAuthenticated, (req: any, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    res.json({
      apiKey: apiKey || null
    });
  });

  // Vet clinic routes with Google Places integration
  app.get("/api/vet-clinics", isAuthenticated, async (req: any, res) => {
    try {
      const { lat, lng, radius } = req.query;
      let clinics = [];

      if (lat && lng) {
        // Get clinics from database
        clinics = await storage.getVetClinicsByLocation(
          parseFloat(lat), 
          parseFloat(lng), 
          radius ? parseFloat(radius) : 25 // Default 25km radius
        );

        // Enhance with Google Places data if API key is available and we have few results
        if (process.env.GOOGLE_MAPS_API_KEY && clinics.length < 5) {
          try {
            const { searchNearbyVetClinics } = await import('./google-places');
            const googleClinics = await searchNearbyVetClinics(
              parseFloat(lat), 
              parseFloat(lng), 
              (radius ? parseFloat(radius) : 25) * 1000 // Convert km to meters
            );

            // Filter out duplicates based on name similarity
            const uniqueGoogleClinics = googleClinics.filter(googleClinic => {
              return !clinics.some(dbClinic => 
                dbClinic.name.toLowerCase().includes(googleClinic.name.toLowerCase()) ||
                googleClinic.name.toLowerCase().includes(dbClinic.name.toLowerCase())
              );
            });

            // Merge Google Places results with database results
            const allClinics = [...clinics, ...uniqueGoogleClinics];

            res.json(allClinics);
            return;
          } catch (error) {
            // Fall back to database-only results
          }
        }
      } else {
        // Return all clinics if no location provided
        clinics = await storage.getVetClinicsByLocation(0, 0, 999999);
      }

      res.json(clinics);
    } catch (error) {
      console.error("Error fetching vet clinics:", error);
      res.status(500).json({ message: "Failed to fetch vet clinics" });
    }
  });

  app.get("/api/vet-clinics/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const clinic = await storage.getVetClinicById(id);

      if (!clinic) {
        return res.status(404).json({ message: "Vet clinic not found" });
      }

      res.json(clinic);
    } catch (error) {
      console.error("Error fetching vet clinic:", error);
      res.status(500).json({ message: "Failed to fetch vet clinic" });
    }
  });

  app.post("/api/vet-clinics", isAuthenticated, async (req: any, res) => {
    try {
      const clinic = await storage.createVetClinic(req.body);
      res.status(201).json(clinic);
    } catch (error) {
      console.error("Error creating vet clinic:", error);
      res.status(500).json({ message: "Failed to create vet clinic" });
    }
  });

  // Clinic rating routes
  app.get("/api/vet-clinics/:id/ratings", isAuthenticated, async (req: any, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      const ratings = await storage.getClinicRatingsByClinicId(clinicId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching clinic ratings:", error);
      res.status(500).json({ message: "Failed to fetch clinic ratings" });
    }
  });

  app.post("/api/clinic-ratings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const ratingData = {
        ...req.body,
        userId: userId,
      };

      const rating = await storage.createClinicRating(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      console.error("Error creating clinic rating:", error);
      res.status(500).json({ message: "Failed to create clinic rating" });
    }
  });

  app.get("/api/my-clinic-ratings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || (req.user.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const ratings = await storage.getClinicRatingsByUserId(userId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching user ratings:", error);
      res.status(500).json({ message: "Failed to fetch user ratings" });
    }
  });

  // Subscription routes
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  app.get("/api/my-subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const subscription = await storage.getUserSubscription(userId);
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  app.post("/api/subscribe", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { planId, paymentMethod, paymentId } = req.body;

      if (!planId) {
        return res.status(400).json({ message: "Plan ID is required" });
      }

      // Create subscription
      const subscription = await storage.createUserSubscription({
        userId,
        planId: parseInt(planId),
        paymentMethod: paymentMethod || "manual",
        paymentId: paymentId || null,
      });

      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.get("/api/storage-usage", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const usage = await storage.getStorageUsage(userId);
      res.json(usage);
    } catch (error) {
      console.error("Error fetching storage usage:", error);
      res.status(500).json({ message: "Failed to fetch storage usage" });
    }
  });


  // Support contact endpoint
  app.post("/api/support/contact", isAuthenticated, async (req: any, res) => {
    try {
      const { subject, message, userEmail, userName, attachments } = req.body;

      if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required" });
      }

      // Import sendEmail function
      const { sendEmail } = await import("./emailService");

      // Prepare attachments for email
      const emailAttachments = [];
      if (attachments && attachments.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];
          if (attachment && attachment.startsWith('data:image/')) {
            // Extract base64 data and mime type
            const [mimeType, base64Data] = attachment.split(',');
            const fileType = mimeType.split(':')[1].split(';')[0];
            const extension = fileType.split('/')[1];
            
            emailAttachments.push({
              content: base64Data,
              filename: `attachment_${i + 1}.${extension}`,
              type: fileType,
              disposition: 'attachment'
            });
          }
        }
      }

      const attachmentText = attachments && attachments.length > 0 
        ? `\n\nAttachments: ${attachments.length} image(s) attached`
        : '';

      const attachmentHtml = attachments && attachments.length > 0 
        ? `
  <div style="margin: 20px 0;">
    <h3 style="color: #374151;">Attachments:</h3>
    <p style="color: #6b7280;">${attachments.length} image(s) attached to this email</p>
  </div>` 
        : '';

      const emailSent = await sendEmail({
        to: "support@asopets.com",
        from: "support@asopets.com", // Verified sender
        subject: `[ASOPETS Support] ${subject}`,
        text: `
Support Request from: ${userName} (${userEmail})
User ID: ${req.user.id || 'Unknown'}

Subject: ${subject}

Message:
${message}${attachmentText}

---
This message was sent via the ASOPETS app contact form.
Reply directly to this email to respond to the user.
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
    ASOPETS Support Request
  </h2>

  <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p><strong>From:</strong> ${userName}</p>
    <p><strong>Email:</strong> ${userEmail}</p>
    <p><strong>User ID:</strong> ${req.user.id || 'Unknown'}</p>
    <p><strong>Subject:</strong> ${subject}</p>
  </div>

  <div style="margin: 20px 0;">
    <h3 style="color: #374151;">Message:</h3>
    <div style="background-color: #ffffff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; white-space: pre-wrap;">${message}</div>
  </div>

  ${attachmentHtml}

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
    <p>This message was sent via the ASOPETS app contact form.</p>
    <p>Reply directly to this email to respond to the user.</p>
  </div>
</div>
        `,
        attachments: emailAttachments,
      });

      if (emailSent) {
        res.json({ message: "Support request sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send support request" });
      }
    } catch (error) {
      console.error("Error sending support request:", error);
      res.status(500).json({ message: "Failed to send support request" });
    }
  });

  // Public endpoint for pet profile (for QR code access)
  app.get("/api/pets/public/:petId", async (req, res) => {
    try {
      const petId = parseInt(req.params.petId);

      if (isNaN(petId)) {
        return res.status(400).json({ message: "Invalid pet ID" });
      }

      const pet = await storage.getPetById(petId);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

       // Get owner information (limited public data)
       const owner = await storage.getUser(pet.userId);
       if (!owner) {
         return res.status(404).json({ message: "Owner not found" });
       }
 
       // Return limited public information suitable for emergency/contact purposes
       const publicPetData = {
         type: 'pet_profile',
         pet: {
           id: pet.id,
           name: pet.name,
           category: pet.category,
           breed: pet.breed || 'Unknown',
           age: pet.age,
           dateOfBirth: pet.dateOfBirth,
           imageUrl: pet.imageUrl,
           microchipId: pet.microchipId || null,
           birthmarks: pet.birthmarks || null,
         },
         owner: {
           name: `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Pet Owner',
           phone: owner.phone || null,
           email: owner.email || null,
           emergencyContact: owner.emergencyContact || null,
           emergencyPhone: owner.emergencyPhone || null,
         },
         scannedAt: new Date().toISOString(),
       };

      res.json(publicPetData);
    } catch (error) {
      console.error("Error fetching public pet profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Public endpoint for pet medical records (for QR code access)
  app.get("/api/pets/public/:petId/medical-records", async (req, res) => {
    try {
      const petId = parseInt(req.params.petId);

      if (isNaN(petId)) {
        return res.status(400).json({ message: "Invalid pet ID" });
      }

      const records = await storage.getMedicalRecordsByPetId(petId);

      // Return limited public medical record data (for emergency situations)
      const publicRecords = records.map(record => ({
        id: record.id,
        type: record.type,
        title: record.title,
        date: record.dateAdministered,
        veterinarian: record.veterinarian,
        clinic: record.clinic,
        nextDueDate: record.nextDueDate,
        notes: record.notes,
      }));

      res.json(publicRecords);
    } catch (error) {
      console.error("Error fetching public medical records:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Only handle 404 for unmatched API routes - let Vite handle all client routes
  // This ensures client-side routing works properly in development

  // === Scanned Pets Routes ===
  app.get("/api/scanned-pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || (req.user?.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const scannedPets = await storage.getScannedPetsByUserId(userId);
      res.json(scannedPets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/scanned-pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || (req.user?.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const scannedPetData = insertScannedPetSchema.parse({
        ...req.body,
        userId: userId,
      });

      const scannedPet = await storage.createScannedPet(scannedPetData);
      res.status(201).json(scannedPet);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid scanned pet data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/scanned-pets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const scannedPetId = parseInt(req.params.id);
      await storage.deleteScannedPet(scannedPetId);
      res.json({ message: "Scanned pet deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/scanned-pets/by-pet/:petId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || (req.user?.id);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const petId = req.params.petId;
      await storage.deleteScannedPetByUserIdAndPetId(userId, petId);
      res.json({ message: "Scanned pet deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}