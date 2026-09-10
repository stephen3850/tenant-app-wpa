import { ReportRepository } from "../repositories/report-repository";
import { getTenantDb } from "@/lib/tenant-db";
import { Prisma } from "@prisma/client";

export class ReportService {
  private repository: ReportRepository;
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
    this.repository = new ReportRepository(organizationId);
  }

  async getIncomeStatement(startDate: Date, endDate: Date) {
    const db = getTenantDb(this.organizationId);

    const payments = await db.payment.findMany({
      where: {
        paymentDate: { gte: startDate, lte: endDate },
        status: "COMPLETED",
      },
    });

    const expenses = await db.expense.findMany({
      where: {
        expenseDate: { gte: startDate, lte: endDate },
        status: "APPROVED",
      },
    });

    const totalIncome = payments.reduce((sum, p) => sum.add(p.amount), new Prisma.Decimal(0));
    const totalExpenses = expenses.reduce((sum, e) => sum.add(e.totalAmount), new Prisma.Decimal(0));

    return {
      startDate,
      endDate,
      totalIncome,
      totalExpenses,
      netProfit: totalIncome.minus(totalExpenses),
      incomeBreakdown: [], // group by category
      expenseBreakdown: [], // group by category
    };
  }

  async getRentRoll() {
    const db = getTenantDb(this.organizationId);

    const units = await db.unit.findMany({
      include: {
        property: true,
        leases: {
          where: { status: "ACTIVE" },
          include: { tenant: true },
        },
      },
    });

    return units.map((unit) => ({
      property: unit.property.propertyName,
      unitNumber: unit.unitNumber,
      unitType: unit.unitType,
      status: unit.occupancyStatus,
      rent: unit.monthlyRent,
      tenant: unit.leases[0]?.tenant.firstName + " " + unit.leases[0]?.tenant.lastName,
      leaseEnd: unit.leases[0]?.endDate,
    }));
  }

  async getOccupancyReport() {
    const db = getTenantDb(this.organizationId);

    const units = await db.unit.groupBy({
      by: ["occupancyStatus"],
      _count: true,
    });

    const totalUnits = units.reduce((sum, u) => sum + u._count, 0);

    return {
      totalUnits,
      breakdown: units.map((u) => ({
        status: u.occupancyStatus,
        count: u._count,
        percentage: (u._count / totalUnits) * 100,
      })),
    };
  }

  async getProfitAndLoss(startDate: Date, endDate: Date) {
    return this.getIncomeStatement(startDate, endDate);
  }

  async getAccountsReceivable() {
    return [];
  }

  async getLeaseExpiryReport() {
    const db = getTenantDb(this.organizationId);
    return db.lease.findMany({
      where: { status: "ACTIVE" },
      include: { tenant: true, property: true },
    });
  }

  async getMaintenanceReport() {
    const db = getTenantDb(this.organizationId);
    return db.ticket.findMany({
      include: { category: true, assignee: true },
    });
  }

  async scheduleReport(templateId: string, frequency: string, recipients: string[]) {
    // Logic to calculate nextRunAt based on frequency
    const nextRunAt = new Date(); // simplified

    return this.repository.createScheduledReport({
      organizationId: this.organizationId,
      templateId,
      frequency,
      recipients,
      nextRunAt,
    });
  }

  async createExport(reportType: string, format: string, filters: any, userId: string) {
    return this.repository.createExport({
      organizationId: this.organizationId,
      reportType,
      format,
      filters,
      createdById: userId,
      status: "PENDING",
    });
  }
}
