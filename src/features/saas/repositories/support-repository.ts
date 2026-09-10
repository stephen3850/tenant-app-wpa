import { db } from "@/lib/db";
import { Prisma, SupportCaseStatus, SupportCasePriority } from "@prisma/client";

export class SupportRepository {
  async getDashboardStats() {
    const [openCases, escalatedCases, activeSessions] = await Promise.all([
      db.supportCase.count({ where: { status: "OPEN" } }),
      db.supportCase.count({ where: { status: "ESCALATED" } }),
      db.impersonationSession.count({ where: { isActive: true } }),
    ]);

    // Simplified ART calculation
    const resolvedCases = await db.supportCase.findMany({
      where: { status: "RESOLVED", resolvedAt: { not: null } },
      take: 100,
    });

    let avgResolutionTime = 0;
    if (resolvedCases.length > 0) {
      const totalTime = resolvedCases.reduce((acc, c) => {
        return acc + (c.resolvedAt!.getTime() - c.createdAt.getTime());
      }, 0);
      avgResolutionTime = totalTime / resolvedCases.length / (1000 * 60 * 60); // Hours
    }

    return {
      openCases,
      escalatedCases,
      activeSessions,
      avgResolutionTime: parseFloat(avgResolutionTime.toFixed(1)),
      customerSatisfaction: 4.8, // Mock
    };
  }

  async getSupportCases(params: {
    search?: string;
    organizationId?: string;
    status?: SupportCaseStatus;
    priority?: SupportCasePriority;
    skip?: number;
    take?: number;
  }) {
    const { search, organizationId, status, priority, skip = 0, take = 50 } = params;

    const where: Prisma.SupportCaseWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { subject: { contains: search, mode: "insensitive" } },
                { caseNumber: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        organizationId ? { organizationId } : {},
        status ? { status } : {},
        priority ? { priority } : {},
      ],
    };

    const [cases, total] = await Promise.all([
      db.supportCase.findMany({
        where,
        include: {
          organization: { select: { name: true } },
          requester: { select: { name: true, email: true } },
          agent: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.supportCase.count({ where }),
    ]);

    return { cases, total };
  }

  async getCaseById(id: string) {
    return db.supportCase.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true, email: true, phone: true } },
        agent: { select: { id: true, name: true } },
      },
    });
  }
}

export const supportRepository = new SupportRepository();
