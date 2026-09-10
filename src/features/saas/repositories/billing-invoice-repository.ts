import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class BillingInvoiceRepository {
  async findMany(organizationId: string) {
    return db.billingInvoice.findMany({
      where: { organizationId },
      include: {
        lineItems: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, organizationId: string) {
    return db.billingInvoice.findUnique({
      where: { id, organizationId },
      include: {
        lineItems: true,
        payments: true,
      },
    });
  }

  async create(data: Prisma.BillingInvoiceUncheckedCreateInput) {
    return db.billingInvoice.create({ data });
  }

  async createPayment(data: Prisma.BillingPaymentUncheckedCreateInput) {
    return db.$transaction(async (tx) => {
      const payment = await tx.billingPayment.create({ data });

      const invoice = await tx.billingInvoice.findUnique({
        where: { id: data.billingInvoiceId },
        include: { payments: true }
      });

      if (!invoice) throw new Error("Invoice not found");

      const totalPaid = invoice.payments.reduce((acc, p) => acc + Number(p.amount), Number(data.amount));

      if (totalPaid >= Number(invoice.total)) {
        await tx.billingInvoice.update({
          where: { id: invoice.id },
          data: { status: "PAID", paidAt: new Date() }
        });
      }

      return payment;
    });
  }
}

export const billingInvoiceRepository = new BillingInvoiceRepository();
