
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production"]).default("production"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  SENDGRID_API_KEY: z.string().min(1, "SENDGRID_API_KEY is required"),
  GOOGLE_MAPS_API_KEY: z.string().min(1, "GOOGLE_MAPS_API_KEY is required"),
  BASE_URL: z.string().url().default("https://your-app.replit.app"),
});

export const env = envSchema.parse(process.env);

export const isDevelopment = false;
export const isProduction = true;
