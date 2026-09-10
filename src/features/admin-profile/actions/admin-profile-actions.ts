"use server";

import { AdminProfileService } from "../services/admin-profile-service";
import { auth } from "@/auth";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const service = new AdminProfileService();

async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getSuperAdminProfile() {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all"); // Super Admin check
  return service.getProfile(user.id);
}

export async function updateSuperAdminProfile(data: any) {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all");

  const result = await service.updateProfile(user.id, data);

  await createAuditLog({
    action: "SUPER_ADMIN_PROFILE_UPDATED",
    entity: "User",
    entityId: user.id,
    newData: data,
    userId: user.id,
    organizationId: "SYSTEM",
  });

  revalidatePath("/admin/settings/profile");
  return result;
}

export async function changeSuperAdminPassword(oldPassword: string, newPassword: string) {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all");

  const result = await service.changePassword(user.id, oldPassword, newPassword);

  await createAuditLog({
    action: "SUPER_ADMIN_PASSWORD_CHANGED",
    entity: "User",
    entityId: user.id,
    userId: user.id,
    organizationId: "SYSTEM",
  });

  return { success: true };
}

export async function updateSuperAdminNotificationPreferences(data: any) {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all");

  const result = await service.updateNotifications(user.id, data);

  await createAuditLog({
    action: "SUPER_ADMIN_NOTIFICATIONS_UPDATED",
    entity: "NotificationPreference",
    entityId: user.id,
    newData: data,
    userId: user.id,
    organizationId: "SYSTEM",
  });

  revalidatePath("/admin/settings/notifications");
  return result;
}

export async function getSuperAdminSessions() {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all");
  return service.getSessions(user.id);
}

export async function revokeSuperAdminSession(sessionToken: string) {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all");

  await service.revokeSession(sessionToken);

  await createAuditLog({
    action: "SUPER_ADMIN_SESSION_REVOKED",
    entity: "Session",
    entityId: sessionToken,
    userId: user.id,
    organizationId: "SYSTEM",
  });

  revalidatePath("/admin/settings/sessions");
  return { success: true };
}

export async function getSuperAdminApiTokens() {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all");
  return service.getApiTokens(user.id);
}

export async function createSuperAdminApiToken(name: string, scopes: string[], expiresAt?: Date) {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all");

  const result = await service.createApiToken(user.id, name, scopes, expiresAt);

  await createAuditLog({
    action: "SUPER_ADMIN_API_TOKEN_CREATED",
    entity: "SuperAdminApiToken",
    entityId: result.id,
    userId: user.id,
    organizationId: "SYSTEM",
  });

  revalidatePath("/admin/settings/tokens");
  return result;
}

export async function revokeSuperAdminApiToken(tokenId: string) {
  const user = await getAuthenticatedUser();
  await checkPermission("manage", "all");

  await service.revokeApiToken(tokenId, user.id);

  await createAuditLog({
    action: "SUPER_ADMIN_API_TOKEN_REVOKED",
    entity: "SuperAdminApiToken",
    entityId: tokenId,
    userId: user.id,
    organizationId: "SYSTEM",
  });

  revalidatePath("/admin/settings/tokens");
  return { success: true };
}
