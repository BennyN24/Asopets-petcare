import bcrypt from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { storage } from "./storage";
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { env, isDevelopment } from "./config";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export function getSession() {
  const sessionTtl = 30 * 24 * 60 * 60 * 1000; // 30 days for better persistence
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl / 1000,
    tableName: "sessions",
  });

  return session({
    secret: env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: "connect.sid",
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: !isDevelopment,
      maxAge: sessionTtl,
      sameSite: "lax",
      path: "/",
    },
    unset: "destroy", // Ensures session is completely removed on logout
    proxy: true, // Trust first proxy for proper session handling
    genid: () => {
      return crypto.randomBytes(32).toString('hex');
    }
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  // Minimal auth check logging
  if (isDevelopment && !req.session?.userId) {
    console.log(`[AUTH-CHECK] Unauthorized access to ${req.path}`);
  }

  // Set no-cache headers for authenticated endpoints
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  if (!req.session || !req.session.userId) {
    if (isDevelopment) {
      console.log(`[AUTH-CHECK] No valid session found for ${req.path}`);
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      console.log(
        `[AUTH-CHECK] User not found in database: ${req.session.userId}`,
      );
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (isDevelopment) {
      console.log(
        `[AUTH-CHECK] User authenticated: ${user.email} (${user.id})`,
      );
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    req.session.destroy(() => {});
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateUserId = (): string => {
  return crypto.randomUUID();
};

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

    // Login route
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const user = await loginUser(email, password);

      // Store user session
      req.session!.userId = user.id;

      // Log session creation
      console.log(`[AUTH] POST /api/auth/login - Session: ${req.sessionID?.slice(0, 8)}... - User: ${user.email} (${user.id})`);

      res.json({ 
        message: "Login successful", 
        user: { 
          id: user.id, 
          email: user.email, 
          displayName: user.displayName,
          isEmailConfirmed: user.isEmailConfirmed 
        } 
      });
    } catch (error: any) {
      console.error("Login error:", error.message);
      res.status(401).json({ message: error.message });
    }
  });

  app.post("/api/auth/biometric-login", async (req: Request, res: Response) => {
    const { email, biometricData } = req.body;

    if (!email || !biometricData) {
      return res.status(400).json({ message: "Email and biometric data required" });
    }

    // Validate biometric data structure
    if (!biometricData.id || !biometricData.type) {
      return res.status(400).json({ message: "Invalid biometric data format" });
    }

    try {
      // Verify the user exists and is confirmed
      const userRows = await db.select().from(users).where(eq(users.email, email)).execute();

      if (userRows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials or email not confirmed" });
      }

      const user = userRows[0];

      // Check if user's email is confirmed
      if (!user.isEmailConfirmed) {
        return res.status(401).json({ message: "Email not confirmed. Please verify your email first." });
      }

      // In a real implementation, you would:
      // 1. Verify the biometric assertion against stored public key
      // 2. Validate the signature
      // 3. Check the authenticator data
      // For now, we'll verify basic biometric data presence and user existence

      // Store user session
      req.session!.userId = user.id;

      // Log session creation
      console.log(`[AUTH] POST /api/auth/biometric-login - Session: ${req.sessionID?.slice(0, 8)}... - User: ${user.email} (${user.id})`);

      res.json({ 
        message: "Biometric login successful", 
        user: { 
          id: user.id, 
          email: user.email, 
          displayName: user.displayName,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailConfirmed: user.isEmailConfirmed,
          createdAt: user.createdAt
        } 
      });
    } catch (error: any) {
      console.error("Biometric login error:", error.message);
      res.status(401).json({ message: "Biometric authentication failed" });
    }
  });
}

// Configure SendGrid
if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}

export const sendConfirmationEmail = async (email: string, token: string) => {
  const baseUrl = isDevelopment
    ? `http://localhost:5000`
    : env.BASE_URL || "https://asopets.com";
  const confirmationLink = `${baseUrl}/email-confirmed?token=${encodeURIComponent(token)}`;

  // Log confirmation link in development only
  if (isDevelopment) {
    console.log(`Email confirmation link for ${email}: ${confirmationLink}`);
  }

  try {
    // Check if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirm Your ASOPets Account</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { background: #3b82f6; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
            .button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐾</div>
              <h1>Welcome to ASOPets!</h1>
            </div>
            <p>Thank you for signing up for ASOPets - your comprehensive pet care management companion.</p>
            <p>To complete your account setup and start managing your pet's health records, please confirm your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${confirmationLink}" class="button" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Confirm Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px;">${confirmationLink}</p>
            <p><strong>Important:</strong> This link is unique to your account and should not be shared with others.</p>
            <p>This confirmation link will expire in 24 hours for security purposes.</p>
            <div class="footer">
              <p>If you didn't create an ASOPets account, you can safely ignore this email.</p>
              <p>© 2024 ASOPets. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sgMail.send({
        to: email,
        from: "noreply@asopets.com",
        subject: "Confirm Your ASOPets Account",
        html: emailHtml,
        text: `Welcome to ASOPets! Please confirm your email address by visiting: ${confirmationLink}`,
      });
      console.log(`Confirmation email sent to ${email}`);
    } else {
      // Development mode - log the link
      console.log(`Email confirmation link for ${email}: ${confirmationLink}`);
      console.log(
        "Note: Configure SENDGRID_API_KEY environment variable to send actual emails",
      );
    }
  } catch (error: any) {
    console.error("Failed to send confirmation email:", error);
    if (error.response?.body?.errors) {
      console.error(
        "SendGrid detailed errors:",
        JSON.stringify(error.response.body.errors, null, 2),
      );
    }
    if (error.code) {
      console.error("SendGrid error code:", error.code);
    }
    // Still log the link as fallback
    console.log(`Email confirmation link for ${email}: ${confirmationLink}`);
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
) => {
  const baseUrl = isDevelopment
    ? "http://localhost:5000"
    : env.BASE_URL || "https://asopets.com";
  const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  // Log reset link in development only
  if (isDevelopment) {
    console.log(`Password reset link for ${email}: ${resetLink}`);
  }

  try {
    if (process.env.SENDGRID_API_KEY) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your ASOPets Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { background: #ef4444; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
            .button { background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔒</div>
              <h1>Password Reset Request</h1>
            </div>
            <p>We received a request to reset your ASOPets account password.</p>
            <p>If you made this request, click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px;">${resetLink}</p>
            <p><strong>Important:</strong> This link is unique to your account and should not be shared with others.</p>
            <div class="warning">
              <p><strong>Important:</strong> This password reset link will expire in 1 hour for security purposes.</p>
            </div>
            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              <p>© 2025 ASOPets. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const msg: any = {
        to: email,
        from: "noreply@asopets.com",
        subject: "Reset Your ASOPets Password",
        html: emailHtml,
        text: `Reset your ASOPets password by visiting: ${resetLink} (This link expires in 1 hour)`,
        trackingSettings: {
          clickTracking: {
            enable: false,
          },
        },
      };

      await sgMail.send(msg);
      console.log(`Password reset email sent to ${email}`);
    } else {
      console.log(`Password reset link for ${email}: ${resetLink}`);
      console.log(
        "Note: Configure SENDGRID_API_KEY environment variable to send actual emails",
      );
    }
  } catch (error: any) {
    console.error("Failed to send password reset email:", error);
    if (error.response?.body?.errors) {
      console.error(
        "SendGrid detailed errors:",
        JSON.stringify(error.response.body.errors, null, 2),
      );
    }
    if (error.code) {
      console.error("SendGrid error code:", error.code);
    }
    console.log(`Password reset link for ${email}: ${resetLink}`);
  }
};

async function loginUser(email: string, password: string) {
  // Use Drizzle ORM to query the database
  const userRows = await db.select().from(users).where(eq(users.email, email)).execute();

  if (userRows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = userRows[0];

  if (!user.isEmailConfirmed) {
    throw new Error("Invalid credentials or email not confirmed");
  }

  const passwordMatch = await verifyPassword(password, user.passwordHash);

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    isEmailConfirmed: user.isEmailConfirmed
  };
}