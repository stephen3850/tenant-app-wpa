import { db } from "@/lib/db";
import { LeaseStatus, Prisma } from "@prisma/client";

export class TenantLeaseRepository {
  async findActiveByTenantId(tenantId: string) {
    return db.lease.findFirst({
      where: {
        tenantId,
        status: { in: [LeaseStatus.ACTIVE, LeaseStatus.EXPIRING] }
      },
      include: {
        unit: {
          include: {
            property: {
              include: {
                utilityBillingRules: {
                  include: { utilityType: true }
                }
              }
            }
          }
        },
        renewals: {
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
          take: 1
        },
        notices: {
          orderBy: { createdAt: "desc" }
        },
        timeline: {
          orderBy: { eventDate: "desc" }
        },
        occupants: true,
        invoices: {
          where: { status: { not: "PAID" } },
          select: { balanceDue: true }
        }
      }
    });
  }

  async findHistoryByTenantId(tenantId: string) {
    return db.lease.findMany({
      where: {
        tenantId,
        status: { in: [LeaseStatus.EXPIRED, LeaseStatus.TERMINATED, LeaseStatus.RENEWED] }
      },
      include: {
        unit: {
          include: {
            property: {
              include: {
                utilityBillingRules: {
                  include: { utilityType: true }
                }
              }
            }
          }
        },
      },
      orderBy: { endDate: "desc" }
    });
  }

  async findById(id: string, tenantId: string) {
    return db.lease.findUnique({
      where: { id, tenantId },
      include: {
        unit: {
          include: {
            property: {
              include: {
                utilityBillingRules: {
                  include: { utilityType: true }
                }
              }
            }
          }
        },
        renewals: true,
        notices: true,
        timeline: {
          orderBy: { eventDate: "desc" }
        },
        occupants: true,
        invoices: {
          where: { status: { not: "PAID" } },
          select: { balanceDue: true }
        }
      }
    });
  }

  async updateRenewal(renewalId: string, data: any) {
    return db.leaseRenewal.update({
      where: { id: renewalId },
      data
    });
  }

  async updateNotice(noticeId: string, data: any) {
    return db.leaseNotice.update({
      where: { id: noticeId },
      data
    });
  }

  async findRenewalById(renewalId: string, tenantId: string) {
    return db.leaseRenewal.findFirst({
      where: {
        id: renewalId,
        lease: { tenantId }
      }
    });
  }

  async findNoticeById(noticeId: string, tenantId: string) {
    return db.leaseNotice.findFirst({
      where: {
        id: noticeId,
        lease: { tenantId }
      }
    });
  }
}

export const tenantLeaseRepository = new TenantLeaseRepository();
