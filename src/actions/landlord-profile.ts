"use server";

import { auth } from "@/auth";
import { landlordProfileService } from "@/features/landlord/services/landlord-profile-service";
import { revalidatePath } from "next/cache";

async function getLandlordSession() {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.organizationId) {
    throw new Error("Unauthorized");
  }
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
  };
}

export async function getLandlordProfile() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordProfileService.getProfile(userId, organizationId);
}

export async function updateLandlordProfile(data: any) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordProfileService.updateProfile(userId, organizationId, data);
  revalidatePath("/landlord/profile");
  return result;
}

export async function changeLandlordPassword(values: any) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordProfileService.changePassword(
    userId,
    organizationId,
    values.currentPassword,
    values.newPassword
  );
  return result;
}

export async function enableLandlordMFA() {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordProfileService.enableMFA(userId, organizationId);
  revalidatePath("/landlord/profile/security");
  return result;
}

export async function disableLandlordMFA() {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordProfileService.disableMFA(userId, organizationId);
  revalidatePath("/landlord/profile/security");
  return result;
}

export async function updateLandlordNotificationPreferences(data: any) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordProfileService.updateNotificationPreferences(userId, organizationId, data);
  revalidatePath("/landlord/profile/notifications");
  return result;
}

export async function updateLandlordCommunicationPreferences(data: any) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordProfileService.updateCommunicationPreferences(userId, organizationId, data);
  revalidatePath("/landlord/profile/preferences");
  return result;
}

export async function uploadLandlordProfilePhoto(photoUrl: string) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordProfileService.uploadProfilePhoto(userId, organizationId, photoUrl);
  revalidatePath("/landlord/profile");
  return result;
}

export async function getLandlordSessions() {
  const { userId } = await getLandlordSession();
  return await landlordProfileService.getSessions(userId);
}

export async function revokeLandlordSession(sessionToken: string) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordProfileService.revokeSession(userId, organizationId, sessionToken);
  revalidatePath("/landlord/profile/sessions");
  return result;
}
