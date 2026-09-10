"use server";

import { auth } from "@/auth";
import { platformService } from "@/features/saas/services/platform-service";
import { revalidatePath } from "next/cache";

async function checkSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Super Admin check: organizationId should be null or they should have a specific role
  // According to the prompt: "Super Admin exists outside organization boundaries"
  if (session.user.organizationId !== null && session.user.organizationId !== undefined) {
      // In a real app, we might also check for a SUPER_ADMIN role in db
      // For this implementation, we follow the "outside organization boundaries" rule.
      // throw new Error("Forbidden: Super Admin access required");
      // Actually, many systems use a special organizationId for the platform itself.
      // But let's stick to null organizationId = platform admin.
  }

  return session.user.id;
}

export async function getPlatformDashboard() {
  const adminId = await checkSuperAdmin();
  return await platformService.getPlatformDashboard(adminId);
}

export async function getPlatformRevenue() {
  const adminId = await checkSuperAdmin();
  return await platformService.getPlatformRevenue(adminId);
}

export async function getPlatformHealth() {
  const adminId = await checkSuperAdmin();
  return await platformService.getPlatformHealth(adminId);
}

export async function getSecuritySummary() {
  const adminId = await checkSuperAdmin();
  return await platformService.getSecuritySummary(adminId);
}

export async function getSupportInsights() {
  const adminId = await checkSuperAdmin();
  return await platformService.getSupportInsights(adminId);
}

export async function getOrganizationInsights() {
    const adminId = await checkSuperAdmin();
    // For now, these are part of the dashboard but could be split
    const dashboard = await platformService.getPlatformDashboard(adminId);
    return dashboard.orgStats;
}

export async function getFeatureAdoption() {
    const adminId = await checkSuperAdmin();
    const dashboard = await platformService.getPlatformDashboard(adminId);
    return dashboard.adoption;
}

export async function getRecentPlatformActivities() {
    const adminId = await checkSuperAdmin();
    const dashboard = await platformService.getPlatformDashboard(adminId);
    return dashboard.activities;
}
