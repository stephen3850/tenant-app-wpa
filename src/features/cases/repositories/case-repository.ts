import { db } from "@/lib/db";
import { Prisma, CaseStatus, CaseSeverity } from "@prisma/client";

export class CaseRepository {
  async findById(id: string, organizationId: string) {
    return db.case.findUnique({
      where: { id, organizationId },
      include: {
        property: true,
        unit: true,
        tenant: true,
        category: true,
        creator: true,
        assignee: true,
        evidence: {
          include: {
            uploadedBy: true
          }
        },
        decisions: {
          include: {
            decidedBy: true
          }
        },
        activities: {
          include: {
            user: true
          },
          orderBy: { createdAt: "desc" }
        }
      },
    });
  }

  async findMany(organizationId: string, filters?: {
    propertyId?: string;
    unitId?: string;
    tenantId?: string;
    status?: CaseStatus;
    severity?: CaseSeverity;
    categoryId?: string;
  }) {
    return db.case.findMany({
      where: {
        organizationId,
        ...(filters?.propertyId && { propertyId: filters.propertyId }),
        ...(filters?.unitId && { unitId: filters.unitId }),
        ...(filters?.tenantId && { tenantId: filters.tenantId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.severity && { severity: filters.severity }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
      },
      include: {
        property: true,
        unit: true,
        tenant: true,
        category: true,
        assignee: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.CaseUncheckedCreateInput) {
    return db.case.create({ data });
  }

  async update(id: string, organizationId: string, data: Prisma.CaseUncheckedUpdateInput) {
    return db.case.update({
      where: { id, organizationId },
      data,
    });
  }

  async createActivity(data: Prisma.CaseActivityUncheckedCreateInput) {
    return db.caseActivity.create({ data });
  }

  async addEvidence(data: Prisma.CaseEvidenceUncheckedCreateInput) {
    return db.caseEvidence.create({ data });
  }

  async recordDecision(data: Prisma.CaseDecisionUncheckedCreateInput) {
    return db.caseDecision.create({ data });
  }

  async getDashboardStats(organizationId: string) {
    const [open, bySeverity, byStatus, escalated] = await Promise.all([
      db.case.count({
        where: { organizationId, status: { notIn: ["RESOLVED", "CLOSED", "ARCHIVED"] } }
      }),
      db.case.groupBy({
        by: ['severity'],
        where: { organizationId, status: { notIn: ["RESOLVED", "CLOSED", "ARCHIVED"] } },
        _count: true
      }),
      db.case.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: true
      }),
      db.case.count({
        where: { organizationId, status: "ESCALATED" }
      })
    ]);

    // Calculate Average Resolution Time (in days) for closed cases in last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const closedCases = await db.case.findMany({
        where: {
            organizationId,
            status: "CLOSED",
            closedAt: { gte: ninetyDaysAgo },
            openedAt: { not: undefined }
        },
        select: { openedAt: true, closedAt: true }
    });

    let avgResolutionTime = 0;
    if (closedCases.length > 0) {
        const totalDuration = closedCases.reduce((acc, c) => {
            if (c.closedAt && c.openedAt) {
                return acc + (c.closedAt.getTime() - c.openedAt.getTime());
            }
            return acc;
        }, 0);
        avgResolutionTime = (totalDuration / closedCases.length) / (1000 * 60 * 60 * 24); // Convert to days
    }

    return {
      openCases: open,
      bySeverity,
      byStatus,
      escalatedCases: escalated,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10
    };
  }
}

export const caseRepository = new CaseRepository();
