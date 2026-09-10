import { db } from "@/lib/db";
import { auth } from "@/auth";

export class SubscriptionService {
  async getSubscription() {
    const session = await auth();
    const orgId = (session?.user as any).organizationId;

    return db.subscription.findUnique({
      where: { organizationId: orgId }
    });
  }

  async createInitialSubscription(orgId: string, planId: string) {
    return db.subscription.create({
      data: {
        organizationId: orgId,
        planId,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year trial
        status: "ACTIVE",
      }
    });
  }
}

export const subscriptionService = new SubscriptionService();
