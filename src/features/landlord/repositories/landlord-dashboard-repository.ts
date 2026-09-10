import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";

export class LandlordDashboardRepository {
  async getLandlordProperties(userId: string, organizationId: string) {
    return db.property.findMany({
      where: {
        landlordId: userId,
        organizationId,
      },
      include: {
        units: true,
      },
    });
  }

  async getPortfolioStats(userId: string, organizationId: string) {
    const properties = await db.property.findMany({
      where: { landlordId: userId, organizationId },
      include: {
        _count: {
          select: { units: true }
        },
        units: {
          select: { occupancyStatus: true }
        }
      }
    });

    const totalProperties = properties.length;
    let totalUnits = 0;
    let occupiedUnits = 0;
    let vacantUnits = 0;
    let reservedUnits = 0;
    let maintenanceUnits = 0;

    properties.forEach(p => {
      totalUnits += p._count.units;
      p.units.forEach(u => {
        if (u.occupancyStatus === "OCCUPIED") occupiedUnits++;
        else if (u.occupancyStatus === "VACANT") vacantUnits++;
        else if (u.occupancyStatus === "RESERVED") reservedUnits++;
        else if (u.occupancyStatus === "MAINTENANCE") maintenanceUnits++;
      });
    });

    return {
      totalProperties,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      reservedUnits,
      maintenanceUnits,
      occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
    };
  }

  async getFinancialStats(userId: string, organizationId: string, period: "MTD" | "PM" | "YTD") {
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

    // Revenue from payments linked to leases on landlord's properties
    const revenue = await db.payment.aggregate({
      where: {
        organizationId,
        status: "COMPLETED",
        paymentDate: { gte: startDate, lte: endDate },
        lease: {
          property: { landlordId: userId }
        }
      },
      _sum: { amount: true }
    });

    // Expenses linked to landlord's properties
    const expenses = await db.expense.aggregate({
      where: {
        organizationId,
        status: "PAID",
        expenseDate: { gte: startDate, lte: endDate },
        property: { landlordId: userId }
      },
      _sum: { totalAmount: true }
    });

    const totalRevenue = revenue._sum.amount || new Prisma.Decimal(0);
    const totalExpenses = expenses._sum.totalAmount || new Prisma.Decimal(0);

    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      netIncome: totalRevenue.minus(totalExpenses),
    };
  }

  async getArrears(userId: string, organizationId: string) {
    const arrears = await db.invoice.aggregate({
      where: {
        organizationId,
        status: { in: ["POSTED", "PARTIALLY_PAID", "OVERDUE"] },
        lease: {
          property: { landlordId: userId }
        }
      },
      _sum: { balanceDue: true }
    });

    return arrears._sum.balanceDue || new Prisma.Decimal(0);
  }

  async getLeaseInsights(userId: string, organizationId: string) {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(now.getDate() + 30);
    const in60Days = new Date();
    in60Days.setDate(now.getDate() + 60);

    const activeLeasesCount = await db.lease.count({
      where: {
        organizationId,
        status: "ACTIVE",
        property: { landlordId: userId }
      }
    });

    const expiring30 = await db.lease.count({
      where: {
        organizationId,
        status: "ACTIVE",
        endDate: { gte: now, lte: in30Days },
        property: { landlordId: userId }
      }
    });

    const expiring60 = await db.lease.count({
      where: {
        organizationId,
        status: "ACTIVE",
        endDate: { gte: now, lte: in60Days },
        property: { landlordId: userId }
      }
    });

    const renewalsPending = await db.leaseRenewal.count({
      where: {
        organizationId,
        status: "PENDING",
        lease: {
          property: { landlordId: userId }
        }
      }
    });

    return {
      activeLeasesCount,
      expiring30,
      expiring60,
      renewalsPending,
    };
  }

  async getMaintenanceStats(userId: string, organizationId: string) {
    const now = new Date();
    const startOfMTD = startOfMonth(now);

    const tickets = await db.ticket.findMany({
      where: {
        organizationId,
        property: { landlordId: userId }
      },
      select: { status: true, priority: true }
    });

    const mtdCosts = await db.expense.aggregate({
      where: {
        organizationId,
        status: "PAID",
        expenseDate: { gte: startOfMTD },
        property: { landlordId: userId },
        categoryId: { contains: "Maintenance" } // Rough filter, ideally we use category name/type
      },
      _sum: { totalAmount: true }
    });

    const stats = {
      open: 0,
      inProgress: 0,
      resolved: 0,
      highPriority: 0,
      totalCosts: mtdCosts._sum.totalAmount || new Prisma.Decimal(0)
    };

    tickets.forEach(t => {
      if (t.status === "OPEN") stats.open++;
      else if (["ASSIGNED", "IN_PROGRESS"].includes(t.status)) stats.inProgress++;
      else if (["RESOLVED", "CLOSED"].includes(t.status)) stats.resolved++;

      if (["HIGH", "URGENT", "EMERGENCY"].includes(t.priority)) stats.highPriority++;
    });

    return stats;
  }

  async getRecentActivities(userId: string, organizationId: string, limit = 10) {
    // This could be a union or separate queries. For a dashboard, separate recent items are fine.
    const payments = await db.payment.findMany({
      where: {
        organizationId,
        status: "COMPLETED",
        lease: { property: { landlordId: userId } }
      },
      orderBy: { paymentDate: "desc" },
      take: limit,
      include: { tenant: true }
    });

    const tickets = await db.ticket.findMany({
      where: {
        organizationId,
        property: { landlordId: userId }
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { property: true, unit: true }
    });

    const expenses = await db.expense.findMany({
      where: {
        organizationId,
        property: { landlordId: userId }
      },
      orderBy: { expenseDate: "desc" },
      take: limit,
      include: { category: true }
    });

    return { payments, tickets, expenses };
  }

  async getCommunicationStats(userId: string, organizationId: string) {
    const unreadMessages = await db.conversationParticipant.count({
      where: {
        userId,
        conversation: { organizationId },
        conversation: {
          messages: {
            some: {
              createdAt: { gt: db.conversationParticipant.fields.lastReadAt }
            }
          }
        }
      }
    });

    const urgentMessages = await db.conversation.count({
      where: {
        organizationId,
        priority: "URGENT",
        participants: { some: { userId } }
      }
    });

    const recentConversations = await db.conversation.findMany({
      where: {
        organizationId,
        participants: { some: { userId } }
      },
      orderBy: { lastMessageAt: "desc" },
      take: 5,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { name: true } } }
        }
      }
    });

    const unreadAnnouncements = await db.announcement.count({
      where: {
        organizationId,
        status: "SENT",
        OR: [{ targetType: "ALL" }, { targetType: "LANDLORDS" }],
        reads: { none: { userId } }
      }
    });

    return {
      unreadMessages,
      urgentMessages,
      recentConversations,
      unreadAnnouncements
    };
  }
}

export const landlordDashboardRepository = new LandlordDashboardRepository();
