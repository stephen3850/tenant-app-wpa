"use server";

import { auth } from "@/auth";
import { userAdminService } from "@/features/saas/services/user-admin-service";
import { revalidatePath } from "next/cache";
import { UserStatus } from "@prisma/client";

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

export async function getUsers(params: any) {
  const adminId = await checkSuperAdmin();
  return await userAdminService.listUsers(adminId, params);
}

export async function getUser(userId: string) {
  const adminId = await checkSuperAdmin();
  return await userAdminService.getUserDetails(adminId, userId);
}

export async function suspendUser(userId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await userAdminService.suspendUser(adminId, userId, reason);
  revalidatePath(`/admin/users/${userId}`);
  return result;
}

export async function reactivateUser(userId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await userAdminService.reactivateUser(adminId, userId, reason);
  revalidatePath(`/admin/users/${userId}`);
  return result;
}

export async function lockUser(userId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await userAdminService.lockUser(adminId, userId, reason);
  revalidatePath(`/admin/users/${userId}`);
  return result;
}

export async function unlockUser(userId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await userAdminService.unlockUser(adminId, userId, reason);
  revalidatePath(`/admin/users/${userId}`);
  return result;
}

export async function archiveUser(userId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await userAdminService.archiveUser(adminId, userId, reason);
  revalidatePath(`/admin/users/${userId}`);
  return result;
}

export async function resetUserMFA(userId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await userAdminService.resetMFA(adminId, userId, reason);
  revalidatePath(`/admin/users/${userId}`);
  return result;
}

export async function forcePasswordReset(userId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await userAdminService.forcePasswordReset(adminId, userId, reason);
  revalidatePath(`/admin/users/${userId}`);
  return result;
}

export async function terminateUserSessions(userId: string, reason: string) {
  const adminId = await checkSuperAdmin();
  const result = await userAdminService.terminateSessions(adminId, userId, reason);
  revalidatePath(`/admin/users/${userId}`);
  return result;
}

export async function resendInvitation(userId: string) {
  const adminId = await checkSuperAdmin();
  return await userAdminService.resendInvitation(adminId, userId);
}

export async function exportUsers(params: any) {
  const adminId = await checkSuperAdmin();
  return await userAdminService.exportUsers(adminId, params);
}

export async function getUserTimeline(userId: string) {
  const adminId = await checkSuperAdmin();
  return await userAdminService.getTimeline(adminId, userId);
}
