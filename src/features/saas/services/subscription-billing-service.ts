import { subscriptionBillingRepository } from "../repositories/subscription-billing-repository";
import { createAuditLog } from "@/lib/audit";
import { SubscriptionStatus, Prisma } from "@prisma/client";

export class SubscriptionBillingService {
  async getSubscriptionDashboard(adminId: string) {
    const stats = await subscriptionBillingRepository.getDashboardStats();

    await createAuditLog({
      action: "SUBSCRIPTIONS_VIEWED",
      entity: "Platform",
      entityId: "GLOBAL",
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return stats;
  }

  async getSubscriptions(adminId: string, filters: any) {
    return subscriptionBillingRepository.getSubscriptions(filters);
  }

  async getSubscription(id: string, adminId: string) {
    return subscriptionBillingRepository.getSubscriptionById(id);
  }

  async createPlan(adminId: string, data: any) {
    const plan = await subscriptionBillingRepository.createPlan(data);

    await createAuditLog({
      action: "PLAN_CREATED",
      entity: "Plan",
      entityId: plan.id,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: data
    } as any);

    return plan;
  }

  async updatePlan(adminId: string, id: string, data: any) {
    // Prevent modification of historical pricing records if already used
    // For now, just a simple update
    const plan = await subscriptionBillingRepository.updatePlan(id, data);

    await createAuditLog({
      action: "PLAN_UPDATED",
      entity: "Plan",
      entityId: id,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: data
    } as any);

    return plan;
  }

  async upgradeSubscription(adminId: string, subscriptionId: string, newPlanId: string, reason: string) {
    const subscription = await subscriptionBillingRepository.updateSubscription(subscriptionId, {
      planId: newPlanId,
      status: "ACTIVE"
    });

    await createAuditLog({
      action: "SUBSCRIPTION_UPDATED",
      entity: "Subscription",
      entityId: subscriptionId,
      userId: adminId,
      organizationId: subscription.organizationId,
      newData: { planId: newPlanId, reason, type: "UPGRADE" }
    } as any);

    return subscription;
  }

  async downgradeSubscription(adminId: string, subscriptionId: string, newPlanId: string, reason: string) {
    const subscription = await subscriptionBillingRepository.updateSubscription(subscriptionId, {
      planId: newPlanId,
      status: "ACTIVE"
    });

    await createAuditLog({
      action: "SUBSCRIPTION_UPDATED",
      entity: "Subscription",
      entityId: subscriptionId,
      userId: adminId,
      organizationId: subscription.organizationId,
      newData: { planId: newPlanId, reason, type: "DOWNGRADE" }
    } as any);

    return subscription;
  }

  async extendTrial(adminId: string, subscriptionId: string, newTrialEndsAt: Date, reason: string) {
    const subscription = await subscriptionBillingRepository.updateSubscription(subscriptionId, {
      trialEndsAt: newTrialEndsAt,
      status: "TRIAL"
    });

    await createAuditLog({
      action: "TRIAL_EXTENDED",
      entity: "Subscription",
      entityId: subscriptionId,
      userId: adminId,
      organizationId: subscription.organizationId,
      newData: { trialEndsAt: newTrialEndsAt, reason }
    } as any);

    return subscription;
  }

  async cancelSubscription(adminId: string, subscriptionId: string, reason: string) {
    const subscription = await subscriptionBillingRepository.updateSubscription(subscriptionId, {
      status: "CANCELED",
      canceledAt: new Date(),
      cancelAtPeriodEnd: true
    });

    await createAuditLog({
      action: "SUBSCRIPTION_CANCELLED",
      entity: "Subscription",
      entityId: subscriptionId,
      userId: adminId,
      organizationId: subscription.organizationId,
      newData: { reason }
    } as any);

    return subscription;
  }

  async reinstateSubscription(adminId: string, subscriptionId: string, reason: string) {
    const subscription = await subscriptionBillingRepository.updateSubscription(subscriptionId, {
      status: "ACTIVE",
      canceledAt: null,
      cancelAtPeriodEnd: false
    });

    await createAuditLog({
      action: "SUBSCRIPTION_REINSTATED",
      entity: "Subscription",
      entityId: subscriptionId,
      userId: adminId,
      organizationId: subscription.organizationId,
      newData: { reason }
    } as any);

    return subscription;
  }

  async getInvoices(adminId: string, filters: any) {
    return subscriptionBillingRepository.getInvoices(filters);
  }

  async getPayments(adminId: string, filters: any) {
    return subscriptionBillingRepository.getPayments(filters);
  }

  async getRevenueAnalytics(adminId: string) {
    return subscriptionBillingRepository.getRevenueAnalytics();
  }
}

export const subscriptionBillingService = new SubscriptionBillingService();
