"use server";

import { auth } from "@/auth";
import { landlordPropertyService } from "@/features/landlord/services/landlord-property-service";
import { createAuditLog } from "@/lib/audit";

async function getLandlordSession() {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.organizationId) {
    throw new Error("Unauthorized");
  }
  // Ideally check if user has LANDLORD role here
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
  };
}

export async function getLandlordProperties(filters?: { status?: string; search?: string }) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordPropertyService.getLandlordProperties(userId, organizationId, filters);
}

export async function getLandlordProperty(propertyId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordPropertyService.getLandlordProperty(propertyId, userId, organizationId);
}

export async function getPropertyPerformance(propertyId: string, period: "MTD" | "PM" | "YTD" = "MTD") {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordPropertyService.getPropertyPerformance(propertyId, userId, organizationId, period);
}

export async function getPropertyUnits(propertyId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordPropertyService.getPropertyUnits(propertyId, userId, organizationId);
}

export async function getPropertyDocuments(propertyId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordPropertyService.getPropertyDocuments(propertyId, userId, organizationId);
}

export async function getTenancyInsights(propertyId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordPropertyService.getTenancyInsights(propertyId, userId, organizationId);
}

export async function getMaintenanceInsights(propertyId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordPropertyService.getMaintenanceInsights(propertyId, userId, organizationId);
}

export async function trackDocumentDownload(propertyId: string, documentId: string) {
  const { userId, organizationId } = await getLandlordSession();
  await createAuditLog({
    action: "PROPERTY_DOCUMENT_DOWNLOADED",
    entity: "PropertyDocument",
    entityId: documentId,
    organizationId,
    userId,
  } as any);
  return { success: true };
}
