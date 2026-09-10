import { db } from "@/lib/db";
import { Prisma, PlatformSecurityIncidentStatus, PlatformSecurityIncidentSeverity } from "@prisma/client";
import { subDays, startOfDay } from "date-fns";

export class SecurityRepository {
  async getSecurityDashboardStats() {
    const now = new Date();
    const last24h = subDays(now, 1);

    const [
      failedLogins,
      lockedAccounts,
      activeAlerts,
      criticalIncidents,
      impersonationsToday,
      totalUsers,
      mfaUsers
    ] = await Promise.all([
      db.loginHistory.count({ where: { status: "FAILED", createdAt: { gte: last24h } } }),
      db.user.count({ where: { status: "LOCKED" } }),
      db.platformSecurityAlert.count({ where: { status: "PENDING" } }),
      db.platformSecurityIncident.count({ where: { severity: "CRITICAL", status: { not: "CLOSED" } } }),
      db.impersonationSession.count({ where: { startTime: { gte: startOfDay(now) } } }),
      db.user.count(),
      db.user.count({ where: { mfaEnabled: true } })
    ]);

    const mfaAdoptionRate = totalUsers > 0 ? (mfaUsers / totalUsers) * 100 : 0;

    return {
      failedLogins,
      lockedAccounts,
      activeAlerts,
      criticalIncidents,
      impersonationsToday,
      mfaAdoptionRate: parseFloat(mfaAdoptionRate.toFixed(1)),
      suspiciousActivities: activeAlerts + failedLogins / 10 // Rough indicator
    };
  }

  async getAuditLogs(params: {
    search?: string;
    organizationId?: string;
    userId?: string;
    action?: string;
    skip?: number;
    take?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { search, organizationId, userId, action, skip = 0, take = 50, startDate, endDate } = params;

    const where: Prisma.AuditLogWhereInput = {
      AND: [
        organizationId ? { organizationId } : {},
        userId ? { userId } : {},
        action ? { action } : {},
        startDate || endDate ? {
          createdAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          }
        } : {},
        search ? {
          OR: [
            { entity: { contains: search, mode: 'insensitive' } },
            { entityId: { contains: search, mode: 'insensitive' } },
            { action: { contains: search, mode: 'insensitive' } },
          ]
        } : {}
      ]
    };

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          organization: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      db.auditLog.count({ where })
    ]);

    return { logs, total };
  }

  async getSecurityIncidents(params: {
    status?: PlatformSecurityIncidentStatus;
    severity?: PlatformSecurityIncidentSeverity;
    skip?: number;
    take?: number;
  }) {
    const { status, severity, skip = 0, take = 50 } = params;
    const where: Prisma.PlatformSecurityIncidentWhereInput = {
      ...(status ? { status } : {}),
      ...(severity ? { severity } : {})
    };

    const [incidents, total] = await Promise.all([
      db.platformSecurityIncident.findMany({
        where,
        include: {
          investigator: { select: { name: true } },
          targetUser: { select: { name: true, email: true } },
          organization: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      db.platformSecurityIncident.count({ where })
    ]);

    return { incidents, total };
  }

  async getSecurityAlerts(limit = 20) {
    return db.platformSecurityAlert.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: limit
    });
  }

  async createIncident(data: Prisma.PlatformSecurityIncidentCreateInput) {
    return db.platformSecurityIncident.create({ data });
  }

  async updateIncident(id: string, data: Prisma.PlatformSecurityIncidentUpdateInput) {
    return db.platformSecurityIncident.update({
      where: { id },
      data
    });
  }
}

export const securityRepository = new SecurityRepository();
