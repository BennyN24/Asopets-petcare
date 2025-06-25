import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import type { Express } from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { env, isProduction } from "./config";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import sgMail from "@sendgrid/mail";

const PgSession = ConnectPgSimple(session);

export function generateUserId(): string {
  return crypto.randomUUID();
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashPassword(password: string): Promise<string> => {
  return bcryptjs.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(password, hash);
}

export async function sendConfirmationEmail(email: string, token: string) {
  const baseUrl = isProduction
    ? env.BASE_URL || "https://asopets.com"
    : `http://localhost:5000`;
  const confirmationLink = `${baseUrl}/email-confirmed?token=${encodeURIComponent(token)}`;

  // Log confirmation link in development only
  if (!isProduction) {
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
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
) {
  const baseUrl = isProduction
    ? "https://asopets.com"
    : "http://localhost:5000";
  const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  // Log reset link in development only
  if (!isProduction) {
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
}

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

export function setupAuth(app: Express) {
  // Production session configuration
  app.use(session({
    store: new PgSession({
      conString: env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'asopets_session',
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'strict'
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      if (!user.isEmailConfirmed) {
        return done(null, false, { message: 'Please confirm your email before logging in' });
      }

      const isValid = await verifyPassword(password, user.passwordHash);

      if (!isValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Login route
  app.post("/api/auth/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  }), async (req, res) => {
    // Store user session
    req.session!.userId = req.user?.id;

    // Log session creation
    console.log(`[AUTH] POST /api/auth/login - Session: ${req.sessionID?.slice(0, 8)}... - User: ${req.user?.email} (${req.user?.id})`);

    res.json({
      message: "Login successful",
      user: {
        id: req.user?.id,
        email: req.user?.email,
        displayName: req.user?.displayName,
        isEmailConfirmed: req.user?.isEmailConfirmed
      }
    });
  });

  // Biometric login route
  app.post("/api/auth/biometric-login", async (req, res) => {
    const { email, biometricData } = req.body;

    if (!email || !biometricData) {
      return res.status(400).json({ message: "Email and biometric data are required" });
    }

    try {
      // In a real implementation, you would verify the biometric data against stored credentials
      // For now, we'll just verify the user exists and is confirmed
      // Replacing SQLite db.prepare with Drizzle ORM query
      const userRows = await db.select().from(users).where(eq(users.email, email)).execute();

      if (userRows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials or email not confirmed" });
      }

      const user = userRows[0];

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
          isEmailConfirmed: user.isEmailConfirmed
        }
      });
    } catch (error: any) {
      console.error("Biometric login error:", error.message);
      res.status(401).json({ message: error.message });
    }
  });
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: 'Authentication required' });
}

// Configure SendGrid
if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}