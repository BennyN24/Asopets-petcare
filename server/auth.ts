import bcrypt from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { storage } from "./storage";
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { env, isDevelopment } from "./config";

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
    name: 'connect.sid',
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: !isDevelopment,
      maxAge: sessionTtl,
      sameSite: 'lax',
      path: '/',
    },
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Unauthorized" });
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
}

// Configure SendGrid
if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}

export const sendConfirmationEmail = async (email: string, token: string) => {
  const baseUrl = isDevelopment 
    ? `http://localhost:5000`
    : (env.BASE_URL || "https://asopets.replit.app");
  const confirmationLink = `${baseUrl}/email-confirmed?token=${encodeURIComponent(token)}`;

  // Always log the confirmation link for testing
  console.log(`\n=== EMAIL CONFIRMATION LINK ===`);
  console.log(`Email: ${email}`);
  console.log(`Link: ${confirmationLink}`);
  console.log(`================================\n`);

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
    ? 'http://localhost:5000' 
    : (env.BASE_URL || "https://asopets.replit.app");
  const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  // Always log the password reset link for testing
  console.log(`\n=== PASSWORD RESET LINK ===`);
  console.log(`Email: ${email}`);
  console.log(`Link: ${resetLink}`);
  console.log(`===========================\n`);

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
        from: "support@asopets.com",
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
