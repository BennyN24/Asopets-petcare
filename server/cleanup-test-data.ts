
import { db } from "./db";
import { pets, medicalRecords, reminders, users } from "@shared/schema";
import { eq, like, inArray } from "drizzle-orm";

async function cleanupTestData() {
  console.log("🧹 Starting cleanup of test and dummy data...");
  
  try {
    // 1. Find test users (accounts with test emails)
    const testUsers = await db.select().from(users).where(
      like(users.email, '%testpayload@%')
    ).execute();
    
    console.log(`Found ${testUsers.length} test user(s) to clean up`);
    
    if (testUsers.length > 0) {
      const testUserIds = testUsers.map(u => u.id);
      
      // 2. Find test pets owned by test users
      const testPets = await db.select().from(pets).where(
        inArray(pets.userId, testUserIds)
      ).execute();
      
      console.log(`Found ${testPets.length} test pet(s) to clean up`);
      
      if (testPets.length > 0) {
        const testPetIds = testPets.map(p => p.id);
        
        // 3. Delete medical records for test pets
        const deletedRecords = await db.delete(medicalRecords).where(
          inArray(medicalRecords.petId, testPetIds)
        ).execute();
        console.log(`Deleted ${deletedRecords.changes} medical record(s)`);
        
        // 4. Delete reminders for test pets
        const deletedReminders = await db.delete(reminders).where(
          inArray(reminders.petId, testPetIds)
        ).execute();
        console.log(`Deleted ${deletedReminders.changes} reminder(s)`);
        
        // 5. Delete test pets
        const deletedPets = await db.delete(pets).where(
          inArray(pets.id, testPetIds)
        ).execute();
        console.log(`Deleted ${deletedPets.changes} pet(s)`);
      }
      
      // 6. Delete test users
      const deletedUsers = await db.delete(users).where(
        inArray(users.id, testUserIds)
      ).execute();
      console.log(`Deleted ${deletedUsers.changes} test user(s)`);
    }
    
    // 7. Clean up any pets with test names (Buddy_1, Whiskers_2, etc.)
    const testNamePets = await db.delete(pets).where(
      like(pets.name, '%\_%')
    ).execute();
    console.log(`Deleted ${testNamePets.changes} pets with test naming pattern`);
    
    // 8. Clean up medical records with test titles
    const testRecords = await db.delete(medicalRecords).where(
      like(medicalRecords.title, '%#%')
    ).execute();
    console.log(`Deleted ${testRecords.changes} medical records with test titles`);
    
    console.log("✅ Test data cleanup completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanupTestData()
    .then(() => {
      console.log("🎉 Cleanup script finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Cleanup script failed:", error);
      process.exit(1);
    });
}

export { cleanupTestData };
