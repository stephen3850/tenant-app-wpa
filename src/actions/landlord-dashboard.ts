"use server";

import { auth } from "@/auth";
import { landlordDashboardService } from "@/features/landlord/services/landlord-dashboard-service";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getLandlordDashboard() {
  const user = await getSession();
  // Role check: Only landlords or managers with landlord access
  // For now, assume if they have owned properties, they are landlords
  return landlordDashboardService.getLandlordDashboard(user.id, user.organizationId);
}

export async function getPortfolioSummary() {
  const user = await getSession();
  return landlordDashboardService.getPortfolioSummary(user.id, user.organizationId);
}

export async function getFinancialSummary() {
  const user = await getSession();
  return landlordDashboardService.getFinancialSummary(user.id, user.organizationId);
}

export async function downloadOwnerStatement() {
  const user = await getSession();
  return landlordDashboardService.downloadOwnerStatement(user.id, user.organizationId);
}
