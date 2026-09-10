import { tenantProfileRepository } from "../repositories/tenant-profile-repository";
import { createAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export class TenantProfileService {
  async getTenantProfile(userId: string) {
    const user = await tenantProfileRepository.getProfile(userId);
    if (!user) throw new Error("User not found");

    await createAuditLog({
      action: "PROFILE_VIEWED",
      entity: "User",
      entityId: userId,
      organizationId: user.organizationId || "SYSTEM",
      userId: userId,
    } as any);

    return user;
  }

  async updatePersonalInformation(userId: string, data: {
    email?: string;
    phone?: string;
    preferredLanguage?: string;
    preferredTimeZone?: string;
    address?: string;
    city?: string;
    county?: string;
    emergencyName?: string;
    emergencyPhone?: string;
  }) {
    const user = await tenantProfileRepository.getProfile(userId);
    if (!user || !user.tenantProfile) throw new Error("Tenant profile not found");

    const userUpdate = {
      email: data.email,
      phone: data.phone,
      preferredLanguage: data.preferredLanguage,
      preferredTimeZone: data.preferredTimeZone,
    };

    const tenantUpdate = {
      email: data.email,
      phone: data.phone,
      postalAddress: data.address,
      city: data.city,
      county: data.county,
      emergencyName: data.emergencyName,
      emergencyPhone: data.emergencyPhone,
    };

    const result = await db.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: userUpdate
      });

      const updatedTenant = await tx.tenant.update({
        where: { id: user.tenantProfile!.id },
        data: tenantUpdate
      });

      return { updatedUser, updatedTenant };
    });

    await createAuditLog({
      action: "PROFILE_UPDATED",
      entity: "User",
      entityId: userId,
      organizationId: user.organizationId || "SYSTEM",
      userId: userId,
      newData: data,
    } as any);

    return result;
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) throw new Error("User not found");

    const passwordsMatch = await bcrypt.compare(currentPass, user.password);
    if (!passwordsMatch) throw new Error("Current password incorrect");

    const hashedPassword = await bcrypt.hash(newPass, 12);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    await createAuditLog({
      action: "PASSWORD_CHANGED",
      entity: "User",
      entityId: userId,
      organizationId: user.organizationId || "SYSTEM",
      userId: userId,
    } as any);
  }

  async updateNotificationPreferences(userId: string, data: any) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const result = await tenantProfileRepository.updateNotificationPreferences(userId, data);

    await createAuditLog({
      action: "PREFERENCES_UPDATED",
      entity: "NotificationPreference",
      entityId: userId,
      organizationId: user.organizationId || "SYSTEM",
      userId: userId,
      newData: data,
    } as any);

    return result;
  }

  async uploadProfilePhoto(userId: string, photoUrl: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenantProfile: true }
    });
    if (!user) throw new Error("User not found");

    const result = await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { image: photoUrl }
      });

      if (user.tenantProfile) {
        await tx.tenant.update({
          where: { id: user.tenantProfile.id },
          data: { profilePhoto: photoUrl }
        });
      }
    });

    await createAuditLog({
      action: "PHOTO_UPDATED",
      entity: "User",
      entityId: userId,
      organizationId: user.organizationId || "SYSTEM",
      userId: userId,
    } as any);

    return result;
  }

  async getActiveSessions(userId: string) {
    return tenantProfileRepository.getActiveSessions(userId);
  }

  async revokeSession(userId: string, sessionToken: string) {
    const session = await db.session.findUnique({ where: { sessionToken } });
    if (!session || session.userId !== userId) throw new Error("Unauthorized");

    await tenantProfileRepository.revokeSession(sessionToken);

    await createAuditLog({
      action: "SESSION_REVOKED",
      entity: "Session",
      entityId: sessionToken,
      organizationId: "SYSTEM",
      userId: userId,
    } as any);
  }

  async updateCommunicationPreferences(userId: string, data: {
    preferredContactMethod: string;
    preferredContactHours: string;
    marketingOptIn: boolean;
  }) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenantProfile: true }
    });
    if (!user || !user.tenantProfile) throw new Error("Tenant profile not found");

    const result = await db.tenant.update({
      where: { id: user.tenantProfile.id },
      data: {
        preferredContactMethod: data.preferredContactMethod,
        preferredContactHours: data.preferredContactHours,
        marketingOptIn: data.marketingOptIn
      }
    });

    await createAuditLog({
      action: "PREFERENCES_UPDATED",
      entity: "Tenant",
      entityId: user.tenantProfile.id,
      organizationId: user.organizationId || "SYSTEM",
      userId: userId,
      newData: data,
    } as any);

    return result;
  }

  async toggleMFA(userId: string, enabled: boolean) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    await db.user.update({
      where: { id: userId },
      data: { mfaEnabled: enabled }
    });

    await createAuditLog({
      action: enabled ? "MFA_ENABLED" : "MFA_DISABLED",
      entity: "User",
      entityId: userId,
      organizationId: user.organizationId || "SYSTEM",
      userId: userId,
    } as any);
  }
}

export const tenantProfileService = new TenantProfileService();
