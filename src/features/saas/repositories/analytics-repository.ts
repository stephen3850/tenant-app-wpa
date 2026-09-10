import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  format
} from "date-fns";

export class AnalyticsRepository {
  /**
   * Executive Analytics - Fetching from rollups for performance
   */
  async getRollupMetrics(metricTypes: string[], period: string, startDate: Date, endDate: Date) {
    return db.platformMetricRollup.findMany({
      where: {
        metricType: { in: metricTypes },
        period,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: "asc" },
    });
  }

  async getLatestRollupValue(metricType: string, period: string) {
    return db.platformMetricRollup.findFirst({
      where: { metricType, period },
      orderBy: { timestamp: "desc" },
    });
  }

  /**
   * Customer Analytics
   */
  async getOrganizationsByPlan() {
    const plans = await db.plan.findMany({
      include: {
        _count: {
          select: { subscriptions: { where: { status: "ACTIVE" } } }
        }
      }
    });
    return plans.map(p => ({
      name: p.name,
      count: p._count.subscriptions
    }));
  }

  async getOrganizationsByCountry() {
    const countries = await db.organization.groupBy({
      by: ['country'],
      _count: { _all: true },
      where: { isActive: true }
    });
    return countries.map(c => ({
      country: c.country || "Unknown",
      count: c._count._all
    }));
  }

  /**
   * Revenue Analytics
   */
  async getRevenueByPlan() {
    const activeSubs = await db.subscription.findMany({
      where: { status: "ACTIVE" },
      include: { plan: true }
    });

    const revenueByPlan = activeSubs.reduce((acc, sub) => {
      const planName = sub.plan.name;
      const amount = Number(sub.plan.price);
      const monthlyAmount = sub.plan.interval === "MONTHLY" ? amount : amount / 12;
      acc[planName] = (acc[planName] || 0) + monthlyAmount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(revenueByPlan).map(([name, amount]) => ({
      name,
      amount: new Prisma.Decimal(amount)
    }));
  }

  /**
   * Feature Adoption Analytics
   */
  async getFeatureUsageStats() {
    // This aggregates counts of key entities across all orgs
    const [
      tenants,
      leases,
      payments,
      tickets,
      messages,
      documents,
      meters,
      cases
    ] = await Promise.all([
      db.tenant.count(),
      db.lease.count({ where: { status: "ACTIVE" } }),
      db.payment.count({ where: { status: "COMPLETED" } }),
      db.ticket.count(),
      db.message.count(),
      db.document.count(),
      db.utilityMeter.count(),
      db.case.count()
    ]);

    const totalOrgs = await db.organization.count({ where: { isActive: true } });

    // Adoption is defined as % of active orgs using the feature
    const orgsUsingMpesa = await db.mpesaCredential.count();
    const orgsWithLeases = await db.lease.groupBy({ by: ['organizationId'] });
    const orgsWithTickets = await db.ticket.groupBy({ by: ['organizationId'] });

    return {
      tenants,
      activeLeases: leases,
      completedPayments: payments,
      maintenanceTickets: tickets,
      communications: messages,
      documents,
      meters,
      legalCases: cases,
      adoptionRates: {
        mpesa: (orgsUsingMpesa / totalOrgs) * 100,
        digitalLeasing: (orgsWithLeases.length / totalOrgs) * 100,
        maintenance: (orgsWithTickets.length / totalOrgs) * 100
      }
    };
  }

  /**
   * User Behavior
   */
  async getLoginFrequency() {
    const now = new Date();
    const last30Days = subDays(now, 30);

    const history = await db.loginHistory.findMany({
      where: {
        createdAt: { gte: last30Days },
        status: "SUCCESS"
      },
      select: { createdAt: true }
    });

    // Group by day
    const grouped = history.reduce((acc, log) => {
      const day = format(log.createdAt, "yyyy-MM-dd");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }

  /**
   * Retention & Churn
   */
  async getChurnData(months = 12) {
    const now = new Date();
    const data = [];

    for (let i = 0; i < months; i++) {
      const targetMonthStart = startOfMonth(subMonths(now, i));
      const targetMonthEnd = endOfMonth(subMonths(now, i));

      const churned = await db.organization.count({
        where: {
          status: "CANCELLED",
          updatedAt: { gte: targetMonthStart, lte: targetMonthEnd }
        }
      });

      const totalAtStart = await db.organization.count({
        where: {
          createdAt: { lte: targetMonthStart },
          OR: [
            { status: { not: "CANCELLED" } },
            { updatedAt: { gte: targetMonthStart } }
          ]
        }
      });

      data.push({
        month: format(targetMonthStart, "MMM yyyy"),
        churnCount: churned,
        churnRate: totalAtStart > 0 ? (churned / totalAtStart) * 100 : 0
      });
    }

    return data.reverse();
  }

  /**
   * Custom Reports
   */
  async getSavedReports() {
    return db.analyticsReport.findMany({
      orderBy: { createdAt: "desc" },
      include: { creator: { select: { name: true } } }
    });
  }

  async saveReport(data: Prisma.AnalyticsReportCreateInput) {
    return db.analyticsReport.create({ data });
  }
}

export const analyticsRepository = new AnalyticsRepository();
