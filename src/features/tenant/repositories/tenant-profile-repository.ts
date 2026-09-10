import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class TenantProfileRepository {
  async getProfile(userId: string) {
    return db.user.findUnique({
      where: { id: userId },
      include: {
        tenantProfile: true,
        notificationPreferences: true,
        consentRecords: {
          orderBy: { acceptedAt: "desc" }
        },
        loginHistory: {
          take: 10,
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }

  async updateProfile(userId: string, data: Prisma.UserUpdateInput) {
    return db.user.update({
      where: { id: userId },
      data
    });
  }

  async updateTenantProfile(tenantId: string, data: Prisma.TenantUpdateInput) {
    return db.tenant.update({
      where: { id: tenantId },
      data
    });
  }

  async updateNotificationPreferences(userId: string, data: Prisma.NotificationPreferenceUpdateInput) {
    return db.notificationPreference.upsert({
      where: { userId },
      create: {
        ...data as any,
        userId
      },
      update: data
    });
  }

  async getActiveSessions(userId: string) {
    return db.session.findMany({
      where: {
        userId,
        expires: { gt: new Date() }
      },
      orderBy: { lastActiveAt: "desc" }
    });
  }

  async revokeSession(sessionToken: string) {
    return db.session.delete({
      where: { sessionToken }
    });
  }

  async revokeAllOtherSessions(userId: string, currentSessionToken: string) {
    return db.session.deleteMany({
      where: {
        userId,
        sessionToken: { not: currentSessionToken }
      }
    });
  }

  async addConsentRecord(userId: string, data: { type: string, version: string, ipAddress?: string, userAgent?: string }) {
    return db.consentRecord.create({
      data: {
        ...data,
        userId
      }
    });
  }
}

export const tenantProfileRepository = new TenantProfileRepository();
