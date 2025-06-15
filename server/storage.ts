import {
  users,
  pets,
  medicalRecords,
  reminders,
  type User,
  type UpsertUser,
  type UpdateUser,
  type Pet,
  type InsertPet,
  type MedicalRecord,
  type InsertMedicalRecord,
  type Reminder,
  type InsertReminder,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, lt, isNull, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: UpdateUser): Promise<User>;
  
  // Pet operations
  getPetsByUserId(userId: string): Promise<Pet[]>;
  getPetById(id: number): Promise<Pet | undefined>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet>;
  deletePet(id: number): Promise<void>;
  
  // Medical record operations
  getMedicalRecordsByPetId(petId: number): Promise<MedicalRecord[]>;
  getMedicalRecordById(id: number): Promise<MedicalRecord | undefined>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord>;
  deleteMedicalRecord(id: number): Promise<void>;
  
  // Reminder operations
  getRemindersByUserId(userId: string): Promise<Reminder[]>;
  getRemindersByPetId(petId: number): Promise<Reminder[]>;
  getOverdueRemindersByUserId(userId: string): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder>;
  deleteReminder(id: number): Promise<void>;
  markReminderCompleted(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: UpdateUser): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Pet operations
  async getPetsByUserId(userId: string): Promise<Pet[]> {
    return await db
      .select()
      .from(pets)
      .where(eq(pets.userId, userId))
      .orderBy(desc(pets.createdAt));
  }

  async getPetById(id: number): Promise<Pet | undefined> {
    const [pet] = await db.select().from(pets).where(eq(pets.id, id));
    return pet;
  }

  async createPet(pet: InsertPet): Promise<Pet> {
    const [newPet] = await db.insert(pets).values(pet).returning();
    return newPet;
  }

  async updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet> {
    const [updatedPet] = await db
      .update(pets)
      .set({ ...pet, updatedAt: new Date() })
      .where(eq(pets.id, id))
      .returning();
    return updatedPet;
  }

  async deletePet(id: number): Promise<void> {
    await db.delete(pets).where(eq(pets.id, id));
  }

  // Medical record operations
  async getMedicalRecordsByPetId(petId: number): Promise<MedicalRecord[]> {
    return await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.petId, petId))
      .orderBy(desc(medicalRecords.dateAdministered));
  }

  async getMedicalRecordById(id: number): Promise<MedicalRecord | undefined> {
    const [record] = await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.id, id));
    return record;
  }

  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const [newRecord] = await db
      .insert(medicalRecords)
      .values(record)
      .returning();

    // Create reminder if next due date is set and reminders are enabled
    if (newRecord.nextDueDate && newRecord.reminderEnabled) {
      await this.createReminder({
        petId: newRecord.petId,
        medicalRecordId: newRecord.id,
        type: newRecord.type,
        title: `${newRecord.title} Due`,
        dueDate: newRecord.nextDueDate,
        isOverdue: false,
        isCompleted: false,
        notificationSent: false,
      });
    }

    return newRecord;
  }

  async updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord> {
    const [updatedRecord] = await db
      .update(medicalRecords)
      .set({ ...record, updatedAt: new Date() })
      .where(eq(medicalRecords.id, id))
      .returning();

    // Update associated reminders if next due date changed
    if (record.nextDueDate !== undefined) {
      if (record.nextDueDate && updatedRecord.reminderEnabled) {
        // Remove existing reminders for this record
        await db.delete(reminders).where(eq(reminders.medicalRecordId, id));

        // Create 1-day reminder
        const oneDayBefore = new Date(record.nextDueDate);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);
        
        await this.createReminder({
          petId: updatedRecord.petId,
          medicalRecordId: updatedRecord.id,
          type: updatedRecord.type,
          title: `${updatedRecord.title} Due Tomorrow`,
          dueDate: oneDayBefore.toISOString().split('T')[0],
          isOverdue: false,
          isCompleted: false,
          notificationSent: false,
        });

        // Create 1-hour SMS reminder if enabled
        if (updatedRecord.reminderSms) {
          const oneHourBefore = new Date(record.nextDueDate);
          oneHourBefore.setHours(oneHourBefore.getHours() - 1);
          
          await this.createReminder({
            petId: updatedRecord.petId,
            medicalRecordId: updatedRecord.id,
            type: updatedRecord.type,
            title: `${updatedRecord.title} Due in 1 Hour (SMS)`,
            dueDate: oneHourBefore.toISOString().split('T')[0],
            isOverdue: false,
            isCompleted: false,
            notificationSent: false,
          });
        }
      } else {
        // Remove reminders if no due date or reminders disabled
        await db.delete(reminders).where(eq(reminders.medicalRecordId, id));
      }
    }

    return updatedRecord;
  }

  async deleteMedicalRecord(id: number): Promise<void> {
    await db.delete(medicalRecords).where(eq(medicalRecords.id, id));
  }

  // Reminder operations
  async getRemindersByUserId(userId: string): Promise<Reminder[]> {
    return await db
      .select({
        id: reminders.id,
        petId: reminders.petId,
        medicalRecordId: reminders.medicalRecordId,
        type: reminders.type,
        title: reminders.title,
        dueDate: reminders.dueDate,
        isOverdue: reminders.isOverdue,
        isCompleted: reminders.isCompleted,
        notificationSent: reminders.notificationSent,
        createdAt: reminders.createdAt,
      })
      .from(reminders)
      .innerJoin(pets, eq(reminders.petId, pets.id))
      .where(and(eq(pets.userId, userId), eq(reminders.isCompleted, false)))
      .orderBy(reminders.dueDate);
  }

  async getRemindersByPetId(petId: number): Promise<Reminder[]> {
    return await db
      .select()
      .from(reminders)
      .where(and(eq(reminders.petId, petId), eq(reminders.isCompleted, false)))
      .orderBy(reminders.dueDate);
  }

  async getOverdueRemindersByUserId(userId: string): Promise<Reminder[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select({
        id: reminders.id,
        petId: reminders.petId,
        medicalRecordId: reminders.medicalRecordId,
        type: reminders.type,
        title: reminders.title,
        dueDate: reminders.dueDate,
        isOverdue: reminders.isOverdue,
        isCompleted: reminders.isCompleted,
        notificationSent: reminders.notificationSent,
        createdAt: reminders.createdAt,
      })
      .from(reminders)
      .innerJoin(pets, eq(reminders.petId, pets.id))
      .where(
        and(
          eq(pets.userId, userId),
          eq(reminders.isCompleted, false),
          lt(reminders.dueDate, today)
        )
      )
      .orderBy(reminders.dueDate);
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [newReminder] = await db.insert(reminders).values(reminder).returning();
    return newReminder;
  }

  async updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder> {
    const [updatedReminder] = await db
      .update(reminders)
      .set(reminder)
      .where(eq(reminders.id, id))
      .returning();
    return updatedReminder;
  }

  async deleteReminder(id: number): Promise<void> {
    await db.delete(reminders).where(eq(reminders.id, id));
  }

  async markReminderCompleted(id: number): Promise<void> {
    await db
      .update(reminders)
      .set({ isCompleted: true })
      .where(eq(reminders.id, id));
  }
}

export const storage = new DatabaseStorage();
