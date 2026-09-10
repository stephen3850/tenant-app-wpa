import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class LandlordProfileRepository {
  async getProfile(userId: string, organizationId: string) {
    return db.user.findFirst({
      where: {
        id: userId,
        organizationId,
      },
      include: {
        notificationPreferences: true,
        consentRecords: {
          orderBy: { acceptedAt: "desc" },
        },
        _count: {
          select: { ownedProperties: true }
        }
      },
    });
  }

  async updateProfile(userId: string, organizationId: string, data: Prisma.UserUpdateInput) {
    return db.user.update({
      where: {
        id: userId,
        // Ensure isolation
        organizationId,
      },
      data,
    });
  }

  async updateNotificationPreferences(userId: string, data: Prisma.NotificationPreferenceUpdateInput) {
    return db.notificationPreference.upsert({
      where: { userId },
      create: {
        ...data as any,
        userId,
      },
      update: data,
    });
  }

  async getSessions(userId: string) {
    return db.session.findMany({
      where: { userId },
      orderBy: { lastActiveAt: "desc" },
    });
  }

  async revokeSession(userId: string, sessionToken: string) {
    return db.session.delete({
      where: {
        userId,
        sessionToken,
      },
    });
  }

  async revokeAllOtherSessions(userId: string, currentSessionToken: string) {
    return db.session.deleteMany({
      where: {
        userId,
        NOT: {
          sessionToken: currentSessionToken,
        },
      },
    });
  }

  async getLoginHistory(userId: string, limit = 10) {
    return db.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async addConsentRecord(userId: string, type: string, version: string, ipAddress?: string, userAgent?: string) {
    return db.consentRecord.create({
      data: {
        userId,
        type,
        version,
        ipAddress,
        userAgent,
      },
    });
  }
}

export const landlordProfileRepository = new LandlordProfileRepository();
