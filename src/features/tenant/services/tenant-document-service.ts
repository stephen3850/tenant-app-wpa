import { tenantDocumentRepository } from "../repositories/tenant-document-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { createAuditLog } from "@/lib/audit";
import { DocumentStatus, DocumentCategory } from "@prisma/client";

export class TenantDocumentService {
  async getTenantDocuments(userId: string, filters?: {
    category?: DocumentCategory;
    status?: DocumentStatus;
    search?: string;
  }) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    return tenantDocumentRepository.findAllByTenantId(tenant.id, filters);
  }

  async getDocumentDetails(userId: string, documentId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const document = await tenantDocumentRepository.findById(documentId, tenant.id);
    if (!document) throw new Error("Document not found or access denied");

    await createAuditLog({
      action: "DOCUMENT_VIEWED",
      entity: "Document",
      entityId: document.id,
      organizationId: document.organizationId,
      userId: userId
    } as any);

    return document;
  }

  async logDocumentDownload(userId: string, documentId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const document = await tenantDocumentRepository.findById(documentId, tenant.id);
    if (!document) throw new Error("Document not found");

    await createAuditLog({
      action: "DOCUMENT_DOWNLOADED",
      entity: "Document",
      entityId: documentId,
      organizationId: document.organizationId,
      userId: userId
    } as any);

    return document;
  }

  async logDocumentPrint(userId: string, documentId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const document = await tenantDocumentRepository.findById(documentId, tenant.id);
    if (!document) throw new Error("Document not found");

    await createAuditLog({
      action: "DOCUMENT_PRINTED",
      entity: "Document",
      entityId: documentId,
      organizationId: document.organizationId,
      userId: userId
    } as any);

    return document;
  }

  async getDashboardDocuments(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const [recent, expiring] = await Promise.all([
      tenantDocumentRepository.getRecentDocuments(tenant.id),
      tenantDocumentRepository.getExpiringDocuments(tenant.id)
    ]);

    return { recent, expiring };
  }
}

export const tenantDocumentService = new TenantDocumentService();
