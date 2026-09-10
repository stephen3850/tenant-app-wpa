import { db } from "@/lib/db";
import { Prisma, InvoiceStatus } from "@prisma/client";

export class InvoiceRepository {
  async findById(id: string, organizationId: string) {
    return db.invoice.findUnique({
      where: { id, organizationId },
      include: {
        lineItems: true,
        lease: {
          include: {
            tenant: true,
            unit: { include: { property: true } }
          }
        },
        payments: true,
      },
    });
  }

  async findByLeaseAndPeriod(leaseId: string, month: number, year: number) {
    return db.invoice.findUnique({
      where: {
        lease_billing_period_unique: {
          leaseId,
          billingMonth: month,
          billingYear: year,
        },
      },
    });
  }

  async create(data: Prisma.InvoiceCreateInput) {
    return db.invoice.create({
      data,
      include: { lineItems: true },
    });
  }

  async update(id: string, organizationId: string, data: Prisma.InvoiceUpdateInput) {
    return db.invoice.update({
      where: { id, organizationId },
      data,
    });
  }

  async findMany(organizationId: string, filters?: { status?: InvoiceStatus; leaseId?: string }) {
    return db.invoice.findMany({
      where: {
        organizationId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.leaseId && { leaseId: filters.leaseId }),
      },
      include: {
        lease: {
          include: {
            tenant: true,
            unit: { include: { property: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDashboardStats(organizationId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = await db.$transaction([
      db.invoice.count({ where: { organizationId } }),
      db.invoice.aggregate({
        where: { organizationId, status: { not: "CANCELLED" } },
        _sum: { balanceDue: true },
      }),
      db.invoice.aggregate({
        where: {
          organizationId,
          status: "PAID",
          updatedAt: { gte: startOfMonth },
        },
        _sum: { totalAmount: true },
      }),
      db.invoice.aggregate({
        where: { organizationId, status: "OVERDUE" },
        _sum: { balanceDue: true },
      }),
    ]);

    return {
      totalInvoices: stats[0],
      outstandingAmount: stats[1]._sum.balanceDue || 0,
      paidThisMonth: stats[2]._sum.totalAmount || 0,
      overdueAmount: stats[3]._sum.balanceDue || 0,
    };
  }
}

export const invoiceRepository = new InvoiceRepository();
