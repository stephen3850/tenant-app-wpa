import { recordsRepository } from "../repositories/records-repository";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";

export class RecordsService {
  async search(userId: string, organizationId: string, query: string) {
    await checkPermission("view", "records" as any);

    const results = await recordsRepository.searchRecords(organizationId, query);

    await recordsRepository.logAccess({
      organizationId,
      userId,
      action: "SEARCH",
      entityType: "GLOBAL",
      entityId: "SEARCH_QUERY",
      details: `Searched for: ${query}`
    });

    return results;
  }

  async getComplianceRecords(userId: string, organizationId: string) {
    await checkPermission("view", "records" as any);
    return recordsRepository.getComplianceRecords(organizationId);
  }

  async createComplianceRecord(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "records" as any);

    const record = await recordsRepository.createComplianceRecord({
      ...data,
      organizationId
    });

    await createAuditLog({
      action: "CREATE",
      entity: "ComplianceRecord",
      entityId: record.id,
      newData: record
    });

    return record;
  }

  async getRetentionPolicies(userId: string, organizationId: string) {
    await checkPermission("retention", "records" as any);
    return recordsRepository.getRetentionPolicies(organizationId);
  }

  async updateRetentionPolicy(userId: string, organizationId: string, entityType: string, periodYears: number) {
    await checkPermission("retention", "records" as any);

    const policy = await recordsRepository.updateRetentionPolicy(organizationId, entityType, periodYears);

    await createAuditLog({
      action: "RETENTION_UPDATE",
      entity: "RetentionPolicy",
      entityId: policy.id,
      newData: { entityType, periodYears }
    });

    return policy;
  }

  async logView(userId: string, organizationId: string, entityType: string, entityId: string) {
    await checkPermission("view", "records" as any);

    return recordsRepository.logAccess({
      organizationId,
      userId,
      action: "VIEW",
      entityType,
      entityId
    });
  }

  async getAccessHistory(userId: string, organizationId: string) {
    await checkPermission("view", "records" as any);
    return recordsRepository.getAccessHistory(organizationId);
  }
}

export const recordsService = new RecordsService();
