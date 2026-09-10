"use server";

import { auth } from "@/auth";
import { landlordMaintenanceService } from "@/features/landlord/services/landlord-maintenance-service";

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

export async function getMaintenanceDashboard(period: "MTD" | "QTD" | "YTD" = "MTD") {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordMaintenanceService.getMaintenanceDashboard(userId, organizationId, period);
}

export async function getMaintenanceTickets(filters?: any) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordMaintenanceService.getMaintenanceTickets(userId, organizationId, filters);
}

export async function getEmergencyTickets() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordMaintenanceService.getEmergencyTickets(userId, organizationId);
}

export async function getMaintenanceAnalytics(period: "MTD" | "QTD" | "YTD" = "MTD") {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordMaintenanceService.getMaintenanceAnalytics(userId, organizationId, period);
}

export async function getVendorPerformance() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordMaintenanceService.getVendorPerformance(userId, organizationId);
}

export async function searchMaintenanceTickets(search: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordMaintenanceService.getMaintenanceTickets(userId, organizationId, { search });
}
