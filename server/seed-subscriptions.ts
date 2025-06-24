
import { db } from "./db";
import { subscriptionPlans } from "@shared/schema";

export async function seedSubscriptionPlans() {
  try {
    // Check if plans already exist
    const existingPlans = await db.select().from(subscriptionPlans);
    if (existingPlans.length > 0) {
      console.log("Subscription plans already exist, skipping seed");
      return;
    }

    // Insert default plans
    await db.insert(subscriptionPlans).values([
      {
        name: "Free",
        price: "0.00",
        storageLimit: 100, // 100 MB
        features: {
          pets: 3,
          records: "unlimited",
          reminders: true,
          qrCodes: true,
        },
      },
      {
        name: "Premium 3GB",
        price: "5.00",
        storageLimit: 3072, // 3 GB in MB
        features: {
          pets: "unlimited",
          records: "unlimited",
          reminders: true,
          qrCodes: true,
          prioritySupport: true,
          advancedAnalytics: true,
        },
      },
      {
        name: "Premium Unlimited",
        price: "10.00",
        storageLimit: null, // Unlimited
        features: {
          pets: "unlimited",
          records: "unlimited",
          reminders: true,
          qrCodes: true,
          prioritySupport: true,
          advancedAnalytics: true,
          unlimited: true,
        },
      },
    ]);

    console.log("Subscription plans seeded successfully");
  } catch (error) {
    console.error("Error seeding subscription plans:", error);
  }
}
