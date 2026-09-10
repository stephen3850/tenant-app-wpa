"use server";

import { auth } from "@/auth";
import { landlordTenancyService } from "@/features/landlord/services/landlord-tenancy-service";

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

export async function getLandlordTenancies(filters?: { propertyId?: string; status?: string; search?: string }) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordTenancyService.getLandlordTenancies(userId, organizationId, filters);
}

export async function getLandlordTenancy(leaseId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordTenancyService.getLandlordTenancy(leaseId, userId, organizationId);
}

export async function getLeaseInsights() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordTenancyService.getLeaseInsights(userId, organizationId);
}

export async function getVacancyInsights() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordTenancyService.getVacancyInsights(userId, organizationId);
}

export async function getRenewalInsights() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordTenancyService.getRenewalInsights(userId, organizationId);
}

export async function getPaymentStanding() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordTenancyService.getPaymentStanding(userId, organizationId);
}
