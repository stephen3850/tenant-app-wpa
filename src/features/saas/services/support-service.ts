import { supportRepository } from "../repositories/support-repository";
import { createAuditLog } from "@/lib/audit";

export class SupportService {
  async getDashboard(adminId: string) {
    const stats = await supportRepository.getDashboardStats();

    await createAuditLog({
      action: "SUPPORT_DASHBOARD_VIEWED",
      entity: "Support",
      entityId: "GLOBAL",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return stats;
  }

  async listCases(adminId: string, params: any) {
    const data = await supportRepository.getSupportCases(params);

    await createAuditLog({
      action: "CASES_VIEWED",
      entity: "SupportCase",
      entityId: "GLOBAL",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return data;
  }

  async getCaseDetails(adminId: string, caseId: string) {
    const supportCase = await supportRepository.getCaseById(caseId);
    if (!supportCase) throw new Error("Support case not found");

    await createAuditLog({
      action: "CASE_VIEWED",
      entity: "SupportCase",
      entityId: caseId,
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return supportCase;
  }
}

export const supportService = new SupportService();
