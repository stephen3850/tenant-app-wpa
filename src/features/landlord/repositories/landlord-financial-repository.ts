import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, differenceInDays } from "date-fns";

export class LandlordFinancialRepository {
  async getFinancialDashboard(userId: string, organizationId: string) {
    const now = new Date();
    const startMTD = startOfMonth(now);
    const endMTD = endOfMonth(now);
    const startYTD = startOfYear(now);

    const lastMonth = subMonths(now, 1);
    const startPM = startOfMonth(lastMonth);
    const endPM = endOfMonth(lastMonth);

    // Revenue (Payments)
    const [revMTD, revYTD, revPM] = await Promise.all([
      this.getRevenue(userId, organizationId, startMTD, endMTD),
      this.getRevenue(userId, organizationId, startYTD, now),
      this.getRevenue(userId, organizationId, startPM, endPM)
    ]);

    // Expenses
    const [expMTD, expYTD, expPM] = await Promise.all([
      this.getExpenses(userId, organizationId, startMTD, endMTD),
      this.getExpenses(userId, organizationId, startYTD, now),
      this.getExpenses(userId, organizationId, startPM, endPM)
    ]);

    // Disbursements (Drawings)
    const [disMTD, disYTD] = await Promise.all([
      this.getDisbursements(userId, organizationId, startMTD, endMTD),
      this.getDisbursements(userId, organizationId, startYTD, now)
    ]);

    const arrears = await this.getTotalArrears(userId, organizationId);

    return {
      revenue: { mtd: revMTD, ytd: revYTD, pm: revPM },
      expenses: { mtd: expMTD, ytd: expYTD, pm: expPM },
      noi: {
        mtd: revMTD.minus(expMTD),
        ytd: revYTD.minus(expYTD),
        pm: revPM.minus(expPM)
      },
      disbursements: { mtd: disMTD, ytd: disYTD },
      arrears,
      ownerBalance: revYTD.minus(expYTD).minus(disYTD) // Simple balance for now
    };
  }

  private async getRevenue(userId: string, organizationId: string, start: Date, end: Date) {
    const result = await db.payment.aggregate({
      where: {
        organizationId,
        status: "COMPLETED",
        paymentDate: { gte: start, lte: end },
        lease: {
          property: { landlordId: userId }
        }
      },
      _sum: { amount: true }
    });
    return result._sum.amount || new Prisma.Decimal(0);
  }

  private async getExpenses(userId: string, organizationId: string, start: Date, end: Date) {
    const result = await db.expense.aggregate({
      where: {
        organizationId,
        status: "PAID",
        expenseDate: { gte: start, lte: end },
        property: { landlordId: userId }
      },
      _sum: { totalAmount: true }
    });
    return result._sum.totalAmount || new Prisma.Decimal(0);
  }

  private async getDisbursements(userId: string, organizationId: string, start: Date, end: Date) {
    const result = await db.disbursement.aggregate({
      where: {
        organizationId,
        landlordId: userId,
        status: "PROCESSED",
        processedAt: { gte: start, lte: end }
      },
      _sum: { amount: true }
    });
    return result._sum.amount || new Prisma.Decimal(0);
  }

  async getOwnerStatements(userId: string, organizationId: string) {
    return db.ownerStatement.findMany({
      where: {
        landlordId: userId,
        organizationId
      },
      orderBy: { endDate: "desc" }
    });
  }

  async getOwnerStatement(statementId: string, userId: string, organizationId: string) {
    return db.ownerStatement.findFirst({
      where: {
        id: statementId,
        landlordId: userId,
        organizationId
      }
    });
  }

  async getCashFlow(userId: string, organizationId: string, months: number = 6) {
    const results = [];
    const now = new Date();

    for (let i = 0; i < months; i++) {
      const date = subMonths(now, i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      const [inflow, outflow] = await Promise.all([
        this.getRevenue(userId, organizationId, start, end),
        this.getExpenses(userId, organizationId, start, end)
      ]);

      results.push({
        month: start.toISOString(),
        inflow,
        outflow,
        net: inflow.minus(outflow)
      });
    }

    return results.reverse();
  }

  async getRevenueAnalytics(userId: string, organizationId: string) {
    // Revenue by Property
    const propertyRevenue = await db.property.findMany({
      where: { landlordId: userId, organizationId },
      select: {
        id: true,
        propertyName: true,
        propertyCode: true,
        leases: {
          select: {
            invoices: {
              where: { status: "PAID" },
              select: { amountPaid: true }
            }
          }
        }
      }
    });

    const byProperty = propertyRevenue.map(p => {
      let total = new Prisma.Decimal(0);
      p.leases.forEach(l => {
        l.invoices.forEach(inv => {
          total = total.plus(inv.amountPaid);
        });
      });
      return {
        id: p.id,
        name: p.propertyName,
        code: p.propertyCode,
        value: total
      };
    });

    return { byProperty };
  }

  async getExpenseAnalytics(userId: string, organizationId: string) {
    const expenses = await db.expense.findMany({
      where: {
        organizationId,
        status: "PAID",
        property: { landlordId: userId }
      },
      include: { category: true, property: true }
    });

    const byCategory: Record<string, Prisma.Decimal> = {};
    const byProperty: Record<string, Prisma.Decimal> = {};

    expenses.forEach(e => {
      const cat = e.category.name;
      const prop = e.property.propertyName;

      byCategory[cat] = (byCategory[cat] || new Prisma.Decimal(0)).plus(e.totalAmount);
      byProperty[prop] = (byProperty[prop] || new Prisma.Decimal(0)).plus(e.totalAmount);
    });

    return {
      byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
      byProperty: Object.entries(byProperty).map(([name, value]) => ({ name, value }))
    };
  }

  async getDisbursementHistory(userId: string, organizationId: string) {
    return db.disbursement.findMany({
      where: { landlordId: userId, organizationId },
      orderBy: { createdAt: "desc" }
    });
  }

  async getTotalArrears(userId: string, organizationId: string) {
    const result = await db.invoice.aggregate({
      where: {
        organizationId,
        status: { in: ["POSTED", "PARTIALLY_PAID", "OVERDUE"] },
        lease: {
          property: { landlordId: userId }
        }
      },
      _sum: { balanceDue: true }
    });
    return result._sum.balanceDue || new Prisma.Decimal(0);
  }

  async getArrearsReport(userId: string, organizationId: string) {
    const invoices = await db.invoice.findMany({
      where: {
        organizationId,
        status: { in: ["POSTED", "PARTIALLY_PAID", "OVERDUE"] },
        lease: {
          property: { landlordId: userId }
        }
      },
      include: {
        lease: {
          include: {
            tenant: true,
            unit: true,
            property: true
          }
        }
      }
    });

    const now = new Date();
    const buckets = {
      current: new Prisma.Decimal(0),
      "1-30": new Prisma.Decimal(0),
      "31-60": new Prisma.Decimal(0),
      "61-90": new Prisma.Decimal(0),
      "90+": new Prisma.Decimal(0),
    };

    invoices.forEach(inv => {
      const daysOverdue = differenceInDays(now, inv.dueDate);
      const amount = inv.balanceDue;

      if (daysOverdue <= 0) buckets.current = buckets.current.plus(amount);
      else if (daysOverdue <= 30) buckets["1-30"] = buckets["1-30"].plus(amount);
      else if (daysOverdue <= 60) buckets["31-60"] = buckets["31-60"].plus(amount);
      else if (daysOverdue <= 90) buckets["61-90"] = buckets["61-90"].plus(amount);
      else buckets["90+"] = buckets["90+"].plus(amount);
    });

    return {
      total: Object.values(buckets).reduce((acc, val) => acc.plus(val), new Prisma.Decimal(0)),
      buckets,
      items: invoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        tenant: `${inv.lease.tenant.firstName} ${inv.lease.tenant.lastName}`,
        property: inv.lease.property.propertyName,
        unit: inv.lease.unit.unitNumber,
        balance: inv.balanceDue,
        dueDate: inv.dueDate,
        daysOverdue: Math.max(0, differenceInDays(now, inv.dueDate))
      }))
    };
  }
}

export const landlordFinancialRepository = new LandlordFinancialRepository();
