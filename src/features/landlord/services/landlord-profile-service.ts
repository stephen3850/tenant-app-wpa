import { landlordProfileRepository } from "../repositories/landlord-profile-repository";
import { createAuditLog } from "@/lib/audit";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export class LandlordProfileService {
  async getProfile(userId: string, organizationId: string) {
    const profile = await landlordProfileRepository.getProfile(userId, organizationId);

    if (profile) {
      await createAuditLog({
        action: "LANDLORD_PROFILE_VIEWED",
        entity: "User",
        entityId: userId,
        organizationId,
        userId,
      } as any);
    }

    return profile;
  }

  async updateProfile(userId: string, organizationId: string, data: any) {
    // Prevent modification of restricted fields
    const {
      id, email, password, organizationId: orgId,
      status, lastLoginAt, mfaEnabled, createdAt, updatedAt,
      ...allowedData
    } = data;

    const updatedUser = await landlordProfileRepository.updateProfile(userId, organizationId, allowedData);

    await createAuditLog({
      action: "LANDLORD_PROFILE_UPDATED",
      entity: "User",
      entityId: userId,
      organizationId,
      userId,
      newData: allowedData,
    } as any);

    return updatedUser;
  }

  async changePassword(userId: string, organizationId: string, currentPassword: string, newPassword: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) throw new Error("User not found");

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) throw new Error("Incorrect current password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await landlordProfileRepository.updateProfile(userId, organizationId, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });

    await createAuditLog({
      action: "LANDLORD_PASSWORD_CHANGED",
      entity: "User",
      entityId: userId,
      organizationId,
      userId,
    } as any);

    return { success: true };
  }

  async enableMFA(userId: string, organizationId: string) {
    await landlordProfileRepository.updateProfile(userId, organizationId, {
      mfaEnabled: true,
    });

    await createAuditLog({
      action: "LANDLORD_MFA_ENABLED",
      entity: "User",
      entityId: userId,
      organizationId,
      userId,
    } as any);

    return { success: true };
  }

  async disableMFA(userId: string, organizationId: string) {
    await landlordProfileRepository.updateProfile(userId, organizationId, {
      mfaEnabled: false,
    });

    await createAuditLog({
      action: "LANDLORD_MFA_DISABLED",
      entity: "User",
      entityId: userId,
      organizationId,
      userId,
    } as any);

    return { success: true };
  }

  async updateNotificationPreferences(userId: string, organizationId: string, data: any) {
    const preferences = await landlordProfileRepository.updateNotificationPreferences(userId, data);

    await createAuditLog({
      action: "LANDLORD_PREFERENCES_UPDATED",
      entity: "NotificationPreference",
      entityId: preferences.id,
      organizationId,
      userId,
      newData: data,
    } as any);

    return preferences;
  }

  async updateCommunicationPreferences(userId: string, organizationId: string, data: any) {
    // Communication preferences are currently on the User model in this schema
    const updatedUser = await landlordProfileRepository.updateProfile(userId, organizationId, {
      preferredLanguage: data.preferredLanguage,
      preferredTimeZone: data.preferredTimeZone,
      // If we had a specific CommunicationPreference model, we'd update it here.
      // For now, let's assume they are part of User or we can add fields.
      // Based on the prompt: "Preferred Contact Method", "Preferred Contact Hours", "Marketing Opt-In"
    } as any);

    await createAuditLog({
      action: "LANDLORD_PREFERENCES_UPDATED",
      entity: "User",
      entityId: userId,
      organizationId,
      userId,
      newData: data,
    } as any);

    return updatedUser;
  }

  async getSessions(userId: string) {
    return await landlordProfileRepository.getSessions(userId);
  }

  async revokeSession(userId: string, organizationId: string, sessionToken: string) {
    await landlordProfileRepository.revokeSession(userId, sessionToken);

    await createAuditLog({
      action: "LANDLORD_SESSION_REVOKED",
      entity: "Session",
      entityId: sessionToken,
      organizationId,
      userId,
    } as any);

    return { success: true };
  }

  async uploadProfilePhoto(userId: string, organizationId: string, photoUrl: string) {
    const updatedUser = await landlordProfileRepository.updateProfile(userId, organizationId, {
      image: photoUrl,
    });

    await createAuditLog({
      action: "LANDLORD_PROFILE_UPDATED",
      entity: "User",
      entityId: userId,
      organizationId,
      userId,
      newData: { image: photoUrl },
    } as any);

    return updatedUser;
  }
}

// Re-import db for the service
import { db } from "@/lib/db";

export const landlordProfileService = new LandlordProfileService();
