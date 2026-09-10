import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";

export class LandlordPropertyRepository {
  async getProperties(userId: string, organizationId: string, filters?: { status?: string; search?: string }) {
    const where: Prisma.PropertyWhereInput = {
      landlordId: userId,
      organizationId,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { propertyName: { contains: filters.search, mode: "insensitive" } },
        { propertyCode: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return db.property.findMany({
      where,
      include: {
        _count: {
          select: { units: true }
        },
        units: {
          select: { occupancyStatus: true, monthlyRent: true }
        }
      },
      orderBy: { propertyName: "asc" }
    });
  }

  async getPropertyById(propertyId: string, userId: string, organizationId: string) {
    return db.property.findFirst({
      where: {
        id: propertyId,
        landlordId: userId,
        organizationId,
      },
      include: {
        manager: {
          select: { name: true, email: true, phone: true }
        }
      }
    });
  }

  async getPropertyUnits(propertyId: string, userId: string, organizationId: string) {
    return db.unit.findMany({
      where: {
        propertyId,
        property: {
          landlordId: userId,
          organizationId
        }
      },
      orderBy: { unitNumber: "asc" }
    });
  }

  async getPropertyDocuments(propertyId: string, userId: string, organizationId: string) {
    return db.propertyDocument.findMany({
      where: {
        propertyId,
        property: {
          landlordId: userId,
          organizationId
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getPropertyPerformance(propertyId: string, userId: string, organizationId: string, period: "MTD" | "PM" | "YTD") {
    let startDate: Date;
    let endDate: Date = new Date();

    const now = new Date();
    if (period === "MTD") {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else if (period === "PM") {
      const lastMonth = subMonths(now, 1);
      startDate = startOfMonth(lastMonth);
      endDate = endOfMonth(lastMonth);
    } else {
      startDate = startOfYear(now);
    }

    const revenue = await db.payment.aggregate({
      where: {
        organizationId,
        status: "COMPLETED",
        paymentDate: { gte: startDate, lte: endDate },
        lease: {
          propertyId: propertyId
        }
      },
      _sum: { amount: true }
    });

    const expenses = await db.expense.aggregate({
      where: {
        organizationId,
        status: "PAID",
        expenseDate: { gte: startDate, lte: endDate },
        propertyId: propertyId
      },
      _sum: { totalAmount: true }
    });

    const arrears = await db.invoice.aggregate({
      where: {
        organizationId,
        status: { in: ["POSTED", "PARTIALLY_PAID", "OVERDUE"] },
        lease: {
          propertyId: propertyId
        }
      },
      _sum: { balanceDue: true }
    });

    const units = await db.unit.findMany({
      where: { propertyId },
      select: { occupancyStatus: true, monthlyRent: true }
    });

    const totalUnits = units.length;
    const occupiedUnits = units.filter(u => u.occupancyStatus === "OCCUPIED").length;
    const avgRent = totalUnits > 0
      ? units.reduce((acc, u) => acc + Number(u.monthlyRent), 0) / totalUnits
      : 0;

    const totalRevenue = revenue._sum.amount || new Prisma.Decimal(0);
    const totalExpenses = expenses._sum.totalAmount || new Prisma.Decimal(0);

    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      netIncome: totalRevenue.minus(totalExpenses),
      arrears: arrears._sum.balanceDue || new Prisma.Decimal(0),
      occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
      avgRent: new Prisma.Decimal(avgRent),
    };
  }

  async getTenancyInsights(propertyId: string, userId: string, organizationId: string) {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(now.getDate() + 30);

    const activeLeases = await db.lease.findMany({
      where: {
        propertyId,
        status: "ACTIVE",
        property: { landlordId: userId, organizationId }
      },
      include: { tenant: true, unit: true }
    });

    const expiringLeases = activeLeases.filter(l => l.endDate && l.endDate <= in30Days);

    const renewalsPending = await db.leaseRenewal.count({
      where: {
        lease: { propertyId },
        status: "PENDING",
        organizationId
      }
    });

    const vacancies = await db.unit.count({
      where: {
        propertyId,
        occupancyStatus: "VACANT",
        status: "ACTIVE"
      }
    });

    return {
      activeLeases,
      expiringLeases,
      renewalsPending,
      vacancies
    };
  }

  async getMaintenanceInsights(propertyId: string, userId: string, organizationId: string) {
    const tickets = await db.ticket.findMany({
      where: {
        propertyId,
        property: { landlordId: userId, organizationId }
      },
      select: { status: true, priority: true }
    });

    const openTickets = tickets.filter(t => t.status === "OPEN").length;
    const emergencyTickets = tickets.filter(t => t.priority === "EMERGENCY" || t.priority === "URGENT").length;

    const maintenanceCosts = await db.expense.aggregate({
      where: {
        propertyId,
        organizationId,
        status: "PAID",
        categoryId: { contains: "Maintenance" }
      },
      _sum: { totalAmount: true }
    });

    return {
      openTickets,
      emergencyTickets,
      maintenanceCosts: maintenanceCosts._sum.totalAmount || new Prisma.Decimal(0),
      // Vendor performance would require more data, but we'll return a placeholder or simple count
      vendorCount: await db.vendor.count({ where: { organizationId } })
    };
  }
}

export const landlordPropertyRepository = new LandlordPropertyRepository();
