import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, differenceInHours } from "date-fns";

export class LandlordMaintenanceRepository {
  async getMaintenanceDashboard(userId: string, organizationId: string, period: "MTD" | "QTD" | "YTD" = "MTD") {
    const { start, end } = this.getPeriodDates(period);

    const properties = await db.property.findMany({
      where: { landlordId: userId, organizationId },
      select: { id: true }
    });
    const propertyIds = properties.map(p => p.id);

    const tickets = await db.ticket.findMany({
      where: {
        propertyId: { in: propertyIds },
        organizationId,
        createdAt: { gte: start, lte: end }
      }
    });

    const openTickets = await db.ticket.count({
      where: { propertyId: { in: propertyIds }, organizationId, status: "OPEN" }
    });

    const emergencyTickets = await db.ticket.count({
      where: { propertyId: { in: propertyIds }, organizationId, priority: "EMERGENCY", status: { notIn: ["RESOLVED", "CLOSED"] } }
    });

    const inProgressTickets = await db.ticket.count({
      where: { propertyId: { in: propertyIds }, organizationId, status: "IN_PROGRESS" }
    });

    const resolvedMTD = await db.ticket.count({
      where: {
        propertyId: { in: propertyIds },
        organizationId,
        status: { in: ["RESOLVED", "CLOSED"] },
        closedAt: { gte: startOfMonth(new Date()), lte: endOfMonth(new Date()) }
      }
    });

    const maintenanceSpend = await db.expense.aggregate({
      where: {
        propertyId: { in: propertyIds },
        organizationId,
        status: "PAID",
        expenseDate: { gte: start, lte: end },
        category: { name: { contains: "Maintenance", mode: "insensitive" } }
      },
      _sum: { totalAmount: true }
    });

    // Avg Resolution Time in hours
    const resolvedTickets = await db.ticket.findMany({
      where: {
        propertyId: { in: propertyIds },
        organizationId,
        status: { in: ["RESOLVED", "CLOSED"] },
        closedAt: { gte: start, lte: end },
        createdAt: { not: undefined }
      },
      select: { createdAt: true, closedAt: true }
    });

    let totalHours = 0;
    resolvedTickets.forEach(t => {
      if (t.closedAt) {
        totalHours += differenceInHours(new Date(t.closedAt), new Date(t.createdAt));
      }
    });

    const avgResolutionTime = resolvedTickets.length > 0 ? totalHours / resolvedTickets.length : 0;

    return {
      openTickets,
      emergencyTickets,
      inProgressTickets,
      resolvedMTD,
      maintenanceSpend: maintenanceSpend._sum.totalAmount || new Prisma.Decimal(0),
      avgResolutionTime: Math.round(avgResolutionTime)
    };
  }

  async getMaintenanceTickets(userId: string, organizationId: string, filters?: any) {
    const where: Prisma.TicketWhereInput = {
      organizationId,
      property: { landlordId: userId }
    };

    if (filters?.propertyId) where.propertyId = filters.propertyId;
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.vendorId) where.vendorId = filters.vendorId;
    if (filters?.search) {
      where.OR = [
        { ticketNumber: { contains: filters.search, mode: "insensitive" } },
        { subject: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } }
      ];
    }

    return db.ticket.findMany({
      where,
      include: {
        property: { select: { propertyName: true } },
        unit: { select: { unitNumber: true } },
        category: { select: { name: true } },
        vendor: { select: { name: true } },
        assignee: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getEmergencyTickets(userId: string, organizationId: string) {
    return db.ticket.findMany({
      where: {
        organizationId,
        property: { landlordId: userId },
        priority: "EMERGENCY",
        status: { notIn: ["RESOLVED", "CLOSED"] }
      },
      include: {
        property: { select: { propertyName: true } },
        unit: { select: { unitNumber: true } },
        category: { select: { name: true } },
        assignee: { select: { name: true } }
      },
      orderBy: { createdAt: "asc" }
    });
  }

  async getMaintenanceAnalytics(userId: string, organizationId: string, period: "MTD" | "QTD" | "YTD" = "MTD") {
    const { start, end } = this.getPeriodDates(period);

    const expenses = await db.expense.findMany({
      where: {
        organizationId,
        property: { landlordId: userId },
        status: "PAID",
        expenseDate: { gte: start, lte: end },
        category: { name: { contains: "Maintenance", mode: "insensitive" } }
      },
      include: { property: true, category: true, vendor: true }
    });

    const byProperty: Record<string, Prisma.Decimal> = {};
    const byCategory: Record<string, Prisma.Decimal> = {};
    const byVendor: Record<string, Prisma.Decimal> = {};

    expenses.forEach(e => {
      const prop = e.property.propertyName;
      const cat = e.category.name;
      const vend = e.vendor?.name || "Unknown";

      byProperty[prop] = (byProperty[prop] || new Prisma.Decimal(0)).plus(e.totalAmount);
      byCategory[cat] = (byCategory[cat] || new Prisma.Decimal(0)).plus(e.totalAmount);
      byVendor[vend] = (byVendor[vend] || new Prisma.Decimal(0)).plus(e.totalAmount);
    });

    const totalSpend = expenses.reduce((acc, e) => acc.plus(e.totalAmount), new Prisma.Decimal(0));

    const ticketCount = await db.ticket.count({
      where: {
        property: { landlordId: userId },
        organizationId,
        createdAt: { gte: start, lte: end }
      }
    });

    return {
      totalSpend,
      avgCostPerTicket: ticketCount > 0 ? totalSpend.div(ticketCount) : new Prisma.Decimal(0),
      byProperty: Object.entries(byProperty).map(([name, value]) => ({ name, value })),
      byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
      byVendor: Object.entries(byVendor).map(([name, value]) => ({ name, value }))
    };
  }

  async getVendorPerformance(userId: string, organizationId: string) {
    const vendors = await db.vendor.findMany({
      where: { organizationId },
      include: {
        tickets: {
          where: { property: { landlordId: userId } },
          select: { status: true, createdAt: true, closedAt: true, satisfactionRating: true, actualCost: true }
        }
      }
    });

    return vendors.map(v => {
      const totalTickets = v.tickets.length;
      const resolved = v.tickets.filter(t => ["RESOLVED", "CLOSED"].includes(t.status)).length;
      const resolutionRate = totalTickets > 0 ? (resolved / totalTickets) * 100 : 0;

      let totalHours = 0;
      let ratedCount = 0;
      let totalRating = 0;
      let totalCost = new Prisma.Decimal(0);

      v.tickets.forEach(t => {
        if (t.closedAt) {
          totalHours += differenceInHours(new Date(t.closedAt), new Date(t.createdAt));
        }
        if (t.satisfactionRating) {
          ratedCount++;
          totalRating += t.satisfactionRating;
        }
        if (t.actualCost) {
          totalCost = totalCost.plus(t.actualCost);
        }
      });

      return {
        id: v.id,
        name: v.name,
        ticketsAssigned: totalTickets,
        resolutionRate: Math.round(resolutionRate),
        avgCompletionTime: totalTickets > 0 ? Math.round(totalHours / totalTickets) : 0,
        avgCost: totalTickets > 0 ? totalCost.div(totalTickets) : new Prisma.Decimal(0),
        avgRating: ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : "N/A"
      };
    });
  }

  private getPeriodDates(period: string) {
    const now = new Date();
    let start, end;
    if (period === "QTD") {
      start = startOfOfQuarter(now);
      end = endOfOfQuarter(now);
    } else if (period === "YTD") {
      start = startOfYear(now);
      end = endOfYear(now);
    } else {
      start = startOfMonth(now);
      end = endOfMonth(now);
    }
    return { start, end };
  }
}

function startOfOfQuarter(date: Date) { return startOfQuarter(date); }
function endOfOfQuarter(date: Date) { return endOfQuarter(date); }

export const landlordMaintenanceRepository = new LandlordMaintenanceRepository();
