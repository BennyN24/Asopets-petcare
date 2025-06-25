
import { db } from "./db.js";
import { pets, medicalRecords, reminders, users } from "../shared/schema.js";
import { eq, like, inArray } from "drizzle-orm";

async function cleanupTestData() {
  console.log("🧹 Starting cleanup of test and dummy data...");
  
  try {
    // Check database connection first
    console.log("🔍 Checking database connection...");
    const connectionTest = await db.select().from(users).limit(1);
    console.log("✅ Database connection successful");
    
    // 1. Find test users (accounts with test emails)
    console.log("🔍 Looking for test users...");
    const testUsers = await db.select().from(users).where(
      like(users.email, '%testpayload@%')
    );
    
    console.log(`Found ${testUsers.length} test user(s) to clean up`);
    
    if (testUsers.length > 0) {
      const testUserIds = testUsers.map(u => u.id);
      console.log("Test user IDs:", testUserIds);
      
      // 2. Find test pets owned by test users
      console.log("🔍 Looking for test pets...");
      const testPets = await db.select().from(pets).where(
        inArray(pets.userId, testUserIds)
      );
      
      console.log(`Found ${testPets.length} test pet(s) to clean up`);
      
      if (testPets.length > 0) {
        const testPetIds = testPets.map(p => p.id);
        console.log("Test pet IDs:", testPetIds);
        
        // 3. Delete medical records for test pets
        console.log("🗑️ Deleting medical records...");
        const deletedRecords = await db.delete(medicalRecords).where(
          inArray(medicalRecords.petId, testPetIds)
        );
        console.log(`Deleted ${deletedRecords.rowCount || 0} medical record(s)`);
        
        // 4. Delete reminders for test pets
        console.log("🗑️ Deleting reminders...");
        const deletedReminders = await db.delete(reminders).where(
          inArray(reminders.petId, testPetIds)
        );
        console.log(`Deleted ${deletedReminders.rowCount || 0} reminder(s)`);
        
        // 5. Delete test pets
        console.log("🗑️ Deleting test pets...");
        const deletedPets = await db.delete(pets).where(
          inArray(pets.id, testPetIds)
        );
        console.log(`Deleted ${deletedPets.rowCount || 0} pet(s)`);
      }
      
      // 6. Delete test users
      console.log("🗑️ Deleting test users...");
      const deletedUsers = await db.delete(users).where(
        inArray(users.id, testUserIds)
      );
      console.log(`Deleted ${deletedUsers.rowCount || 0} test user(s)`);
    }
    
    // 7. Clean up any pets with test names (Buddy_1, Whiskers_2, etc.)
    console.log("🔍 Looking for pets with test naming patterns...");
    const testNamePets = await db.delete(pets).where(
      like(pets.name, '%\_%')
    );
    console.log(`Deleted ${testNamePets.rowCount || 0} pets with test naming pattern`);
    
    // 8. Clean up medical records with test titles
    console.log("🔍 Looking for medical records with test titles...");
    const testRecords = await db.delete(medicalRecords).where(
      like(medicalRecords.title, '%#%')
    );
    console.log(`Deleted ${testRecords.rowCount || 0} medical records with test titles`);
    
    console.log("✅ Test data cleanup completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during cleanup:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    throw error;
  }
}

// Run cleanup if called directly
if (require.main === module) {
  console.log("🚀 Starting cleanup script...");
  cleanupTestData()
    .then(() => {
      console.log("🎉 Cleanup script finished successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Cleanup script failed:", error.message);
      process.exit(1);
    });
}

export { cleanupTestData };
