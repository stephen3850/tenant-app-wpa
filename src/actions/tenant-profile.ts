"use server";

import { auth } from "@/auth";
import { tenantProfileService } from "@/features/tenant/services/tenant-profile-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getTenantProfile() {
  const user = await getSession();
  return tenantProfileService.getTenantProfile(user.id);
}

export async function updatePersonalInformation(data: any) {
  const user = await getSession();
  const result = await tenantProfileService.updatePersonalInformation(user.id, data);
  revalidatePath("/profile");
  return result;
}

export async function changePassword(currentPass: string, newPass: string) {
  const user = await getSession();
  await tenantProfileService.changePassword(user.id, currentPass, newPass);
  return { success: true };
}

export async function updateNotificationPreferences(data: any) {
  const user = await getSession();
  const result = await tenantProfileService.updateNotificationPreferences(user.id, data);
  revalidatePath("/profile");
  return result;
}

export async function updateCommunicationPreferences(data: any) {
  const user = await getSession();
  const result = await tenantProfileService.updateCommunicationPreferences(user.id, data);
  revalidatePath("/profile");
  return result;
}

export async function uploadProfilePhoto(photoUrl: string) {
  const user = await getSession();
  const result = await tenantProfileService.uploadProfilePhoto(user.id, photoUrl);
  revalidatePath("/profile");
  return result;
}

export async function getActiveSessions() {
  const user = await getSession();
  return tenantProfileService.getActiveSessions(user.id);
}

export async function revokeSession(sessionToken: string) {
  const user = await getSession();
  await tenantProfileService.revokeSession(user.id, sessionToken);
  revalidatePath("/profile");
  return { success: true };
}

export async function toggleMFA(enabled: boolean) {
  const user = await getSession();
  await tenantProfileService.toggleMFA(user.id, enabled);
  revalidatePath("/profile");
  return { success: true };
}
