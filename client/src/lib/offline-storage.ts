import type { InsertMedicalRecord, Pet } from "@shared/schema";

interface OfflineRecord extends InsertMedicalRecord {
  id: string;
  timestamp: number;
  synced: boolean;
}

interface OfflinePet extends Omit<Pet, 'id'> {
  id: string;
  timestamp: number;
  synced: boolean;
}

const OFFLINE_RECORDS_KEY = 'asopets_offline_records';
const OFFLINE_PETS_KEY = 'asopets_offline_pets';

export class OfflineStorage {
  static saveRecord(record: InsertMedicalRecord): string {
    const offlineRecord: OfflineRecord = {
      ...record,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false,
    };

    const existingRecords = this.getOfflineRecords();
    existingRecords.push(offlineRecord);
    localStorage.setItem(OFFLINE_RECORDS_KEY, JSON.stringify(existingRecords));
    
    return offlineRecord.id;
  }

  static savePet(pet: Omit<Pet, 'id'>): string {
    const offlinePet: OfflinePet = {
      ...pet,
      id: `offline_pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false,
    };

    const existingPets = this.getOfflinePets();
    existingPets.push(offlinePet);
    localStorage.setItem(OFFLINE_PETS_KEY, JSON.stringify(existingPets));
    
    return offlinePet.id;
  }

  static getOfflineRecords(): OfflineRecord[] {
    try {
      const records = localStorage.getItem(OFFLINE_RECORDS_KEY);
      return records ? JSON.parse(records) : [];
    } catch {
      return [];
    }
  }

  static getOfflinePets(): OfflinePet[] {
    try {
      const pets = localStorage.getItem(OFFLINE_PETS_KEY);
      return pets ? JSON.parse(pets) : [];
    } catch {
      return [];
    }
  }

  static getUnsyncedRecords(): OfflineRecord[] {
    return this.getOfflineRecords().filter(record => !record.synced);
  }

  static getUnsyncedPets(): OfflinePet[] {
    return this.getOfflinePets().filter(pet => !pet.synced);
  }

  static markRecordSynced(id: string, serverId?: number): void {
    const records = this.getOfflineRecords();
    const recordIndex = records.findIndex(r => r.id === id);
    
    if (recordIndex !== -1) {
      records[recordIndex].synced = true;
      if (serverId) {
        records[recordIndex].petId = serverId; // Update with server ID
      }
      localStorage.setItem(OFFLINE_RECORDS_KEY, JSON.stringify(records));
    }
  }

  static markPetSynced(id: string, serverId?: number): void {
    const pets = this.getOfflinePets();
    const petIndex = pets.findIndex(p => p.id === id);
    
    if (petIndex !== -1) {
      pets[petIndex].synced = true;
      localStorage.setItem(OFFLINE_PETS_KEY, JSON.stringify(pets));
    }
  }

  static clearSyncedData(): void {
    const records = this.getOfflineRecords().filter(r => !r.synced);
    const pets = this.getOfflinePets().filter(p => !p.synced);
    
    localStorage.setItem(OFFLINE_RECORDS_KEY, JSON.stringify(records));
    localStorage.setItem(OFFLINE_PETS_KEY, JSON.stringify(pets));
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static async syncPendingData(): Promise<void> {
    if (!this.isOnline()) return;

    const unsyncedPets = this.getUnsyncedPets();
    const unsyncedRecords = this.getUnsyncedRecords();

    // Sync pets first
    for (const pet of unsyncedPets) {
      try {
        const response = await fetch('/api/pets', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'credentials': 'include'
          },
          credentials: 'include',
          body: JSON.stringify({
            name: pet.name,
            category: pet.category,
            breed: pet.breed,
            dateOfBirth: pet.dateOfBirth,
            age: pet.age,
            microchipId: pet.microchipId,
            birthmarks: pet.birthmarks,
            imageUrl: pet.imageUrl,
          }),
        });

        if (response.ok) {
          const savedPet = await response.json();
          this.markPetSynced(pet.id, savedPet.id);
        }
      } catch (error) {
        // Pet sync failed silently
      }
    }

    // Sync medical records
    for (const record of unsyncedRecords) {
      try {
        const response = await fetch(`/api/pets/${record.petId}/medical-records`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'credentials': 'include'
          },
          credentials: 'include',
          body: JSON.stringify({
            type: record.type,
            title: record.title,
            description: record.description,
            dateAdministered: record.dateAdministered,
            nextDueDate: record.nextDueDate || null,
            veterinarian: record.veterinarian,
            clinic: record.clinic,
            batchNumber: record.batchNumber,
            cost: record.cost,
            notes: record.notes,
            imageUrl: record.imageUrl,
            reminderEnabled: record.reminderEnabled,
            reminderSms: record.reminderSms,
          }),
        });

        if (response.ok) {
          this.markRecordSynced(record.id);
        }
      } catch (error) {
        // Record sync failed silently
      }
    }
  }

  static getOfflineIndicator(): { hasOfflineData: boolean; count: number } {
    const unsyncedRecords = this.getUnsyncedRecords();
    const unsyncedPets = this.getUnsyncedPets();
    const count = unsyncedRecords.length + unsyncedPets.length;
    
    return {
      hasOfflineData: count > 0,
      count,
    };
  }
}