import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class TenantPaymentRepository {
  async findManyByTenantId(tenantId: string, limit = 50) {
    return db.payment.findMany({
      where: { tenantId },
      orderBy: { paymentDate: "desc" },
      take: limit,
      include: {
        allocations: {
          include: {
            invoice: true
          }
        },
        receipt: true
      }
    });
  }

  async getOutstandingInvoices(tenantId: string) {
    return db.invoice.findMany({
      where: {
        lease: { tenantId },
        status: { in: ["POSTED", "PARTIALLY_PAID", "OVERDUE"] }
      },
      orderBy: { dueDate: "asc" }
    });
  }

  async getFinancialSummary(tenantId: string) {
    const invoices = await this.getOutstandingInvoices(tenantId);
    const totalOutstanding = invoices.reduce((acc, inv) => acc + Number(inv.balanceDue), 0);
    const overdueAmount = invoices
      .filter(inv => new Date(inv.dueDate) < new Date())
      .reduce((acc, inv) => acc + Number(inv.balanceDue), 0);

    const latestPayment = await db.payment.findFirst({
      where: { tenantId },
      orderBy: { paymentDate: "desc" }
    });

    return {
      totalOutstanding,
      overdueAmount,
      latestPayment,
      countOutstanding: invoices.length
    };
  }

  async findMpesaTransactionByCheckoutId(checkoutRequestId: string) {
    return db.mpesaTransaction.findUnique({
      where: { checkoutRequestId }
    });
  }

  async findPaymentById(id: string, tenantId: string) {
    return db.payment.findUnique({
      where: { id, tenantId },
      include: {
        allocations: {
          include: { invoice: true }
        },
        receipt: true
      }
    });
  }
}

export const tenantPaymentRepository = new TenantPaymentRepository();
