import { tenantLeaseRepository } from "../repositories/tenant-lease-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { createAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";

export class TenantLeaseService {
  async getActiveLease(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const lease = await tenantLeaseRepository.findActiveByTenantId(tenant.id);
    if (lease) {
      await createAuditLog({
        action: "LEASE_VIEWED",
        entity: "Lease",
        entityId: lease.id,
        organizationId: lease.organizationId,
        userId: userId
      } as any);
    }
    return lease;
  }

  async getLeaseHistory(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    return tenantLeaseRepository.findHistoryByTenantId(tenant.id);
  }

  async getLeaseDetails(userId: string, leaseId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const lease = await tenantLeaseRepository.findById(leaseId, tenant.id);
    if (!lease) throw new Error("Lease not found or access denied");

    return lease;
  }

  async respondToRenewal(userId: string, renewalId: string, response: "ACCEPTED" | "DECLINED", notes?: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const renewal = await tenantLeaseRepository.findRenewalById(renewalId, tenant.id);
    if (!renewal) throw new Error("Renewal offer not found");

    const updated = await tenantLeaseRepository.updateRenewal(renewalId, {
      status: response,
      tenantResponse: response,
      tenantNotes: notes,
      respondedAt: new Date()
    });

    await db.leaseEvent.create({
      data: {
        leaseId: renewal.leaseId,
        type: response === "ACCEPTED" ? "RENEWAL_ACCEPTED" : "RENEWAL_DECLINED",
        description: `Tenant ${response.toLowerCase()} the renewal offer.`
      }
    });

    await createAuditLog({
      action: response === "ACCEPTED" ? "RENEWAL_ACCEPTED" : "RENEWAL_DECLINED",
      entity: "LeaseRenewal",
      entityId: renewalId,
      organizationId: updated.organizationId,
      userId: userId,
      newData: { response, notes }
    } as any);

    return updated;
  }

  async submitRenewalInterest(userId: string, leaseId: string, notes?: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const lease = await tenantLeaseRepository.findById(leaseId, tenant.id);
    if (!lease) throw new Error("Lease not found");

    // Check if there's already a pending renewal
    const existingPending = lease.renewals?.find((r: any) => r.status === "PENDING" || r.status === "REQUESTED");
    if (existingPending) throw new Error("A renewal request or offer is already pending.");

    const renewal = await db.leaseRenewal.create({
      data: {
        leaseId,
        organizationId: lease.organizationId,
        status: "REQUESTED",
        proposedStartDate: lease.endDate ? new Date(lease.endDate) : new Date(),
        proposedRent: lease.monthlyRent,
        tenantNotes: notes,
        respondedAt: new Date(),
        tenantResponse: "INTERESTED"
      }
    });

    await db.leaseEvent.create({
      data: {
        leaseId,
        type: "RENEWAL_INTEREST_SUBMITTED",
        description: `Tenant expressed interest in renewing the lease. Notes: ${notes || "None"}`
      }
    });

    await createAuditLog({
      action: "RENEWAL_INTEREST_SUBMITTED",
      entity: "LeaseRenewal",
      entityId: renewal.id,
      organizationId: lease.organizationId,
      userId: userId,
      newData: { notes }
    } as any);

    return renewal;
  }

  async acknowledgeNotice(userId: string, noticeId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const notice = await tenantLeaseRepository.findNoticeById(noticeId, tenant.id);
    if (!notice) throw new Error("Notice not found");

    const updated = await tenantLeaseRepository.updateNotice(noticeId, {
      acknowledgedAt: new Date()
    });

    await createAuditLog({
      action: "NOTICE_ACKNOWLEDGED",
      entity: "LeaseNotice",
      entityId: noticeId,
      organizationId: updated.organizationId,
      userId: userId
    } as any);

    return updated;
  }

  async logLeaseDownload(userId: string, leaseId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const lease = await tenantLeaseRepository.findById(leaseId, tenant.id);
    if (!lease) throw new Error("Lease not found");

    await createAuditLog({
      action: "LEASE_DOWNLOADED",
      entity: "Lease",
      entityId: leaseId,
      organizationId: lease.organizationId,
      userId: userId
    } as any);

    return lease;
  }
}

export const tenantLeaseService = new TenantLeaseService();
