import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { addDays, startOfDay, endOfDay } from "date-fns";

export class LandlordTenancyRepository {
  async getTenancies(userId: string, organizationId: string, filters?: { propertyId?: string; status?: string; search?: string }) {
    const where: Prisma.LeaseWhereInput = {
      organizationId,
      property: {
        landlordId: userId,
      },
    };

    if (filters?.propertyId) {
      where.propertyId = filters.propertyId;
    }

    if (filters?.status) {
      where.status = filters.status as any;
    }

    if (filters?.search) {
      where.OR = [
        { leaseNumber: { contains: filters.search, mode: "insensitive" } },
        { unit: { unitNumber: { contains: filters.search, mode: "insensitive" } } },
        { tenant: { firstName: { contains: filters.search, mode: "insensitive" } } },
        { tenant: { lastName: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    return db.lease.findMany({
      where,
      select: {
        id: true,
        leaseNumber: true,
        status: true,
        startDate: true,
        endDate: true,
        monthlyRent: true,
        property: {
          select: {
            propertyName: true,
          },
        },
        unit: {
          select: {
            unitNumber: true,
          },
        },
        tenant: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    });
  }

  async getTenancyById(leaseId: string, userId: string, organizationId: string) {
    return db.lease.findFirst({
      where: {
        id: leaseId,
        organizationId,
        property: {
          landlordId: userId,
        },
      },
      select: {
        id: true,
        leaseNumber: true,
        status: true,
        startDate: true,
        endDate: true,
        monthlyRent: true,
        securityDeposit: true,
        serviceCharge: true,
        property: {
          select: {
            propertyName: true,
            address: true,
          },
        },
        unit: {
          select: {
            unitNumber: true,
            unitType: true,
          },
        },
        tenant: {
          select: {
            firstName: true,
            lastName: true,
            email: true, // Only business relevant
            phone: true,
            status: true,
          },
        },
        invoices: {
          where: {
            status: { in: ["POSTED", "PARTIALLY_PAID", "OVERDUE"] },
          },
          select: {
            balanceDue: true,
            dueDate: true,
          },
        },
      },
    });
  }

  async getLeaseInsights(userId: string, organizationId: string) {
    const now = new Date();
    const in30Days = addDays(now, 30);
    const in60Days = addDays(now, 60);

    const activeLeases = await db.lease.count({
      where: {
        organizationId,
        status: "ACTIVE",
        property: { landlordId: userId },
      },
    });

    const expiring30 = await db.lease.count({
      where: {
        organizationId,
        status: "ACTIVE",
        endDate: { gte: now, lte: in30Days },
        property: { landlordId: userId },
      },
    });

    const expiring60 = await db.lease.count({
      where: {
        organizationId,
        status: "ACTIVE",
        endDate: { gte: now, lte: in60Days },
        property: { landlordId: userId },
      },
    });

    const renewalsPending = await db.leaseRenewal.count({
      where: {
        organizationId,
        status: "PENDING",
        lease: {
          property: { landlordId: userId },
        },
      },
    });

    const vacantUnits = await db.unit.count({
      where: {
        property: {
          organizationId,
          landlordId: userId,
        },
        occupancyStatus: "VACANT",
        status: "ACTIVE",
      },
    });

    return {
      activeLeases,
      expiring30,
      expiring60,
      renewalsPending,
      vacantUnits,
    };
  }

  async getVacancyInsights(userId: string, organizationId: string) {
    return db.unit.findMany({
      where: {
        property: {
          organizationId,
          landlordId: userId,
        },
        occupancyStatus: "VACANT",
        status: "ACTIVE",
      },
      select: {
        id: true,
        unitNumber: true,
        unitType: true,
        monthlyRent: true,
        updatedAt: true,
        property: {
          select: {
            propertyName: true,
          },
        },
      },
      orderBy: { updatedAt: "asc" },
    });
  }

  async getRenewalInsights(userId: string, organizationId: string) {
    return db.leaseRenewal.findMany({
      where: {
        organizationId,
        lease: {
          property: { landlordId: userId },
        },
      },
      include: {
        lease: {
          select: {
            leaseNumber: true,
            unit: {
              select: { unitNumber: true },
            },
            tenant: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPaymentStanding(userId: string, organizationId: string) {
    const leases = await db.lease.findMany({
      where: {
        organizationId,
        status: "ACTIVE",
        property: { landlordId: userId },
      },
      select: {
        id: true,
        leaseNumber: true,
        tenant: {
          select: { firstName: true, lastName: true },
        },
        unit: {
          select: { unitNumber: true },
        },
        invoices: {
          where: {
            status: { in: ["POSTED", "PARTIALLY_PAID", "OVERDUE"] },
          },
          select: {
            balanceDue: true,
            dueDate: true,
          },
        },
      },
    });

    return leases.map(lease => {
      const totalArrears = lease.invoices.reduce((acc, inv) => acc.plus(inv.balanceDue), new Prisma.Decimal(0));
      let standing = "Current";
      if (totalArrears.gt(0)) {
        standing = totalArrears.gt(50000) ? "Serious Arrears" : "Minor Arrears"; // Arbitrary threshold for demo
      }

      return {
        id: lease.id,
        leaseNumber: lease.leaseNumber,
        tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
        unitNumber: lease.unit.unitNumber,
        totalArrears,
        standing,
      };
    });
  }
}

export const landlordTenancyRepository = new LandlordTenancyRepository();
