import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths, startOfYear, startOfDay, subDays } from "date-fns";

export class PlatformRepository {
  async getOrganizationStats() {
    const total = await db.organization.count();
    const active = await db.organization.count({ where: { isActive: true } });
    const trial = await db.subscription.count({ where: { status: "TRIAL" } });
    const suspended = await db.organization.count({ where: { isActive: false } });

    return { total, active, trial, suspended };
  }

  async getUserStats() {
    const total = await db.user.count();
    const now = new Date();
    const startOfMTD = startOfMonth(now);

    const activeNow = await db.user.count({
        where: {
            lastLoginAt: { gte: subDays(now, 30) }
        }
    });

    const newSignupsMTD = await db.user.count({
        where: {
            createdAt: { gte: startOfMTD }
        }
    });

    return {
      total,
      activeNow, // This is roughly MAU
      newSignupsMTD
    };
  }

  async getRevenueStats() {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // MRR Calculation (simplified: sum of active subscription plan prices)
    const activeSubscriptions = await db.subscription.findMany({
      where: { status: "ACTIVE" },
      include: { plan: true }
    });

    const mrr = activeSubscriptions.reduce((acc, sub) => {
      const price = Number(sub.plan.price);
      return acc + (sub.plan.interval === "MONTHLY" ? price : price / 12);
    }, 0);

    const arr = mrr * 12;

    const totalOrgs = await db.organization.count({ where: { isActive: true } });
    const arpo = totalOrgs > 0 ? mrr / totalOrgs : 0;

    // Trial Conversion Rate
    const trialsInLast30Days = await db.subscription.count({
        where: {
            status: { in: ["ACTIVE", "TRIAL"] },
            startDate: { gte: subDays(now, 30) },
            trialEndsAt: { not: null }
        }
    });

    const convertedFromTrial = await db.subscription.count({
        where: {
            status: "ACTIVE",
            startDate: { gte: subDays(now, 30) },
            trialEndsAt: { lte: now } // Rough estimate
        }
    });

    const trialConversionRate = trialsInLast30Days > 0 ? (convertedFromTrial / trialsInLast30Days) * 100 : 0;

    return {
      mrr: new Prisma.Decimal(mrr),
      arr: new Prisma.Decimal(arr),
      arpo: new Prisma.Decimal(arpo),
      trialConversionRate
    };
  }

  async getPlatformHealth() {
    // This would typically come from a monitoring service or a dedicated table
    // For now, we'll aggregate from AuditLogs and MpesaTransactions
    const now = new Date();
    const last24h = subDays(now, 1);

    const mpesaSuccess = await db.mpesaTransaction.count({
        where: {
            status: "SUCCESS",
            createdAt: { gte: last24h }
        }
    });

    const mpesaTotal = await db.mpesaTransaction.count({
        where: {
            createdAt: { gte: last24h }
        }
    });

    const mpesaCallbackSuccessRate = mpesaTotal > 0 ? (mpesaSuccess / mpesaTotal) * 100 : 100;

    const criticalSecurityAlerts = await db.securityIncident.count({
        where: {
            severity: "CRITICAL",
            status: "OPEN"
        }
    });

    return {
      mpesaCallbackSuccessRate,
      criticalSecurityAlerts,
      systemStatus: "Operational", // Placeholder
    };
  }

  async getRecentActivities(limit = 10) {
    return db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        organization: { select: { name: true } }
      }
    });
  }

  async getFeatureAdoption() {
    // Aggregated from UsageMetric or entity counts
    const tenantLogins = await db.user.count({ where: { tenantProfile: { isNot: null } } });
    const landlordLogins = await db.user.count({ where: { ownedProperties: { some: {} } } });
    const totalPayments = await db.payment.count();
    const totalMaintenance = await db.ticket.count();

    return {
      tenantPortal: tenantLogins,
      landlordPortal: landlordLogins,
      mpesaPayments: await db.mpesaTransaction.count({ where: { status: "SUCCESS" } }),
      maintenanceRequests: totalMaintenance,
      documents: await db.document.count()
    };
  }

  async getSupportInsights() {
    const openCases = await db.case.count({ where: { status: "OPEN" } });
    const criticalCases = await db.case.count({ where: { severity: "CRITICAL", status: "OPEN" } });

    return {
        openCases,
        criticalCases,
        avgResolutionTime: 2.4 // Mock hours
    };
  }

  async getSecuritySummary() {
    const failedLogins = await db.loginHistory.count({
        where: {
            status: "FAILED",
            createdAt: { gte: subDays(new Date(), 1) }
        }
    });

    const mfaUsers = await db.user.count({ where: { mfaEnabled: true } });
    const totalUsers = await db.user.count();
    const mfaAdoptionRate = totalUsers > 0 ? (mfaUsers / totalUsers) * 100 : 0;

    return {
        failedLogins24h: failedLogins,
        mfaAdoptionRate,
        lockedAccounts: await db.user.count({ where: { status: "LOCKED" } })
    };
  }
}

export const platformRepository = new PlatformRepository();
