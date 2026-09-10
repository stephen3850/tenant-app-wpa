import { organizationManagementRepository } from "../repositories/organization-management-repository";
import { createAuditLog } from "@/lib/audit";
import { OrganizationStatus } from "@prisma/client";

export class OrganizationManagementService {
  async getOrganizations(adminId: string, filters?: any) {
    const orgs = await organizationManagementRepository.getOrganizations(filters);

    await createAuditLog({
      action: "ORGANIZATIONS_VIEWED",
      entity: "Platform",
      entityId: "GLOBAL",
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return orgs;
  }

  async getOrganization(id: string, adminId: string) {
    const org = await organizationManagementRepository.getOrganizationById(id);

    await createAuditLog({
      action: "ORGANIZATION_VIEWED",
      entity: "Organization",
      entityId: id,
      userId: adminId,
      organizationId: "SYSTEM",
    } as any);

    return org;
  }

  async suspendOrganization(id: string, adminId: string, reason: string) {
    const org = await organizationManagementRepository.updateOrganizationStatus(
      id,
      OrganizationStatus.SUSPENDED,
      false
    );

    await createAuditLog({
      action: "ORGANIZATION_SUSPENDED",
      entity: "Organization",
      entityId: id,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { status: OrganizationStatus.SUSPENDED, reason }
    } as any);

    return org;
  }

  async activateOrganization(id: string, adminId: string, reason: string) {
    const org = await organizationManagementRepository.updateOrganizationStatus(
      id,
      OrganizationStatus.ACTIVE,
      true
    );

    await createAuditLog({
      action: "ORGANIZATION_ACTIVATED",
      entity: "Organization",
      entityId: id,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { status: OrganizationStatus.ACTIVE, reason }
    } as any);

    return org;
  }

  async reactivateOrganization(id: string, adminId: string, reason: string) {
    // Similar to activate but maybe with specific reactivation logic if needed
    return this.activateOrganization(id, adminId, reason);
  }

  async archiveOrganization(id: string, adminId: string, reason: string) {
    const org = await organizationManagementRepository.updateOrganizationStatus(
      id,
      OrganizationStatus.ARCHIVED,
      false
    );

    await createAuditLog({
      action: "ORGANIZATION_ARCHIVED",
      entity: "Organization",
      entityId: id,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { status: OrganizationStatus.ARCHIVED, reason }
    } as any);

    return org;
  }

  async getOrganizationTimeline(id: string) {
    return organizationManagementRepository.getOrganizationTimeline(id);
  }

  async getCustomerSuccessInsights(id: string) {
    const usage = await organizationManagementRepository.getUsageAnalytics(id);
    const org = await organizationManagementRepository.getOrganizationById(id);

    // Simplified health score logic
    let churnRisk: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (org?.healthScore && org.healthScore < 40) churnRisk = "HIGH";
    else if (org?.healthScore && org.healthScore < 70) churnRisk = "MEDIUM";

    return {
      healthScore: org?.healthScore || 100,
      productAdoptionScore: 85, // Mock score
      churnRisk,
      usage
    };
  }
}

export const organizationManagementService = new OrganizationManagementService();
