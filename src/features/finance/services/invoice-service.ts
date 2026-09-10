import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { invoiceRepository } from "../repositories/invoice-repository";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { CreateInvoiceInput } from "../schemas/invoice-schemas";

export class InvoiceService {
  async createInvoice(organizationId: string, input: CreateInvoiceInput) {
    await checkPermission("create", "invoice");

    const existing = await invoiceRepository.findByLeaseAndPeriod(
      input.leaseId,
      input.billingMonth,
      input.billingYear
    );

    if (existing) {
      throw new Error(`Invoice already exists for this lease and period (${input.billingMonth}/${input.billingYear})`);
    }

    const subtotal = input.lineItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const totalAmount = subtotal + input.taxAmount;

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const invoice = await db.invoice.create({
      data: {
        organizationId,
        invoiceNumber,
        leaseId: input.leaseId,
        billingMonth: input.billingMonth,
        billingYear: input.billingYear,
        subtotal: new Prisma.Decimal(subtotal),
        taxAmount: new Prisma.Decimal(input.taxAmount),
        totalAmount: new Prisma.Decimal(totalAmount),
        balanceDue: new Prisma.Decimal(totalAmount),
        dueDate: input.dueDate,
        status: InvoiceStatus.DRAFT,
        lineItems: {
          create: input.lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            amount: new Prisma.Decimal(item.unitPrice * item.quantity),
          })),
        },
      },
    });

    await createAuditLog({
      action: "INVOICE_CREATED",
      entity: "Invoice",
      entityId: invoice.id,
      newData: invoice,
    });

    return invoice;
  }

  async postInvoice(organizationId: string, invoiceId: string) {
    await checkPermission("update", "invoice");

    const invoice = await invoiceRepository.findById(invoiceId, organizationId);
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.status !== InvoiceStatus.DRAFT) throw new Error("Only DRAFT invoices can be posted");

    const updated = await invoiceRepository.update(invoiceId, organizationId, {
      status: InvoiceStatus.POSTED,
      issuedDate: new Date(),
    });

    await createAuditLog({
      action: "INVOICE_POSTED",
      entity: "Invoice",
      entityId: invoiceId,
      newData: { status: InvoiceStatus.POSTED },
    });

    return updated;
  }

  async cancelInvoice(organizationId: string, invoiceId: string) {
    await checkPermission("update", "invoice");

    const invoice = await invoiceRepository.findById(invoiceId, organizationId);
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.status === InvoiceStatus.PAID) throw new Error("Cannot cancel a paid invoice");

    const updated = await invoiceRepository.update(invoiceId, organizationId, {
      status: InvoiceStatus.CANCELLED,
    });

    await createAuditLog({
      action: "INVOICE_CANCELLED",
      entity: "Invoice",
      entityId: invoiceId,
      newData: { status: InvoiceStatus.CANCELLED },
    });

    return updated;
  }

  async markOverdue(organizationId: string, invoiceId: string) {
    await checkPermission("update", "invoice");

    const invoice = await invoiceRepository.findById(invoiceId, organizationId);
    if (!invoice) throw new Error("Invoice not found");

    if (invoice.status !== InvoiceStatus.POSTED && invoice.status !== InvoiceStatus.PARTIALLY_PAID) {
        return invoice;
    }

    if (new Date() > invoice.dueDate) {
      const updated = await invoiceRepository.update(invoiceId, organizationId, {
        status: InvoiceStatus.OVERDUE,
      });

      await createAuditLog({
        action: "INVOICE_MARKED_OVERDUE",
        entity: "Invoice",
        entityId: invoiceId,
        newData: { status: InvoiceStatus.OVERDUE },
      });

      return updated;
    }

    return invoice;
  }

  async recordPayment(organizationId: string, invoiceId: string, amount: number) {
    await checkPermission("create", "payment");

    return await db.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId, organizationId },
      });

      if (!invoice) throw new Error("Invoice not found");

      const newAmountPaid = Number(invoice.amountPaid) + amount;
      const newBalanceDue = Number(invoice.totalAmount) - newAmountPaid;

      let newStatus: InvoiceStatus = InvoiceStatus.PARTIALLY_PAID;
      if (newBalanceDue <= 0) {
        newStatus = InvoiceStatus.PAID;
      }

      const updated = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: new Prisma.Decimal(newAmountPaid),
          balanceDue: new Prisma.Decimal(newBalanceDue),
          status: newStatus,
        },
      });

      await createAuditLog({
        action: "PAYMENT_RECORDED",
        entity: "Invoice",
        entityId: invoiceId,
        newData: { amount, newBalanceDue, newStatus },
      });

      return updated;
    });
  }

  async getDashboardStats(organizationId: string) {
    await checkPermission("read", "invoice");
    return invoiceRepository.getDashboardStats(organizationId);
  }
}

export const invoiceService = new InvoiceService();
