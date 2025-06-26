import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  date,
  boolean,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  address: text("address"),
  city: varchar("city"),
  country: varchar("country", { length: 100 }).default("Philippines"),
  dateOfBirth: date("date_of_birth"),
  emergencyContact: varchar("emergency_contact"),
  emergencyPhone: varchar("emergency_phone"),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("en"),
  notificationPreferences: jsonb("notification_preferences").default({
    email: true,
    sms: false,
    push: true,
    reminders: true
  }),
  isEmailConfirmed: boolean("is_email_confirmed").default(false),
  emailConfirmationToken: varchar("email_confirmation_token"),
  emailConfirmationExpires: timestamp("email_confirmation_expires"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pet categories enum
export const petCategories = ["dog", "cat", "bird", "rabbit", "horse", "exotic", "other"] as const;

// Pets table
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  breed: varchar("breed"),
  dateOfBirth: date("date_of_birth"),
  age: integer("age"), // Age in months for precise tracking
  microchipId: varchar("microchip_id"),
  birthmarks: text("birthmarks"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical record types
export const medicalRecordTypes = ["vaccine", "deworming", "treatment", "surgery", "checkup", "lab-test", "grooming"] as const;

// Medical records table
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  petId: serial("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // vaccine, deworming, treatment, surgery, checkup
  title: varchar("title").notNull(), // e.g., "Rabies Vaccination", "Annual Checkup"
  description: text("description"),
  dateAdministered: date("date_administered").notNull(),
  nextDueDate: date("next_due_date"),
  veterinarian: varchar("veterinarian"),
  clinic: varchar("clinic"),
  batchNumber: varchar("batch_number"),
  weight: varchar("weight"), // pet weight in kg at time of treatment
  cost: varchar("cost"),
  notes: text("notes"),
  imageUrl: varchar("image_url"), // for certificates/records
  attachments: text("attachments").array(), // multiple photo attachments
  reminderEnabled: boolean("reminder_enabled").default(true),
  reminderSms: boolean("reminder_sms").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reminders table for notifications
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  petId: serial("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
  medicalRecordId: serial("medical_record_id").references(() => medicalRecords.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // vaccine, deworming, treatment, checkup
  title: varchar("title").notNull(),
  dueDate: date("due_date").notNull(),
  isOverdue: boolean("is_overdue").default(false),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  notificationSent: boolean("notification_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vet clinics table
export const vetClinics = pgTable("vet_clinics", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  address: text("address").notNull(),
  phone: varchar("phone"),
  email: varchar("email"),
  type: varchar("type").default("general"), // general, emergency, specialty, 24hour
  hours: text("hours"),
  description: text("description"),
  website: varchar("website"),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinic ratings table
export const clinicRatings = pgTable("clinic_ratings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clinicId: integer("clinic_id").notNull().references(() => vetClinics.id, { onDelete: "cascade" }),
  medicalRecordId: integer("medical_record_id").references(() => medicalRecords.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations - keeping only the first definition

export const petsRelations = relations(pets, ({ one, many }) => ({
  user: one(users, {
    fields: [pets.userId],
    references: [users.id],
  }),
  medicalRecords: many(medicalRecords),
  reminders: many(reminders),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one, many }) => ({
  pet: one(pets, {
    fields: [medicalRecords.petId],
    references: [pets.id],
  }),
  reminders: many(reminders),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  pet: one(pets, {
    fields: [reminders.petId],
    references: [pets.id],
  }),
  medicalRecord: one(medicalRecords, {
    fields: [reminders.medicalRecordId],
    references: [medicalRecords.id],
  }),
}));

export const vetClinicsRelations = relations(vetClinics, ({ many }) => ({
  ratings: many(clinicRatings),
}));

export const clinicRatingsRelations = relations(clinicRatings, ({ one }) => ({
  user: one(users, {
    fields: [clinicRatings.userId],
    references: [users.id],
  }),
  clinic: one(vetClinics, {
    fields: [clinicRatings.clinicId],
    references: [vetClinics.id],
  }),
  medicalRecord: one(medicalRecords, {
    fields: [clinicRatings.medicalRecordId],
    references: [medicalRecords.id],
  }),
}));

// Insert schemas
export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  age: z.number().optional(),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertVetClinicSchema = createInsertSchema(vetClinics).omit({
  id: true,
  averageRating: true,
  totalRatings: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClinicRatingSchema = createInsertSchema(clinicRatings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // "Basic", "Premium 3GB", "Premium Unlimited"
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  storageLimit: integer("storage_limit"), // in MB, null for unlimited
  features: jsonb("features").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  status: varchar("status").notNull().default("active"), // active, cancelled, expired
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  paymentMethod: varchar("payment_method"), // stripe, gcash, etc
  paymentId: varchar("payment_id"), // external payment reference
  storageUsed: integer("storage_used").default(0), // in MB
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for subscriptions
export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(userSubscriptions),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userSubscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [userSubscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}));

// Scanned pets table for persistent storage of QR scanned pet profiles
export const scannedPets = pgTable("scanned_pets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  petId: text("pet_id").notNull(),
  ownerId: text("owner_id"),
  type: text("type").notNull().default("pet_profile"),
  name: text("name"),
  petName: text("pet_name"),
  category: text("category"),
  breed: text("breed"),
  dateOfBirth: text("date_of_birth"),
  age: integer("age"),
  imageUrl: text("image_url"),
  microchipId: text("microchip_id"),
  birthmarks: text("birthmarks"),
  medicalRecordCount: integer("medical_record_count").default(0),
  lastUpdated: text("last_updated"),
  ownerName: text("owner_name"),
  ownerPhone: text("owner_phone"),
  ownerEmail: text("owner_email"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  scannedAt: timestamp("scanned_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const scannedPetsRelations = relations(scannedPets, ({ one }) => ({
  user: one(users, {
    fields: [scannedPets.userId],
    references: [users.id],
  }),
}));

// Users relations - consolidated with pets and subscriptions
export const usersRelations = relations(users, ({ many }) => ({
  pets: many(pets),
  subscriptions: many(userSubscriptions),
  scannedPets: many(scannedPets),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type VetClinic = typeof vetClinics.$inferSelect;
export type InsertVetClinic = z.infer<typeof insertVetClinicSchema>;
export type ClinicRating = typeof clinicRatings.$inferSelect;
export type InsertClinicRating = z.infer<typeof insertClinicRatingSchema>;
export type ScannedPet = typeof scannedPets.$inferSelect;
export type InsertScannedPet = z.infer<typeof insertScannedPetSchema>;
export type PetCategory = typeof petCategories[number];
export type MedicalRecordType = typeof medicalRecordTypes[number];
