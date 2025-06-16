import bcrypt from "bcryptjs";
import crypto from "crypto";
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
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
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

// Email sending would be configured here in production
export const sendConfirmationEmail = async (email: string, token: string) => {
  // In development, just log the confirmation link
  const confirmationLink = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/confirm-email?token=${token}`;
  console.log(`Email confirmation link for ${email}: ${confirmationLink}`);
  
  // In production, you would send an actual email using nodemailer
  // const transporter = nodemailer.createTransporter(...);
  // await transporter.sendMail({
  //   to: email,
  //   subject: 'Confirm Your VetBB Account',
  //   html: `Click <a href="${confirmationLink}">here</a> to confirm your account.`
  // });
};