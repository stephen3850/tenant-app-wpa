import { landlordTenancyRepository } from "../repositories/landlord-tenancy-repository";
import { createAuditLog } from "@/lib/audit";

export class LandlordTenancyService {
  async getLandlordTenancies(userId: string, organizationId: string, filters?: { propertyId?: string; status?: string; search?: string }) {
    const tenancies = await landlordTenancyRepository.getTenancies(userId, organizationId, filters);

    await createAuditLog({
      action: "TENANCIES_VIEWED",
      entity: "Lease",
      entityId: userId,
    });

    return tenancies;
  }

  async getLandlordTenancy(leaseId: string, userId: string, organizationId: string) {
    const tenancy = await landlordTenancyRepository.getTenancyById(leaseId, userId, organizationId);

    if (tenancy) {
      await createAuditLog({
        action: "LEASE_SUMMARY_VIEWED",
        entity: "Lease",
        entityId: leaseId,
      });
    }

    return tenancy;
  }

  async getLeaseInsights(userId: string, organizationId: string) {
    const insights = await landlordTenancyRepository.getLeaseInsights(userId, organizationId);

    // No direct audit log here as it's often part of the dashboard or main view
    return insights;
  }

  async getVacancyInsights(userId: string, organizationId: string) {
    const vacancies = await landlordTenancyRepository.getVacancyInsights(userId, organizationId);

    await createAuditLog({
      action: "VACANCY_REPORT_VIEWED",
      entity: "Unit",
      entityId: userId,
    });

    return vacancies;
  }

  async getRenewalInsights(userId: string, organizationId: string) {
    const renewals = await landlordTenancyRepository.getRenewalInsights(userId, organizationId);

    await createAuditLog({
      action: "RENEWAL_INSIGHTS_VIEWED",
      entity: "LeaseRenewal",
      entityId: userId,
    });

    return renewals;
  }

  async getPaymentStanding(userId: string, organizationId: string) {
    const standing = await landlordTenancyRepository.getPaymentStanding(userId, organizationId);

    await createAuditLog({
      action: "PAYMENT_STANDING_VIEWED",
      entity: "Lease",
      entityId: userId,
    });

    return standing;
  }
}

export const landlordTenancyService = new LandlordTenancyService();
