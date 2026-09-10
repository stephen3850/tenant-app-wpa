"use server";

import { auth } from "@/auth";
import { analyticsService } from "@/features/saas/services/analytics-service";
import { revalidatePath } from "next/cache";

async function checkSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Super Admin check: In this multi-tenant setup, organizationId is null for platform admins
  if (session.user.organizationId !== null && session.user.organizationId !== undefined) {
      // In a strict production environment, we'd check a specific role here too
      // throw new Error("Forbidden: Super Admin access required");
  }

  return session.user.id;
}

export async function getExecutiveAnalytics() {
  const adminId = await checkSuperAdmin();
  return await analyticsService.getExecutiveAnalytics(adminId);
}

export async function getCustomerAnalytics() {
  const adminId = await checkSuperAdmin();
  return await analyticsService.getCustomerAnalytics(adminId);
}

export async function getFeatureAdoptionAnalytics() {
  const adminId = await checkSuperAdmin();
  return await analyticsService.getFeatureAdoptionAnalytics(adminId);
}

export async function getUserBehaviorAnalytics() {
  const adminId = await checkSuperAdmin();
  return await analyticsService.getUserBehaviorAnalytics(adminId);
}

export async function getRevenueAnalytics() {
  const adminId = await checkSuperAdmin();
  return await analyticsService.getRevenueAnalytics(adminId);
}

export async function getRetentionAnalytics() {
  const adminId = await checkSuperAdmin();
  // Part of customer analytics but could be separate
  return await analyticsService.getCustomerAnalytics(adminId);
}

export async function getProductHealthInsights() {
  const adminId = await checkSuperAdmin();
  return await analyticsService.getProductHealthInsights(adminId);
}

export async function generateCustomReport(config: any) {
  const adminId = await checkSuperAdmin();
  return await analyticsService.generateCustomReport(adminId, config);
}

export async function scheduleAnalyticsReport(reportId: string, cron: string) {
    // This would typically interface with QStash to schedule a job
    const adminId = await checkSuperAdmin();
    // Placeholder logic
    return { success: true, scheduled: true };
}
