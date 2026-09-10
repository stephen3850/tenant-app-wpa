import { platformRepository } from "../repositories/platform-repository";
import { createAuditLog } from "@/lib/audit";

export class PlatformService {
  async getPlatformDashboard(adminId: string) {
    const [orgStats, userStats, revenue, health, activities, adoption, support, security] = await Promise.all([
      platformRepository.getOrganizationStats(),
      platformRepository.getUserStats(),
      platformRepository.getRevenueStats(),
      platformRepository.getPlatformHealth(),
      platformRepository.getRecentActivities(),
      platformRepository.getFeatureAdoption(),
      platformRepository.getSupportInsights(),
      platformRepository.getSecuritySummary()
    ]);

    await createAuditLog({
      action: "SUPER_ADMIN_DASHBOARD_VIEWED",
      entity: "Platform",
      entityId: "GLOBAL",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return {
      orgStats,
      userStats,
      revenue,
      health,
      activities,
      adoption,
      support,
      security
    };
  }

  async getPlatformRevenue(adminId: string) {
    const revenue = await platformRepository.getRevenueStats();

    await createAuditLog({
      action: "REVENUE_DASHBOARD_VIEWED",
      entity: "Platform",
      entityId: "REVENUE",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return revenue;
  }

  async getPlatformHealth(adminId: string) {
    const health = await platformRepository.getPlatformHealth();

    await createAuditLog({
      action: "PLATFORM_HEALTH_VIEWED",
      entity: "Platform",
      entityId: "HEALTH",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return health;
  }

  async getSecuritySummary(adminId: string) {
    const security = await platformRepository.getSecuritySummary();

    await createAuditLog({
      action: "SECURITY_SUMMARY_VIEWED",
      entity: "Platform",
      entityId: "SECURITY",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return security;
  }

  async getSupportInsights(adminId: string) {
    const support = await platformRepository.getSupportInsights();

    await createAuditLog({
      action: "SUPPORT_SUMMARY_VIEWED",
      entity: "Platform",
      entityId: "SUPPORT",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return support;
  }
}

export const platformService = new PlatformService();
