import { db } from "@/lib/db";
import { Prisma, UserStatus } from "@prisma/client";

export class UserAdminRepository {
  async getUsers(params: {
    search?: string;
    organizationId?: string;
    status?: UserStatus;
    skip?: number;
    take?: number;
  }) {
    const { search, organizationId, status, skip = 0, take = 50 } = params;

    const where: Prisma.UserWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { id: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        organizationId ? { organizationId } : {},
        status ? { status } : {},
      ],
    };

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          organization: { select: { name: true } },
          userRoles: { include: { role: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.user.count({ where }),
    ]);

    return { users, total };
  }

  async getUserById(id: string) {
    return db.user.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true } },
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        sessions: {
          orderBy: { lastActiveAt: "desc" },
          take: 5
        },
        loginHistory: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      },
    });
  }

  async updateUserStatus(id: string, status: UserStatus) {
    return db.user.update({
      where: { id },
      data: { status },
    });
  }

  async resetMFA(id: string) {
    return db.user.update({
      where: { id },
      data: { mfaEnabled: false },
    });
  }

  async terminateSessions(userId: string) {
    return db.session.deleteMany({
      where: { userId },
    });
  }

  async getUserTimeline(userId: string) {
    return db.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async getRecentSecurityEvents(userId: string) {
    return db.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20
    });
  }
}

export const userAdminRepository = new UserAdminRepository();
