import { tenantDocumentRepository } from "../repositories/tenant-document-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { createAuditLog } from "@/lib/audit";
import { DocumentStatus, DocumentCategory } from "@prisma/client";
import fs from "fs";
import path from "path";

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

  async uploadTenantDocument(userId: string, data: {
    name: string;
    category: DocumentCategory;
    description?: string;
    expiryDate?: string;
    fileData: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    let fileUrl = "";

    // Handle base64 file save to disk (/public/uploads)
    if (data.fileData && data.fileData.startsWith("data:")) {
      const matches = data.fileData.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const base64Data = matches[2];
        const ext = data.fileName.split(".").pop() || "bin";
        const cleanFileName = `tenant-doc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(path.join(uploadDir, cleanFileName), base64Data, "base64");
        fileUrl = `/uploads/${cleanFileName}`;
      }
    }

    if (!fileUrl) {
      throw new Error("Failed to process uploaded file data.");
    }

    const document = await tenantDocumentRepository.createDocument({
      organizationId: tenant.organizationId,
      tenantId: tenant.id,
      name: data.name,
      description: data.description || null,
      category: data.category,
      status: DocumentStatus.AVAILABLE,
      url: fileUrl,
      fileType: data.fileType || null,
      fileSize: data.fileSize || null,
      uploadedById: userId,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    });

    await createAuditLog({
      action: "DOCUMENT_UPLOADED",
      entity: "Document",
      entityId: document.id,
      organizationId: tenant.organizationId,
      userId: userId
    } as any);

    return document;
  }

  async getDocumentDetails(userId: string, documentId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    const tenantId = tenant?.id || "";
    const userEmail = tenant?.email || undefined;

    const document = await tenantDocumentRepository.findById(documentId, tenantId, userEmail, userId);
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
    const tenantId = tenant?.id || "";
    const userEmail = tenant?.email || undefined;

    const document = await tenantDocumentRepository.findById(documentId, tenantId, userEmail, userId);
    if (!document) throw new Error("Document not found");

    await createAuditLog({
      action: "DOCUMENT_DOWNLOADED",
      entity: "Document",
      entityId: document.id,
      organizationId: document.organizationId,
      userId: userId
    } as any);

    return document;
  }

  async logDocumentPrint(userId: string, documentId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    const tenantId = tenant?.id || "";
    const userEmail = tenant?.email || undefined;

    const document = await tenantDocumentRepository.findById(documentId, tenantId, userEmail, userId);
    if (!document) throw new Error("Document not found");

    await createAuditLog({
      action: "DOCUMENT_PRINTED",
      entity: "Document",
      entityId: document.id,
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
