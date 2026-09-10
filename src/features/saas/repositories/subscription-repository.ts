import { db } from "@/lib/db";
import { Prisma, SubscriptionStatus } from "@prisma/client";

export class SubscriptionRepository {
  async findByOrganizationId(organizationId: string) {
    return db.subscription.findUnique({
      where: { organizationId },
      include: {
        plan: true,
        organization: true,
      },
    });
  }

  async update(organizationId: string, data: Prisma.SubscriptionUpdateInput) {
    return db.subscription.update({
      where: { organizationId },
      data,
    });
  }

  async getUsageMetrics(organizationId: string) {
    return db.usageMetric.findMany({
      where: { organizationId },
      orderBy: { recordedAt: "desc" },
      take: 100,
    });
  }

  async findPlans() {
    return db.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
  }
}

export const subscriptionRepository = new SubscriptionRepository();
