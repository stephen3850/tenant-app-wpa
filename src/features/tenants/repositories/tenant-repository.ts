import { db } from "@/lib/db";
import { TenantStatus, Prisma } from "@prisma/client";
import { TenantFilters } from "../schemas/tenant-schema";

export class TenantRepository {
  async findAll(organizationId: string, filters?: TenantFilters) {
    const where: Prisma.TenantWhereInput = {
      organizationId,
    };

    if (filters) {
      if (filters.status) where.status = filters.status;

      if (filters.search) {
        where.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
          { phone: { contains: filters.search, mode: 'insensitive' } },
          { idNumber: { contains: filters.search, mode: 'insensitive' } },
          { tenantCode: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters.propertyId || filters.unitId) {
        where.leases = {
          some: {
            status: 'ACTIVE',
            ...(filters.unitId ? { unitId: filters.unitId } : {}),
            ...(filters.propertyId ? { unit: { propertyId: filters.propertyId } } : {}),
          }
        };
      }

      if (filters.moveInDateStart || filters.moveInDateEnd) {
        where.moveInDate = {
          gte: filters.moveInDateStart,
          lte: filters.moveInDateEnd,
        };
      }
    }

    return db.tenant.findMany({
      where,
      include: {
        leases: {
          where: { status: 'ACTIVE' },
          include: {
            unit: {
              include: {
                property: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string, organizationId: string) {
    return db.tenant.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        leases: {
          include: {
            unit: {
              include: {
                property: true,
              }
            },
            invoices: {
              include: {
                payments: true,
                lineItems: true,
              }
            }
          },
          orderBy: {
            startDate: 'desc',
          }
        },
        tickets: {
          include: {
            property: true,
            unit: true,
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
        documents: true,
        cases: true,
      },
    });
  }

  async create(data: Prisma.TenantCreateInput) {
    return db.tenant.create({
      data,
    });
  }

  async update(id: string, organizationId: string, data: Prisma.TenantUpdateInput) {
    const tenant = await db.tenant.findFirst({
      where: { id, organizationId },
    });

    if (!tenant) throw new Error("Tenant not found or unauthorized");

    return db.tenant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, organizationId: string) {
    const tenant = await db.tenant.findFirst({
      where: { id, organizationId },
    });

    if (!tenant) throw new Error("Tenant not found or unauthorized");

    return db.tenant.delete({
      where: { id },
    });
  }

  async getStats(organizationId: string) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, active, former, blacklisted, newThisMonth] = await Promise.all([
      db.tenant.count({ where: { organizationId } }),
      db.tenant.count({ where: { organizationId, status: TenantStatus.ACTIVE } }),
      db.tenant.count({ where: { organizationId, status: TenantStatus.FORMER } }),
      db.tenant.count({ where: { organizationId, status: TenantStatus.BLACKLISTED } }),
      db.tenant.count({
        where: {
          organizationId,
          createdAt: { gte: firstDayOfMonth }
        }
      }),
    ]);

    return {
      totalTenants: total,
      activeTenants: active,
      formerTenants: former,
      blacklistedTenants: blacklisted,
      newTenantsThisMonth: newThisMonth,
    };
  }
}

export const tenantRepository = new TenantRepository();
