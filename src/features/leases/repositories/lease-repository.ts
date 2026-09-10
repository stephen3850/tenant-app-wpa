import { prisma } from "@/lib/prisma";
import { LeaseStatus, Prisma } from "@prisma/client";
import { LeaseFilterValues } from "../schemas";

export class LeaseRepository {
  async findAll(organizationId: string, filters?: LeaseFilterValues) {
    const where: Prisma.LeaseWhereInput = {
      organizationId,
      deletedAt: null,
    };

    if (filters) {
      if (filters.status) where.status = filters.status;
      if (filters.propertyId) where.propertyId = filters.propertyId;
      if (filters.unitId) where.unitId = filters.unitId;
      if (filters.tenantId) where.tenantId = filters.tenantId;

      if (filters.search) {
        where.OR = [
          { leaseNumber: { contains: filters.search, mode: 'insensitive' } },
          { tenant: { firstName: { contains: filters.search, mode: 'insensitive' } } },
          { tenant: { lastName: { contains: filters.search, mode: 'insensitive' } } },
          { unit: { unitNumber: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }

      if (filters.expiringSoon) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        where.status = LeaseStatus.ACTIVE;
        where.endDate = {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        };
      }
    }

    return prisma.lease.findMany({
      where,
      include: {
        property: true,
        unit: true,
        tenant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string, organizationId: string) {
    return prisma.lease.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        property: true,
        unit: true,
        tenant: true,
        invoices: {
          orderBy: {
            createdAt: 'desc',
          }
        }
      },
    });
  }

  async create(data: Prisma.LeaseCreateInput) {
    return prisma.lease.create({
      data,
    });
  }

  async update(id: string, organizationId: string, data: Prisma.LeaseUpdateInput) {
    const lease = await prisma.lease.findFirst({
      where: { id, organizationId }
    });

    if (!lease) throw new Error("Lease not found or unauthorized");

    return prisma.lease.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, organizationId: string) {
    const lease = await prisma.lease.findFirst({
      where: { id, organizationId }
    });

    if (!lease) throw new Error("Lease not found or unauthorized");

    return prisma.lease.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, organizationId: string) {
    const lease = await prisma.lease.findFirst({
      where: { id, organizationId }
    });

    if (!lease) throw new Error("Lease not found or unauthorized");

    return prisma.lease.update({
      where: { id },
      data: { deletedAt: null, status: LeaseStatus.ACTIVE },
    });
  }

  async getStats(organizationId: string) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [active, expiring, expired, renewed, revenue] = await Promise.all([
      prisma.lease.count({ where: { organizationId, status: LeaseStatus.ACTIVE } }),
      prisma.lease.count({
        where: {
          organizationId,
          status: LeaseStatus.ACTIVE,
          endDate: { lte: thirtyDaysFromNow, gte: new Date() }
        }
      }),
      prisma.lease.count({ where: { organizationId, status: LeaseStatus.EXPIRED } }),
      prisma.lease.count({ where: { organizationId, status: LeaseStatus.RENEWED } }),
      prisma.lease.aggregate({
        where: { organizationId, status: LeaseStatus.ACTIVE },
        _sum: { monthlyRent: true }
      })
    ]);

    return {
      activeLeases: active,
      expiringLeases: expiring,
      expiredLeases: expired,
      renewedLeases: renewed,
      totalRevenue: Number(revenue._sum.monthlyRent || 0),
    };
  }
}

export const leaseRepository = new LeaseRepository();
