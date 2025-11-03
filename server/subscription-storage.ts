
import { db } from "./db";
import { subscriptionPlans, userSubscriptions, pets } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getSubscriptionPlans() {
  return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
}

export async function getUserSubscription(userId: string) {
  const subscription = await db
    .select({
      id: userSubscriptions.id,
      status: userSubscriptions.status,
      startDate: userSubscriptions.startDate,
      endDate: userSubscriptions.endDate,
      storageUsed: userSubscriptions.storageUsed,
      plan: {
        id: subscriptionPlans.id,
        name: subscriptionPlans.name,
        price: subscriptionPlans.price,
        storageLimit: subscriptionPlans.storageLimit,
        features: subscriptionPlans.features,
      }
    })
    .from(userSubscriptions)
    .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, "active")
      )
    )
    .orderBy(desc(userSubscriptions.createdAt))
    .limit(1);

  return subscription[0] || null;
}

export async function createUserSubscription(data: {
  userId: string;
  planId: number;
  paymentMethod?: string;
  paymentId?: string;
}) {
  // Cancel existing active subscriptions
  await db
    .update(userSubscriptions)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(
      and(
        eq(userSubscriptions.userId, data.userId),
        eq(userSubscriptions.status, "active")
      )
    );

  // Create new subscription
  const result = await db
    .insert(userSubscriptions)
    .values({
      userId: data.userId,
      planId: data.planId,
      paymentMethod: data.paymentMethod || "manual",
      paymentId: data.paymentId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    })
    .returning();

  return result[0];
}

export async function getStorageUsage(userId: string) {
  // Calculate storage usage from images in medical records and pets
  // This is a simplified calculation - in production, you'd track actual file sizes
  const userPets = await db.query.pets.findMany({
    where: eq(pets.userId, userId),
    with: {
      medicalRecords: true,
    },
  });

  let totalImages = 0;
  userPets.forEach(pet => {
    if (pet.imageUrl) totalImages++;
    pet.medicalRecords.forEach(record => {
      if (record.imageUrl) totalImages++;
      if (record.attachments) totalImages += record.attachments.length;
    });
  });

  // Estimate 2MB per image
  const estimatedUsageMB = totalImages * 2;

  const subscription = await getUserSubscription(userId);
  const storageLimit = subscription?.plan.storageLimit || 100; // Default 100MB for free users

  return {
    used: estimatedUsageMB,
    limit: storageLimit,
    percentage: storageLimit ? Math.round((estimatedUsageMB / storageLimit) * 100) : 0,
    unlimited: !storageLimit,
  };
}
