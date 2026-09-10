"use server";

import { auth } from "@/auth";
import { landlordDocumentService } from "@/features/landlord/services/landlord-document-service";
import { revalidatePath } from "next/cache";

async function getLandlordSession() {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.organizationId) {
    throw new Error("Unauthorized");
  }
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
  };
}

export async function getLandlordDocuments(filters?: { propertyId?: string; category?: string; search?: string }) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordDocumentService.getDocuments(userId, organizationId, filters);
}

export async function getLandlordDocument(documentId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordDocumentService.getDocument(documentId, userId, organizationId);
}

export async function downloadLandlordDocument(documentId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordDocumentService.downloadDocument(documentId, userId, organizationId);
}

export async function getDocumentVersions(documentId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordDocumentService.getDocumentVersions(documentId, userId, organizationId);
}

export async function favoriteDocument(documentId: string) {
  const { userId } = await getLandlordSession();
  const result = await landlordDocumentService.toggleFavorite(documentId, userId);
  revalidatePath("/landlord/documents");
  return result;
}

export async function searchLandlordDocuments(search: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordDocumentService.getDocuments(userId, organizationId, { search });
}
