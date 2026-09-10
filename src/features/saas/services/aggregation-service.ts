import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { platformRepository } from "../repositories/platform-repository";

export class AggregationService {
  /**
   * Run daily aggregation for platform metrics
   */
  async runDailyRollup() {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    // 1. Calculate DAU
    const dau = await db.user.count({
      where: {
        lastLoginAt: { gte: today }
      }
    });

    // 2. Calculate WAU
    const wau = await db.user.count({
      where: {
        lastLoginAt: { gte: subDays(today, 7) }
      }
    });

    // 3. Calculate MAU
    const mau = await db.user.count({
      where: {
        lastLoginAt: { gte: subDays(today, 30) }
      }
    });

    // 4. Calculate MRR
    const revenue = await platformRepository.getRevenueStats();

    const metrics = [
      { type: "DAU", value: dau },
      { type: "WAU", value: wau },
      { type: "MAU", value: mau },
      { type: "MRR", value: Number(revenue.mrr) },
      { type: "ARR", value: Number(revenue.arr) },
    ];

    for (const metric of metrics) {
      await db.platformMetricRollup.upsert({
        where: {
          metricType_period_timestamp: {
            metricType: metric.type,
            period: "DAILY",
            timestamp: today,
          }
        },
        update: { value: new Prisma.Decimal(metric.value) },
        create: {
          metricType: metric.type,
          period: "DAILY",
          timestamp: today,
          value: new Prisma.Decimal(metric.value),
        }
      });
    }

    return { success: true, metrics };
  }

  /**
   * Aggregates usage metrics per organization
   */
  async runOrganizationUsageRollup() {
      const orgs = await db.organization.findMany({ where: { isActive: true } });
      const today = startOfDay(new Date());

      for (const org of orgs) {
          // Count active units
          const activeUnits = await db.unit.count({
              where: { organizationId: org.id, status: "ACTIVE" }
          });

          await db.usageMetric.create({
              data: {
                  organizationId: org.id,
                  metricType: "ACTIVE_UNITS",
                  value: activeUnits,
                  recordedAt: today
              }
          });
      }
  }
}

export const aggregationService = new AggregationService();
