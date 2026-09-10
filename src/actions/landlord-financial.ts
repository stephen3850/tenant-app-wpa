"use server";

import { auth } from "@/auth";
import { landlordFinancialService } from "@/features/landlord/services/landlord-financial-service";

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

export async function getLandlordFinancialDashboard() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.getFinancialDashboard(userId, organizationId);
}

export async function getOwnerStatements() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.getOwnerStatements(userId, organizationId);
}

export async function getOwnerStatement(statementId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.getOwnerStatement(statementId, userId, organizationId);
}

export async function downloadOwnerStatement(statementId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.downloadOwnerStatement(statementId, userId, organizationId);
}

export async function getCashFlowReport() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.getCashFlowReport(userId, organizationId);
}

export async function getRevenueAnalytics() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.getRevenueAnalytics(userId, organizationId);
}

export async function getExpenseAnalytics() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.getExpenseAnalytics(userId, organizationId);
}

export async function getDisbursementHistory() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.getDisbursementHistory(userId, organizationId);
}

export async function getArrearsReport() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordFinancialService.getArrearsReport(userId, organizationId);
}
