import { landlordDocumentRepository } from "../repositories/landlord-document-repository";
import { createAuditLog } from "@/lib/audit";

export class LandlordDocumentService {
  async getDocuments(userId: string, organizationId: string, filters?: { propertyId?: string; category?: string; search?: string }) {
    const documents = await landlordDocumentRepository.getDocuments(userId, organizationId, filters);

    await createAuditLog({
      action: "DOCUMENT_VAULT_VIEWED",
      entity: "DocumentVault",
      entityId: userId,
    });

    return documents;
  }

  async getDocument(documentId: string, userId: string, organizationId: string) {
    const document = await landlordDocumentRepository.getDocumentById(documentId, userId, organizationId);

    if (document) {
      await createAuditLog({
        action: "DOCUMENT_VIEWED",
        entity: "PropertyDocument",
        entityId: documentId,
      });
    }

    return document;
  }

  async downloadDocument(documentId: string, userId: string, organizationId: string) {
    const document = await landlordDocumentRepository.getDocumentById(documentId, userId, organizationId);

    if (document) {
      await createAuditLog({
        action: "DOCUMENT_DOWNLOADED",
        entity: "PropertyDocument",
        entityId: documentId,
      });
    }

    return { url: document?.url || "#", name: document?.name };
  }

  async getDocumentVersions(documentId: string, userId: string, organizationId: string) {
    const versions = await landlordDocumentRepository.getDocumentVersions(documentId, userId, organizationId);

    await createAuditLog({
      action: "DOCUMENT_VERSION_VIEWED",
      entity: "PropertyDocument",
      entityId: documentId,
    });

    return versions;
  }

  async toggleFavorite(documentId: string, userId: string) {
    const isFavorite = await landlordDocumentRepository.toggleFavorite(documentId, userId);

    await createAuditLog({
      action: "DOCUMENT_FAVORITED",
      entity: "PropertyDocument",
      entityId: documentId,
      newData: { isFavorite }
    });

    return isFavorite;
  }
}

export const landlordDocumentService = new LandlordDocumentService();
