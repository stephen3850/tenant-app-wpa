import { Prisma, InvoiceStatus } from "@prisma/client";
import { paymentAllocationRepository } from "../repositories/payment-allocation-repository";

export class AllocationService {
  async allocateAutomatically(
    tx: Prisma.TransactionClient,
    organizationId: string,
    tenantId: string,
    paymentId: string,
    amount: number
  ) {
    let remaining = amount;

    const invoices = await tx.invoice.findMany({
      where: {
        organizationId,
        lease: { tenantId },
        status: { in: [InvoiceStatus.POSTED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] },
      },
      orderBy: { dueDate: "asc" },
    });

    for (const invoice of invoices) {
      if (remaining <= 0) break;

      const balanceDue = Number(invoice.balanceDue);
      const allocation = Math.min(remaining, balanceDue);

      await paymentAllocationRepository.create({
        organizationId,
        paymentId,
        invoiceId: invoice.id,
        amount: new Prisma.Decimal(allocation),
      }, tx);

      const newBalance = balanceDue - allocation;
      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          balanceDue: new Prisma.Decimal(newBalance),
          amountPaid: { increment: allocation },
          status: newBalance <= 0 ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID,
        },
      });

      remaining -= allocation;
    }

    return remaining; // Overpayment/Credit
  }

  async reverseAllocations(tx: Prisma.TransactionClient, paymentId: string) {
    const allocations = await paymentAllocationRepository.findByPaymentId(paymentId);

    for (const allocation of allocations) {
      await tx.invoice.update({
        where: { id: allocation.invoiceId },
        data: {
          balanceDue: { increment: Number(allocation.amount) },
          amountPaid: { decrement: Number(allocation.amount) },
          status: InvoiceStatus.POSTED, // Simplistic, might have been PARTIALLY_PAID
        },
      });
    }

    await paymentAllocationRepository.deleteMany(paymentId, tx);
  }
}

export const allocationService = new AllocationService();
