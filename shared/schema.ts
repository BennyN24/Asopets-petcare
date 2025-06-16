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
  email: varchar("email").unique(),
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
  cost: varchar("cost"),
  notes: text("notes"),
  imageUrl: varchar("image_url"), // for certificates/records
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  pets: many(pets),
}));

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

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
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
export type PetCategory = typeof petCategories[number];
export type MedicalRecordType = typeof medicalRecordTypes[number];
