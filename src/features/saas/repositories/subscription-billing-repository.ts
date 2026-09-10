import { db } from "@/lib/db";
import { Prisma, SubscriptionStatus } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";

export class SubscriptionBillingRepository {
  async getDashboardStats() {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);

    const activeSubs = await db.subscription.count({
      where: { status: "ACTIVE" }
    });

    const trialOrgs = await db.subscription.count({
      where: { status: "TRIAL" }
    });

    const expiringTrials = await db.subscription.count({
      where: {
        status: "TRIAL",
        trialEndsAt: {
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Expiring in 7 days
        }
      }
    });

    const failedPayments = await db.billingPayment.count({
      where: { status: "FAILED" }
    });

    // Simple MRR calculation
    const subscriptions = await db.subscription.findMany({
      where: { status: "ACTIVE" },
      include: { plan: true }
    });

    const mrr = subscriptions.reduce((acc, sub) => {
      const price = Number(sub.plan.price);
      return acc + (sub.plan.interval === "MONTHLY" ? price : price / 12);
    }, 0);

    return {
      activeSubscriptions: activeSubs,
      trialOrganizations: trialOrgs,
      expiringTrials,
      failedPayments,
      mrr: new Prisma.Decimal(mrr),
      arr: new Prisma.Decimal(mrr * 12)
    };
  }

  async getSubscriptions(params: {
    status?: SubscriptionStatus;
    planId?: string;
    organizationId?: string;
    skip?: number;
    take?: number;
  }) {
    return db.subscription.findMany({
      where: {
        status: params.status,
        planId: params.planId,
        organizationId: params.organizationId
      },
      include: {
        organization: {
          select: { name: true }
        },
        plan: true
      },
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take
    });
  }

  async getSubscriptionById(id: string) {
    return db.subscription.findUnique({
      where: { id },
      include: {
        organization: true,
        plan: true
      }
    });
  }

  async createPlan(data: Prisma.PlanCreateInput) {
    return db.plan.create({ data });
  }

  async updatePlan(id: string, data: Prisma.PlanUpdateInput) {
    return db.plan.update({
      where: { id },
      data
    });
  }

  async getPlans() {
    return db.plan.findMany({
      where: { isRetired: false },
      orderBy: { price: "asc" }
    });
  }

  async updateSubscription(id: string, data: Prisma.SubscriptionUpdateInput) {
    return db.subscription.update({
      where: { id },
      data,
      include: { plan: true }
    });
  }

  async getInvoices(params: {
    status?: string;
    organizationId?: string;
    skip?: number;
    take?: number;
  }) {
    return db.billingInvoice.findMany({
      where: {
        status: params.status,
        organizationId: params.organizationId
      },
      include: {
        organization: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take
    });
  }

  async getPayments(params: {
    status?: string;
    organizationId?: string;
    skip?: number;
    take?: number;
  }) {
    return db.billingPayment.findMany({
      where: {
        status: params.status,
        organizationId: params.organizationId
      },
      include: {
        organization: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take
    });
  }

  async getRevenueAnalytics() {
    const revenueByPlan = await db.subscription.groupBy({
      by: ["planId"],
      where: { status: "ACTIVE" },
      _count: { _all: true }
    });

    // This is a simplified version of revenue analytics
    return {
      revenueByPlan
    };
  }
}

export const subscriptionBillingRepository = new SubscriptionBillingRepository();
