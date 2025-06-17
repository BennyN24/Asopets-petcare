import bcrypt from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { storage } from "./storage";
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  // Check for session-based authentication (email/password)
  if (req.session && req.session.userId) {
    return next();
  }

  // Check for Replit Auth (fallback for existing users)
  if (
    req.isAuthenticated &&
    req.isAuthenticated() &&
    req.user &&
    req.user.claims &&
    req.user.claims.sub
  ) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
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
}

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendConfirmationEmail = async (email: string, token: string) => {
  const confirmationLink = `${process.env.BASE_URL || "http://localhost:5000"}/api/auth/confirm-email?token=${token}`;

  try {
    // Check if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirm Your My PetBB Account</title>
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
              <h1>Welcome to ASOPETS!</h1>
            </div>
            <p>Thank you for signing up for ASOPETS - your comprehensive pet care management companion.</p>
            <p>To complete your account setup and start managing your pet's health records, please confirm your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${confirmationLink}" class="button">Confirm Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${confirmationLink}</p>
            <p>This confirmation link will expire in 24 hours for security purposes.</p>
            <div class="footer">
              <p>If you didn't create an ASOPETS account, you can safely ignore this email.</p>
              <p>© 2024 ASOPETS. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const msg = {
        to: email,
        from: "your-email@gmail.com", // Replace with your actual verified email from SendGrid
        subject: "Confirm Your ASOPETS Account",
        html: emailHtml,
        text: `Welcome to ASOPETS! Please confirm your email address by visiting: ${confirmationLink}`,
      };

      await sgMail.send(msg);
      console.log(`Confirmation email sent to ${email}`);
    } else {
      // Development mode - log the link
      console.log(`Email confirmation link for ${email}: ${confirmationLink}`);
      console.log(
        "Note: Configure SENDGRID_API_KEY environment variable to send actual emails",
      );
    }
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    // Still log the link as fallback
    console.log(`Email confirmation link for ${email}: ${confirmationLink}`);
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
) => {
  const resetLink = `${process.env.BASE_URL || "http://localhost:5000"}/reset-password?token=${resetToken}`;

  try {
    if (process.env.SENDGRID_API_KEY) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your ASOPETS Password</title>
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
            <p>We received a request to reset your ASOPETS account password.</p>
            <p>If you made this request, click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetLink}</p>
            <div class="warning">
              <p><strong>Important:</strong> This password reset link will expire in 1 hour for security purposes.</p>
            </div>
            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              <p>© 2024 ASOPETS. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const msg = {
        to: email,
        from: "noreply@gmail.com", // Use your verified email address from SendGrid
        subject: "Reset Your ASOPETS Password",
        html: emailHtml,
        text: `Reset your ASOPETS password by visiting: ${resetLink} (This link expires in 1 hour)`,
      };

      await sgMail.send(msg);
      console.log(`Password reset email sent to ${email}`);
    } else {
      console.log(`Password reset link for ${email}: ${resetLink}`);
      console.log(
        "Note: Configure SENDGRID_API_KEY environment variable to send actual emails",
      );
    }
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    console.log(`Password reset link for ${email}: ${resetLink}`);
  }
};
