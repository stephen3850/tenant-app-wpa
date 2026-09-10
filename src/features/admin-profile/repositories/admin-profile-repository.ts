import { systemDb } from "@/lib/tenant-db";
import { Prisma } from "@prisma/client";

export class AdminProfileRepository {
  async getProfile(userId: string) {
    return systemDb.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        notificationPreferences: true,
      },
    });
  }

  async updateProfile(userId: string, data: Prisma.UserUpdateInput) {
    return systemDb.user.update({
      where: { id: userId },
      data,
    });
  }

  async getSessions(userId: string) {
    return systemDb.session.findMany({
      where: { userId },
      orderBy: { lastActiveAt: "desc" },
    });
  }

  async revokeSession(sessionToken: string) {
    return systemDb.session.delete({
      where: { sessionToken },
    });
  }

  async revokeAllOtherSessions(userId: string, currentSessionToken: string) {
    return systemDb.session.deleteMany({
      where: {
        userId,
        NOT: {
          sessionToken: currentSessionToken,
        },
      },
    });
  }

  async getLoginHistory(userId: string) {
    return systemDb.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  async getApiTokens(userId: string) {
    return systemDb.superAdminApiToken.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createApiToken(data: Prisma.SuperAdminApiTokenCreateInput) {
    return systemDb.superAdminApiToken.create({
      data,
    });
  }

  async revokeApiToken(tokenId: string, userId: string) {
    return systemDb.superAdminApiToken.delete({
      where: { id: tokenId, userId },
    });
  }

  async updateNotificationPreferences(userId: string, data: Prisma.NotificationPreferenceUpdateInput) {
    return systemDb.notificationPreference.upsert({
      where: { userId },
      create: {
        ...data as any,
        userId,
      },
      update: data,
    });
  }
}
