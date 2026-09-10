"use server";

import { auth } from "@/auth";
import { subscriptionBillingService } from "@/features/saas/services/subscription-billing-service";
import { revalidatePath } from "next/cache";

async function checkSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  // In a real app, check for SUPER_ADMIN role
  return session.user.id;
}

export async function getSubscriptionDashboard() {
  const adminId = await checkSuperAdmin();
  return await subscriptionBillingService.getSubscriptionDashboard(adminId);
}

export async function getSubscriptions(filters: any) {
  const adminId = await checkSuperAdmin();
  return await subscriptionBillingService.getSubscriptions(adminId, filters);
}

export async function getSubscription(id: string) {
  const adminId = await checkSuperAdmin();
  return await subscriptionBillingService.getSubscription(id, adminId);
}

export async function createSubscriptionPlan(data: any) {
  const adminId = await checkSuperAdmin();
  const plan = await subscriptionBillingService.createPlan(adminId, data);
  revalidatePath("/admin/billing/plans");
  return plan;
}

export async function updateSubscriptionPlan(id: string, data: any) {
  const adminId = await checkSuperAdmin();
  const plan = await subscriptionBillingService.updatePlan(adminId, id, data);
  revalidatePath("/admin/billing/plans");
  return plan;
}

export async function upgradeSubscription(subscriptionId: string, newPlanId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await subscriptionBillingService.upgradeSubscription(adminId, subscriptionId, newPlanId, reason);
  revalidatePath("/admin/billing/subscriptions");
  return result;
}

export async function downgradeSubscription(subscriptionId: string, newPlanId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await subscriptionBillingService.downgradeSubscription(adminId, subscriptionId, newPlanId, reason);
  revalidatePath("/admin/billing/subscriptions");
  return result;
}

export async function extendTrial(subscriptionId: string, newTrialEndsAt: Date, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await subscriptionBillingService.extendTrial(adminId, subscriptionId, newTrialEndsAt, reason);
  revalidatePath("/admin/billing/subscriptions");
  return result;
}

export async function cancelSubscription(subscriptionId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await subscriptionBillingService.cancelSubscription(adminId, subscriptionId, reason);
  revalidatePath("/admin/billing/subscriptions");
  return result;
}

export async function reinstateSubscription(subscriptionId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await subscriptionBillingService.reinstateSubscription(adminId, subscriptionId, reason);
  revalidatePath("/admin/billing/subscriptions");
  return result;
}

export async function getInvoices(filters: any) {
  const adminId = await checkSuperAdmin();
  return await subscriptionBillingService.getInvoices(adminId, filters);
}

export async function getPayments(filters: any) {
  const adminId = await checkSuperAdmin();
  return await subscriptionBillingService.getPayments(adminId, filters);
}

export async function getRevenueAnalytics() {
  const adminId = await checkSuperAdmin();
  return await subscriptionBillingService.getRevenueAnalytics(adminId);
}
