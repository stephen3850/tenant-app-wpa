import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { paymentRepository } from "../repositories/payment-repository";
import { tenantLedgerService } from "./tenant-ledger-service";
import { allocationService } from "./allocation-service";
import { creditBalanceService } from "./credit-balance-service";
import { RecordPaymentInput } from "../schemas/payment-schemas";
import { Prisma, PaymentStatus, LedgerEntryType } from "@prisma/client";

export class PaymentService {
  async recordPayment(organizationId: string, input: RecordPaymentInput) {
    await checkPermission("create", "payment");

    return await db.$transaction(async (tx) => {
      const receiptNumber = `RCP-${Date.now()}`;

      // 1. Create Payment
      const payment = await tx.payment.create({
        data: {
          organizationId,
          tenantId: input.tenantId,
          leaseId: input.leaseId,
          amount: new Prisma.Decimal(input.amount),
          method: input.method,
          transactionRef: input.transactionRef,
          receiptNumber,
          paymentDate: input.paymentDate || new Date(),
          notes: input.notes,
          status: PaymentStatus.COMPLETED,
        },
      });

      // 2. Ledger Entry (Credit)
      await tenantLedgerService.recordEntry(tx, {
        organizationId,
        tenantId: input.tenantId,
        type: LedgerEntryType.PAYMENT,
        description: `Payment Received (${receiptNumber})`,
        credit: input.amount,
        reference: receiptNumber,
        paymentId: payment.id,
      });

      // 3. Auto-Allocation
      const overpayment = await allocationService.allocateAutomatically(
        tx,
        organizationId,
        input.tenantId,
        payment.id,
        input.amount
      );

      // 4. Overpayment to Credit Balance
      if (overpayment > 0) {
        await creditBalanceService.addCredit(input.tenantId, organizationId, overpayment, tx);
        await tenantLedgerService.recordEntry(tx, {
          organizationId,
          tenantId: input.tenantId,
          type: LedgerEntryType.CREDIT,
          description: `Overpayment applied to credit balance`,
          credit: overpayment,
          paymentId: payment.id,
        });
      }

      await createAuditLog({
        action: "PAYMENT_RECORDED",
        entity: "Payment",
        entityId: payment.id,
        newData: payment,
      });

      return payment;
    });
  }

  async reversePayment(organizationId: string, paymentId: string, reason: string) {
    await checkPermission("update", "payment");

    return await db.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId, organizationId },
        include: { allocations: true }
      });

      if (!payment || payment.status === PaymentStatus.REVERSED) {
        throw new Error("Invalid payment for reversal");
      }

      // 1. Reverse Allocations
      await allocationService.reverseAllocations(tx, paymentId);

      // 2. Adjust Ledger (Debit to offset previous credit)
      await tenantLedgerService.recordEntry(tx, {
        organizationId,
        tenantId: payment.tenantId,
        type: LedgerEntryType.REVERSAL,
        description: `Payment Reversal: ${reason} (${payment.receiptNumber})`,
        debit: Number(payment.amount),
        reference: payment.receiptNumber || undefined,
        paymentId: payment.id,
      });

      // 3. Update Status
      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.REVERSED, notes: `${payment.notes || ""}\nReversed: ${reason}` },
      });

      // 4. Adjust Credit Balance if overpayment was made
      const allocatedTotal = payment.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
      const creditAmount = Number(payment.amount) - allocatedTotal;
      if (creditAmount > 0) {
        await creditBalanceService.addCredit(payment.tenantId, organizationId, -creditAmount, tx);
      }

      await createAuditLog({
        action: "PAYMENT_REVERSED",
        entity: "Payment",
        entityId: paymentId,
        newData: { reason },
      });

      return updated;
    });
  }

  async applyCredit(organizationId: string, tenantId: string, invoiceId: string, amount: number) {
    await checkPermission("create", "payment");

    return await db.$transaction(async (tx) => {
      // 1. Use Credit
      await creditBalanceService.useCredit(tenantId, organizationId, amount, tx);

      // 2. Record Ledger Entry (Debit to represent using the credit? Or neutral?)
      // Usually, using a credit is like a payment.
      await tenantLedgerService.recordEntry(tx, {
        organizationId,
        tenantId,
        type: LedgerEntryType.CREDIT,
        description: `Credit applied to invoice ${invoiceId}`,
        credit: amount,
        invoiceId,
      });

      // 3. Update Invoice
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          balanceDue: { decrement: amount },
          amountPaid: { increment: amount },
          status: "PARTIALLY_PAID", // Logic for PAID should be checked
        },
      });

      await createAuditLog({
        action: "CREDIT_APPLIED",
        entity: "Tenant",
        entityId: tenantId,
        newData: { invoiceId, amount },
      });
    });
  }

  async getMetrics(organizationId: string) {
    await checkPermission("read", "payment");
    return paymentRepository.getMetrics(organizationId);
  }
}

export const paymentService = new PaymentService();
