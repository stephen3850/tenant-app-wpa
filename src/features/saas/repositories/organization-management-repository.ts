import { db } from "@/lib/db";
import { OrganizationStatus, Prisma } from "@prisma/client";

export class OrganizationManagementRepository {
  async getOrganizations(filters?: {
    search?: string;
    status?: OrganizationStatus;
    plan?: string;
    country?: string;
  }) {
    const where: Prisma.OrganizationWhereInput = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
        { legalName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.plan) {
      where.subscription = {
        plan: {
          name: filters.plan
        }
      };
    }

    if (filters?.country) {
      where.country = filters.country;
    }

    return db.organization.findMany({
      where,
      include: {
        _count: {
          select: {
            users: true,
            properties: true,
            tenants: true,
            leases: true,
          }
        },
        subscription: {
          include: {
            plan: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getOrganizationById(id: string) {
    return db.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            properties: true,
            tenants: true,
            leases: true,
          }
        },
        subscription: {
          include: {
            plan: true
          }
        },
        billingInvoices: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });
  }

  async updateOrganizationStatus(id: string, status: OrganizationStatus, isActive: boolean) {
    return db.organization.update({
      where: { id },
      data: { status, isActive }
    });
  }

  async getOrganizationTimeline(id: string) {
    // In TMS V2, AuditLogs are used for timeline
    return db.auditLog.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      take: 50
    });
  }

  async getUsageAnalytics(id: string) {
    // Aggregating usage metrics
    const [units, tenants, leases, payments] = await Promise.all([
        db.unit.count({ where: { property: { organizationId: id } } }),
        db.tenant.count({ where: { organizationId: id } }),
        db.lease.count({ where: { organizationId: id } }),
        db.payment.count({ where: { organizationId: id } }),
    ]);

    return {
        units,
        tenants,
        leases,
        payments
    };
  }
}

export const organizationManagementRepository = new OrganizationManagementRepository();
