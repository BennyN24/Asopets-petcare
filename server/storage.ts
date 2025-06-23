import {
  users,
  pets,
  medicalRecords,
  reminders,
  vetClinics,
  clinicRatings,
  type User,
  type UpsertUser,
  type UpdateUser,
  type Pet,
  type InsertPet,
  type MedicalRecord,
  type InsertMedicalRecord,
  type Reminder,
  type InsertReminder,
  type VetClinic,
  type InsertVetClinic,
  type ClinicRating,
  type InsertClinicRating,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, lt, isNull, or, gt, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: UpdateUser): Promise<User>;
  confirmUserEmail(token: string): Promise<User | null>;
  
  // Pet operations
  getPetsByUserId(userId: string, options?: { page?: number; limit?: number; includePhotos?: boolean }): Promise<Pet[]>;
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
  getActiveRemindersByUserId(userId: string): Promise<Reminder[]>;
  getRemindersByPetId(petId: number): Promise<Reminder[]>;
  getOverdueRemindersByUserId(userId: string): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder>;
  deleteReminder(id: number): Promise<void>;
  markReminderCompleted(id: number): Promise<void>;
  
  // Vet clinic operations
  getVetClinicsByLocation(latitude: number, longitude: number, radiusKm?: number): Promise<VetClinic[]>;
  getVetClinicById(id: number): Promise<VetClinic | undefined>;
  createVetClinic(clinic: InsertVetClinic): Promise<VetClinic>;
  updateVetClinic(id: number, clinic: Partial<InsertVetClinic>): Promise<VetClinic>;
  
  // Clinic rating operations
  getClinicRatingsByClinicId(clinicId: number): Promise<ClinicRating[]>;
  getClinicRatingsByUserId(userId: string): Promise<ClinicRating[]>;
  createClinicRating(rating: InsertClinicRating): Promise<ClinicRating>;
  updateClinicRating(id: number, rating: Partial<InsertClinicRating>): Promise<ClinicRating>;
  deleteClinicRating(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async confirmUserEmail(token: string): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ 
        isEmailConfirmed: true,
        emailConfirmationToken: null,
        emailConfirmationExpires: null,
        updatedAt: new Date()
      })
      .where(and(
        eq(users.emailConfirmationToken, token),
        or(
          isNull(users.emailConfirmationExpires),
          gt(users.emailConfirmationExpires, new Date())
        )
      ))
      .returning();
    return user || null;
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
    // Filter out empty string dates and undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(userData).filter(([key, value]) => 
        value !== '' && value !== undefined && value !== null
      )
    );

    const [user] = await db
      .update(users)
      .set({
        ...cleanedData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.passwordResetToken, token));
    return user;
  }

  // Pet operations
  async getPetsByUserId(userId: string, options: { page?: number; limit?: number; includePhotos?: boolean } = {}): Promise<Pet[]> {
    const { page = 1, limit = 20, includePhotos = true } = options;
    const offset = (page - 1) * limit;
    
    let query;
    
    // Exclude image URLs if not requested to reduce response size
    if (!includePhotos) {
      query = db.select({
        id: pets.id,
        userId: pets.userId,
        name: pets.name,
        category: pets.category,
        breed: pets.breed,
        dateOfBirth: pets.dateOfBirth,
        age: pets.age,
        microchipId: pets.microchipId,
        birthmarks: pets.birthmarks,
        createdAt: pets.createdAt,
        updatedAt: pets.updatedAt,
        imageUrl: sql`null`
      });
    } else {
      query = db.select();
    }
    
    const result = await query
      .from(pets)
      .where(eq(pets.userId, userId))
      .orderBy(desc(pets.createdAt))
      .limit(limit)
      .offset(offset);
    
    return result as Pet[];
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
    try {
      // Start a transaction to ensure all related data is deleted consistently
      await db.transaction(async (tx) => {
        // Delete all reminders for this pet
        await tx.delete(reminders).where(eq(reminders.petId, id));
        
        // Delete all medical records for this pet  
        await tx.delete(medicalRecords).where(eq(medicalRecords.petId, id));
        
        // Finally delete the pet
        const results = await tx.delete(pets).where(eq(pets.id, id));
        if (results.length === 0) {
          throw new Error('Pet not found');
        }
      });
    } catch (error) {
      console.error('Error deleting pet and associated records:', error);
      throw error;
    }
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
    const results = await db
      .select()
      .from(reminders)
      .innerJoin(pets, eq(reminders.petId, pets.id))
      .where(eq(pets.userId, userId))
      .orderBy(reminders.dueDate);
    return results.map(result => result.reminders);
  }

  async getActiveRemindersByUserId(userId: string): Promise<Reminder[]> {
    const results = await db
      .select()
      .from(reminders)
      .innerJoin(pets, eq(reminders.petId, pets.id))
      .where(and(eq(pets.userId, userId), eq(reminders.isCompleted, false)))
      .orderBy(reminders.dueDate);
    return results.map(result => result.reminders);
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
    const results = await db
      .select()
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
    return results.map(result => result.reminders);
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
      .set({ 
        isCompleted: true,
        completedAt: new Date()
      })
      .where(eq(reminders.id, id));
  }

  // Vet clinic operations
  async getVetClinicsByLocation(latitude: number, longitude: number, radiusKm: number = 25): Promise<VetClinic[]> {
    // Simple distance calculation - in production, would use PostGIS or similar
    const clinics = await db.select().from(vetClinics).orderBy(desc(vetClinics.averageRating));
    return clinics.filter(clinic => {
      if (!clinic.latitude || !clinic.longitude) return true; // Include clinics without location
      const distance = this.calculateDistance(latitude, longitude, 
        parseFloat(clinic.latitude), parseFloat(clinic.longitude));
      return distance <= radiusKm;
    });
  }

  async getVetClinicById(id: number): Promise<VetClinic | undefined> {
    const [clinic] = await db.select().from(vetClinics).where(eq(vetClinics.id, id));
    return clinic;
  }

  async createVetClinic(clinic: InsertVetClinic): Promise<VetClinic> {
    const [newClinic] = await db.insert(vetClinics).values(clinic).returning();
    return newClinic;
  }

  async updateVetClinic(id: number, clinic: Partial<InsertVetClinic>): Promise<VetClinic> {
    const [updatedClinic] = await db
      .update(vetClinics)
      .set(clinic)
      .where(eq(vetClinics.id, id))
      .returning();
    return updatedClinic;
  }

  // Clinic rating operations
  async getClinicRatingsByClinicId(clinicId: number): Promise<ClinicRating[]> {
    return await db
      .select({
        id: clinicRatings.id,
        userId: clinicRatings.userId,
        clinicId: clinicRatings.clinicId,
        rating: clinicRatings.rating,
        review: clinicRatings.review,
        medicalRecordId: clinicRatings.medicalRecordId,
        createdAt: clinicRatings.createdAt,
        updatedAt: clinicRatings.updatedAt,
        userName: users.firstName,
        userLastName: users.lastName,
      })
      .from(clinicRatings)
      .leftJoin(users, eq(clinicRatings.userId, users.id))
      .where(eq(clinicRatings.clinicId, clinicId))
      .orderBy(desc(clinicRatings.createdAt));
  }

  async getClinicRatingsByUserId(userId: string): Promise<ClinicRating[]> {
    return await db.select().from(clinicRatings).where(eq(clinicRatings.userId, userId));
  }

  async createClinicRating(rating: InsertClinicRating): Promise<ClinicRating> {
    const [newRating] = await db.insert(clinicRatings).values(rating).returning();
    
    // Update clinic average rating
    await this.updateClinicAverageRating(rating.clinicId);
    
    return newRating;
  }

  async updateClinicRating(id: number, rating: Partial<InsertClinicRating>): Promise<ClinicRating> {
    const [updatedRating] = await db
      .update(clinicRatings)
      .set(rating)
      .where(eq(clinicRatings.id, id))
      .returning();
    
    // Update clinic average rating if rating changed
    if (rating.rating !== undefined) {
      await this.updateClinicAverageRating(updatedRating.clinicId);
    }
    
    return updatedRating;
  }

  async deleteClinicRating(id: number): Promise<void> {
    const [deletedRating] = await db
      .delete(clinicRatings)
      .where(eq(clinicRatings.id, id))
      .returning();
    
    // Update clinic average rating
    if (deletedRating) {
      await this.updateClinicAverageRating(deletedRating.clinicId);
    }
  }

  // Helper methods
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  private async updateClinicAverageRating(clinicId: number): Promise<void> {
    const ratings = await this.getClinicRatingsByClinicId(clinicId);
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;
    
    await db
      .update(vetClinics)
      .set({ 
        averageRating: averageRating.toFixed(2),
        totalRatings: totalRatings
      })
      .where(eq(vetClinics.id, clinicId));
  }
}

export const storage = new DatabaseStorage();
