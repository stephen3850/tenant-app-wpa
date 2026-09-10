import { landlordDashboardRepository } from "../repositories/landlord-dashboard-repository";
import { createAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import { serialize } from "@/lib/utils";

export class LandlordDashboardService {
  async getLandlordDashboard(userId: string, organizationId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    const [
      portfolio,
      financialMTD,
      financialPM,
      financialYTD,
      arrears,
      leases,
      maintenance,
      recent,
      communications
    ] = await Promise.all([
      landlordDashboardRepository.getPortfolioStats(userId, organizationId),
      landlordDashboardRepository.getFinancialStats(userId, organizationId, "MTD"),
      landlordDashboardRepository.getFinancialStats(userId, organizationId, "PM"),
      landlordDashboardRepository.getFinancialStats(userId, organizationId, "YTD"),
      landlordDashboardRepository.getArrears(userId, organizationId),
      landlordDashboardRepository.getLeaseInsights(userId, organizationId),
      landlordDashboardRepository.getMaintenanceStats(userId, organizationId),
      landlordDashboardRepository.getRecentActivities(userId, organizationId),
      landlordDashboardRepository.getCommunicationStats(userId, organizationId)
    ]);

    await createAuditLog({
      action: "LANDLORD_DASHBOARD_VIEWED",
      entity: "Dashboard",
      entityId: userId,
      organizationId,
      userId,
    } as any);

    return serialize({
      landlordName: user?.name || "Landlord",
      portfolio,
      financial: {
        mtd: financialMTD,
        pm: financialPM,
        ytd: financialYTD,
        arrears,
        cashAvailable: financialMTD.revenue.minus(financialMTD.expenses), // Simple calculation
      },
      leases,
      maintenance,
      recent,
      communications
    });
  }

  async getPortfolioSummary(userId: string, organizationId: string) {
    const stats = await landlordDashboardRepository.getPortfolioStats(userId, organizationId);

    await createAuditLog({
      action: "PORTFOLIO_VIEWED",
      entity: "Portfolio",
      entityId: userId,
      organizationId,
      userId,
    } as any);

    return serialize(stats);
  }

  async getFinancialSummary(userId: string, organizationId: string) {
    const [mtd, pm, ytd] = await Promise.all([
      landlordDashboardRepository.getFinancialStats(userId, organizationId, "MTD"),
      landlordDashboardRepository.getFinancialStats(userId, organizationId, "PM"),
      landlordDashboardRepository.getFinancialStats(userId, organizationId, "YTD"),
    ]);

    await createAuditLog({
      action: "FINANCIAL_SUMMARY_VIEWED",
      entity: "Finance",
      entityId: userId,
      organizationId,
      userId,
    } as any);

    return serialize({ mtd, pm, ytd });
  }

  async downloadOwnerStatement(userId: string, organizationId: string) {
     // In a real implementation, this would generate a PDF
     await createAuditLog({
        action: "OWNER_STATEMENT_DOWNLOADED",
        entity: "Report",
        entityId: userId,
        organizationId,
        userId,
     } as any);

     return { success: true, url: "#" };
  }
}

export const landlordDashboardService = new LandlordDashboardService();
