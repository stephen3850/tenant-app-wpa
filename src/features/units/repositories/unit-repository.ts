import { db } from "@/lib/db";
import { UnitStatus, OccupancyStatus, Prisma } from "@prisma/client";
import { UnitFilters } from "../schemas/unit-schema";

export class UnitRepository {
  async findAll(organizationId: string, filters?: UnitFilters) {
    const where: Prisma.UnitWhereInput = {
      property: {
        organizationId,
      },
      deletedAt: null,
      status: filters?.status !== undefined ? filters.status : { not: UnitStatus.INACTIVE }
    };

    if (filters) {
      if (filters.propertyId) where.propertyId = filters.propertyId;
      if (filters.unitType) where.unitType = filters.unitType;
      if (filters.occupancyStatus) where.occupancyStatus = filters.occupancyStatus;
      // status already handled above or can be overridden

      if (filters.minRent || filters.maxRent) {
        where.monthlyRent = {
          gte: filters.minRent,
          lte: filters.maxRent,
        };
      }

      if (filters.search) {
        where.OR = [
          { unitNumber: { contains: filters.search, mode: 'insensitive' } },
          { unitCode: { contains: filters.search, mode: 'insensitive' } },
          { property: { propertyName: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }
    }

    return db.unit.findMany({
      where,
      include: {
        property: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string, organizationId: string) {
    return db.unit.findFirst({
      where: {
        id,
        property: {
          organizationId,
        },
        deletedAt: null,
      },
      include: {
        property: true,
        leases: {
          include: {
            tenant: true,
            invoices: {
              include: {
                payments: true,
              },
            },
          },
          orderBy: {
            startDate: 'desc',
          },
        },
        tickets: {
          include: {
            creator: true,
            assignee: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async create(data: Prisma.UnitCreateInput) {
    return db.unit.create({
      data,
    });
  }

  async createMany(data: Prisma.UnitCreateManyInput[]) {
    return db.unit.createMany({
      data,
    });
  }

  async update(id: string, organizationId: string, data: Prisma.UnitUpdateInput) {
    // Ensure ownership before update
    const unit = await db.unit.findFirst({
      where: { id, property: { organizationId } },
    });

    if (!unit) throw new Error("Unit not found or unauthorized");

    return db.unit.update({
      where: { id },
      data,
    });
  }

  async archive(id: string, organizationId: string) {
    const unit = await db.unit.findFirst({
      where: { id, property: { organizationId } },
    });

    if (!unit) throw new Error("Unit not found or unauthorized");

    return db.unit.update({
      where: { id },
      data: { status: UnitStatus.INACTIVE },
    });
  }

  async softDelete(id: string, organizationId: string) {
    const unit = await db.unit.findFirst({
      where: { id, property: { organizationId } },
    });

    if (!unit) throw new Error("Unit not found or unauthorized");

    return db.unit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, organizationId: string) {
    const unit = await db.unit.findFirst({
      where: { id, property: { organizationId } },
    });

    if (!unit) throw new Error("Unit not found or unauthorized");

    return db.unit.update({
      where: { id },
      data: { deletedAt: null, status: UnitStatus.ACTIVE },
    });
  }

  async getStats(organizationId: string) {
    const units = await db.unit.findMany({
      where: {
        property: { organizationId },
        deletedAt: null,
      },
      select: {
        occupancyStatus: true,
      },
    });

    const total = units.length;
    const stats = {
      totalUnits: total,
      occupiedUnits: units.filter(u => u.occupancyStatus === OccupancyStatus.OCCUPIED).length,
      vacantUnits: units.filter(u => u.occupancyStatus === OccupancyStatus.VACANT).length,
      maintenanceUnits: units.filter(u => u.occupancyStatus === OccupancyStatus.MAINTENANCE).length,
      reservedUnits: units.filter(u => u.occupancyStatus === OccupancyStatus.RESERVED).length,
      occupancyRate: total > 0 ? (units.filter(u => u.occupancyStatus === OccupancyStatus.OCCUPIED).length / total) * 100 : 0,
    };

    return stats;
  }
}

export const unitRepository = new UnitRepository();
