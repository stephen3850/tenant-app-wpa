import { landlordFinancialRepository } from "../repositories/landlord-financial-repository";
import { createAuditLog } from "@/lib/audit";

export class LandlordFinancialService {
  async getFinancialDashboard(userId: string, organizationId: string) {
    const data = await landlordFinancialRepository.getFinancialDashboard(userId, organizationId);

    await createAuditLog({
      action: "FINANCIAL_DASHBOARD_VIEWED",
      entity: "Finance",
      entityId: userId,
    });

    return data;
  }

  async getOwnerStatements(userId: string, organizationId: string) {
    return await landlordFinancialRepository.getOwnerStatements(userId, organizationId);
  }

  async getOwnerStatement(statementId: string, userId: string, organizationId: string) {
    const statement = await landlordFinancialRepository.getOwnerStatement(statementId, userId, organizationId);

    if (statement) {
      await createAuditLog({
        action: "OWNER_STATEMENT_VIEWED",
        entity: "OwnerStatement",
        entityId: statementId,
      });
    }

    return statement;
  }

  async downloadOwnerStatement(statementId: string, userId: string, organizationId: string) {
    const statement = await landlordFinancialRepository.getOwnerStatement(statementId, userId, organizationId);

    if (statement) {
      await createAuditLog({
        action: "OWNER_STATEMENT_DOWNLOADED",
        entity: "OwnerStatement",
        entityId: statementId,
      });
    }

    // In a real app, this would return a pre-signed S3 URL or generate a PDF stream
    return { success: true, url: statement?.documentUrl || "#" };
  }

  async getCashFlowReport(userId: string, organizationId: string) {
    const data = await landlordFinancialRepository.getCashFlow(userId, organizationId);

    await createAuditLog({
      action: "CASHFLOW_REPORT_VIEWED",
      entity: "Finance",
      entityId: userId,
    });

    return data;
  }

  async getRevenueAnalytics(userId: string, organizationId: string) {
    return await landlordFinancialRepository.getRevenueAnalytics(userId, organizationId);
  }

  async getExpenseAnalytics(userId: string, organizationId: string) {
    return await landlordFinancialRepository.getExpenseAnalytics(userId, organizationId);
  }

  async getDisbursementHistory(userId: string, organizationId: string) {
    const data = await landlordFinancialRepository.getDisbursementHistory(userId, organizationId);

    await createAuditLog({
      action: "DISBURSEMENT_HISTORY_VIEWED",
      entity: "Disbursement",
      entityId: userId,
    });

    return data;
  }

  async getArrearsReport(userId: string, organizationId: string) {
    const data = await landlordFinancialRepository.getArrearsReport(userId, organizationId);

    await createAuditLog({
      action: "ARREARS_REPORT_VIEWED",
      entity: "Finance",
      entityId: userId,
    });

    return data;
  }
}

export const landlordFinancialService = new LandlordFinancialService();
