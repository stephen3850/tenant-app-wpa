import { db } from "@/lib/db";
import { PaymentStatus, LedgerEntryType } from "@prisma/client";
import { tenantLedgerService } from "@/features/finance/services/tenant-ledger-service";
import { allocationService } from "@/features/finance/services/allocation-service";
import { creditBalanceService } from "@/features/finance/services/credit-balance-service";
import { systemAuditLog } from "@/lib/audit";

export class ReconciliationService {
  async reconcileSTK(checkoutRequestId: string, mpesaReceiptNumber: string, amount: number, phoneNumber: string, transactionDate: Date) {
      return db.$transaction(async (tx) => {
          // Idempotency check
          const existingPayment = await tx.payment.findUnique({
              where: { transactionRef: mpesaReceiptNumber }
          });
          if (existingPayment) return existingPayment;

          const transaction = await tx.mpesaTransaction.findUnique({
              where: { checkoutRequestId }
          });

          if (!transaction) throw new Error(`M-Pesa transaction not found for ${checkoutRequestId}`);
          if (transaction.status === "SUCCESS") return;

          const organizationId = transaction.organizationId;
          const tenantId = transaction.tenantId;

          if (!tenantId) throw new Error("Tenant ID not found in transaction");

          const receiptNumber = `RCP-${Date.now()}`;

          // 1. Create Payment record
          const payment = await tx.payment.create({
              data: {
                  organizationId,
                  tenantId,
                  amount: amount,
                  method: "MPESA",
                  transactionRef: mpesaReceiptNumber,
                  receiptNumber,
                  paymentDate: transactionDate,
                  notes: `M-Pesa STK Push: ${mpesaReceiptNumber}`,
                  status: "COMPLETED",
              }
          });

          // 2. Update M-Pesa Transaction status
          await tx.mpesaTransaction.update({
              where: { id: transaction.id },
              data: {
                  status: "SUCCESS",
                  mpesaReceiptNumber,
                  amount: amount,
                  transactionDate,
              }
          });

          // 3. Ledger Entry
          await tenantLedgerService.recordEntry(tx, {
              organizationId,
              tenantId,
              type: LedgerEntryType.PAYMENT,
              description: `M-Pesa Payment (${mpesaReceiptNumber})`,
              credit: amount,
              reference: mpesaReceiptNumber,
              paymentId: payment.id,
          });

          // 4. Auto-Allocation
          const overpayment = await allocationService.allocateAutomatically(
              tx,
              organizationId,
              tenantId,
              payment.id,
              amount
          );

          // 5. Overpayment to Credit Balance
          if (overpayment > 0) {
              await creditBalanceService.addCredit(tenantId, organizationId, overpayment, tx);
              await tenantLedgerService.recordEntry(tx, {
                  organizationId,
                  tenantId,
                  type: LedgerEntryType.CREDIT,
                  description: `Overpayment applied to credit balance`,
                  credit: overpayment,
                  paymentId: payment.id,
              });
          }

          await systemAuditLog({
              action: "MPESA_PAYMENT_RECONCILED",
              entity: "Payment",
              entityId: payment.id,
              organizationId,
              newData: { mpesaReceiptNumber, amount }
          });

          return payment;
      });
  }

  async reconcileC2B(organizationId: string, mpesaReceiptNumber: string, amount: number, phoneNumber: string, transactionDate: Date, accountReference: string) {
      const tenant = await db.tenant.findUnique({
          where: { tenantCode: accountReference }
      });

      if (!tenant) throw new Error(`Tenant not found for account reference: ${accountReference}`);

      return db.$transaction(async (tx) => {
          // Idempotency check
          const existingPayment = await tx.payment.findUnique({
              where: { transactionRef: mpesaReceiptNumber }
          });
          if (existingPayment) return existingPayment;

          const receiptNumber = `RCP-${Date.now()}`;

          await tx.mpesaTransaction.create({
              data: {
                  organizationId,
                  tenantId: tenant.id,
                  mpesaReceiptNumber,
                  amount,
                  phoneNumber,
                  transactionDate,
                  status: "SUCCESS",
                  transactionType: "C2B",
                  accountReference,
              }
          });

          const payment = await tx.payment.create({
              data: {
                  organizationId,
                  tenantId: tenant.id,
                  amount,
                  method: "MPESA",
                  transactionRef: mpesaReceiptNumber,
                  receiptNumber,
                  paymentDate: transactionDate,
                  notes: `M-Pesa C2B: ${mpesaReceiptNumber}`,
                  status: "COMPLETED",
              }
          });

          await tenantLedgerService.recordEntry(tx, {
              organizationId,
              tenantId: tenant.id,
              type: LedgerEntryType.PAYMENT,
              description: `M-Pesa Payment C2B (${mpesaReceiptNumber})`,
              credit: amount,
              reference: mpesaReceiptNumber,
              paymentId: payment.id,
          });

          const overpayment = await allocationService.allocateAutomatically(
              tx,
              organizationId,
              tenant.id,
              payment.id,
              amount
          );

          if (overpayment > 0) {
              await creditBalanceService.addCredit(tenant.id, organizationId, overpayment, tx);
              await tenantLedgerService.recordEntry(tx, {
                  organizationId,
                  tenantId: tenant.id,
                  type: LedgerEntryType.CREDIT,
                  description: `Overpayment applied to credit balance`,
                  credit: overpayment,
                  paymentId: payment.id,
              });
          }

          await systemAuditLog({
              action: "MPESA_C2B_RECONCILED",
              entity: "Payment",
              entityId: payment.id,
              organizationId,
              newData: { mpesaReceiptNumber, amount }
          });

          return payment;
      });
  }
}

export const reconciliationService = new ReconciliationService();
