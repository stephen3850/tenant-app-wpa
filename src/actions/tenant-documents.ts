"use server";

import { auth } from "@/auth";
import { tenantDocumentService } from "@/features/tenant/services/tenant-document-service";
import { DocumentCategory, DocumentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getTenantDocuments(filters?: {
  category?: DocumentCategory;
  status?: DocumentStatus;
  search?: string;
}) {
  const user = await getSession();
  return tenantDocumentService.getTenantDocuments(user.id, filters);
}

export async function uploadTenantDocument(data: {
  name: string;
  category: DocumentCategory;
  description?: string;
  expiryDate?: string;
  fileData: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}) {
  const user = await getSession();
  const document = await tenantDocumentService.uploadTenantDocument(user.id, data);
  revalidatePath("/portal/documents");
  revalidatePath("/portal/dashboard");
  return document;
}

export async function getDocumentDetails(documentId: string) {
  const user = await getSession();
  return tenantDocumentService.getDocumentDetails(user.id, documentId);
}

export async function logDocumentDownload(documentId: string) {
  const user = await getSession();
  return tenantDocumentService.logDocumentDownload(user.id, documentId);
}

export async function logDocumentPrint(documentId: string) {
  const user = await getSession();
  return tenantDocumentService.logDocumentPrint(user.id, documentId);
}

export async function getDashboardDocuments() {
  const user = await getSession();
  return tenantDocumentService.getDashboardDocuments(user.id);
}
