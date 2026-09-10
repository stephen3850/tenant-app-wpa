"use server";

import { auth } from "@/auth";
import { organizationManagementService } from "@/features/saas/services/organization-management-service";
import { revalidatePath } from "next/cache";
import { OrganizationStatus } from "@prisma/client";

async function checkSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  // Simplified check for demonstration.
  // In production, verify if user has SUPER_ADMIN role or if organizationId is null.
  return session.user.id;
}

export async function getOrganizations(filters?: any) {
  const adminId = await checkSuperAdmin();
  return await organizationManagementService.getOrganizations(adminId, filters);
}

export async function getOrganization(id: string) {
  const adminId = await checkSuperAdmin();
  return await organizationManagementService.getOrganization(id, adminId);
}

export async function suspendOrganization(id: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await organizationManagementService.suspendOrganization(id, adminId, reason);
  revalidatePath("/admin/organizations");
  revalidatePath(`/admin/organizations/${id}`);
  return result;
}

export async function activateOrganization(id: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await organizationManagementService.activateOrganization(id, adminId, reason);
  revalidatePath("/admin/organizations");
  revalidatePath(`/admin/organizations/${id}`);
  return result;
}

export async function archiveOrganization(id: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await organizationManagementService.archiveOrganization(id, adminId, reason);
  revalidatePath("/admin/organizations");
  revalidatePath(`/admin/organizations/${id}`);
  return result;
}

export async function getOrganizationTimeline(id: string) {
  await checkSuperAdmin();
  return await organizationManagementService.getOrganizationTimeline(id);
}

export async function getCustomerSuccessInsights(id: string) {
  await checkSuperAdmin();
  return await organizationManagementService.getCustomerSuccessInsights(id);
}
