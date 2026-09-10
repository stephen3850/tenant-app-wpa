import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class ImpersonationRepository {
  async createSession(data: {
    impersonatorId: string;
    targetUserId: string;
    organizationId?: string;
    reason: string;
    caseReference?: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return db.impersonationSession.create({
      data: {
        ...data,
        isActive: true,
      },
      include: {
        targetUser: { select: { name: true, email: true } },
      },
    });
  }

  async deactivateSession(sessionId: string) {
    return db.impersonationSession.update({
      where: { id: sessionId },
      data: {
        isActive: false,
        endTime: new Date(),
      },
    });
  }

  async getActiveSession(impersonatorId: string) {
    return db.impersonationSession.findFirst({
      where: {
        impersonatorId,
        isActive: true,
        expiresAt: { gte: new Date() },
      },
      include: {
        targetUser: { select: { id: true, name: true, email: true, organizationId: true } },
      },
    });
  }

  async listSessions(params: { skip?: number; take?: number }) {
    const { skip = 0, take = 50 } = params;
    return db.impersonationSession.findMany({
      include: {
        impersonator: { select: { name: true } },
        targetUser: { select: { name: true } },
      },
      orderBy: { startTime: "desc" },
      skip,
      take,
    });
  }
}

export const impersonationRepository = new ImpersonationRepository();
