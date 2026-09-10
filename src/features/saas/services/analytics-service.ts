import { analyticsRepository } from "../repositories/analytics-repository";
import { platformRepository } from "../repositories/platform-repository";
import { createAuditLog } from "@/lib/audit";
import { subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Prisma } from "@prisma/client";

export class AnalyticsService {
  async getExecutiveAnalytics(adminId: string) {
    const now = new Date();
    const last30Days = subDays(now, 30);
    const prev30Days = subDays(last30Days, 30);

    // Fetch rollups for MAU, DAU
    const [mau, dau, wau] = await Promise.all([
      analyticsRepository.getLatestRollupValue("MAU", "DAILY"),
      analyticsRepository.getLatestRollupValue("DAU", "DAILY"),
      analyticsRepository.getLatestRollupValue("WAU", "DAILY"),
    ]);

    const dauValue = Number(dau?.value || 0);
    const mauValue = Number(mau?.value || 0);
    const dauMauRatio = mauValue > 0 ? (dauValue / mauValue) * 100 : 0;

    // Comparisons (Mocking MoM for now if rollups are missing)
    const currentOrgs = await platformRepository.getOrganizationStats();

    await createAuditLog({
      action: "PLATFORM_EXECUTIVE_ANALYTICS_VIEWED",
      entity: "Analytics",
      entityId: "EXECUTIVE",
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return {
      kpis: {
        mau: mauValue,
        dau: dauValue,
        wau: Number(wau?.value || 0),
        dauMauRatio,
        activeOrgs: currentOrgs.active,
        trialOrgs: currentOrgs.trial,
      },
      trends: {
        // Here we would fetch time-series data from rollups
      }
    };
  }

  async getCustomerAnalytics(adminId: string) {
    const [byPlan, byCountry, churn] = await Promise.all([
      analyticsRepository.getOrganizationsByPlan(),
      analyticsRepository.getOrganizationsByCountry(),
      analyticsRepository.getChurnData(6)
    ]);

    await createAuditLog({
      action: "PLATFORM_CUSTOMER_ANALYTICS_VIEWED",
      entity: "Analytics",
      entityId: "CUSTOMER",
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return { byPlan, byCountry, churn };
  }

  async getRevenueAnalytics(adminId: string) {
    const revenueStats = await platformRepository.getRevenueStats();
    const byPlan = await analyticsRepository.getRevenueByPlan();

    // LTV Calculation (LTV = ARPA / Churn Rate)
    const churnData = await analyticsRepository.getChurnData(1);
    const churnRate = churnData[0]?.churnRate || 5; // Default 5% if data missing
    const arpo = Number(revenueStats.arpo);
    const ltv = churnRate > 0 ? arpo / (churnRate / 100) : arpo * 24;

    await createAuditLog({
      action: "PLATFORM_REVENUE_ANALYTICS_VIEWED",
      entity: "Analytics",
      entityId: "REVENUE",
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return {
      mrr: revenueStats.mrr,
      arr: revenueStats.arr,
      arpo: revenueStats.arpo,
      ltv: new Prisma.Decimal(ltv),
      byPlan,
      trialConversionRate: revenueStats.trialConversionRate
    };
  }

  async getFeatureAdoptionAnalytics(adminId: string) {
    const stats = await analyticsRepository.getFeatureUsageStats();

    await createAuditLog({
      action: "PLATFORM_FEATURE_ADOPTION_VIEWED",
      entity: "Analytics",
      entityId: "FEATURE",
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return stats;
  }

  async getUserBehaviorAnalytics(adminId: string) {
    const loginFreq = await analyticsRepository.getLoginFrequency();

    await createAuditLog({
      action: "PLATFORM_USER_BEHAVIOR_VIEWED",
      entity: "Analytics",
      entityId: "BEHAVIOR",
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return { loginFreq };
  }

  async getProductHealthInsights(adminId: string) {
    const health = await platformRepository.getPlatformHealth();
    const security = await platformRepository.getSecuritySummary();
    const support = await platformRepository.getSupportInsights();

    await createAuditLog({
      action: "PRODUCT_HEALTH_VIEWED",
      entity: "Analytics",
      entityId: "HEALTH",
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return { health, security, support };
  }

  async generateCustomReport(adminId: string, config: any) {
    // Logic to run a custom query based on config
    // For now, save the report definition
    const report = await analyticsRepository.saveReport({
      name: config.name,
      type: config.type,
      config: config.filters,
      creator: { connect: { id: adminId } }
    });

    await createAuditLog({
      action: "CUSTOM_REPORT_GENERATED",
      entity: "AnalyticsReport",
      entityId: report.id,
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return report;
  }
}

export const analyticsService = new AnalyticsService();
