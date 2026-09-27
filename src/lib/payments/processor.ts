import { db } from "@/lib/db";
import { PaymentStatus, LedgerEntryType, PaymentMethod } from "@prisma/client";
import { tenantLedgerService } from "@/features/finance/services/tenant-ledger-service";
import { allocationService } from "@/features/finance/services/allocation-service";
import { creditBalanceService } from "@/features/finance/services/credit-balance-service";
import { systemAuditLog } from "@/lib/audit";

export class PaymentProcessor {
  /**
   * Processes a PaymentEvent idempotently.
   */
  async processEvent(eventId: string): Promise<void> {
    const event = await db.paymentEvent.findUnique({
      where: { id: eventId },
    });

    if (!event || event.processingStatus === "PROCESSED") {
      return;
    }

    try {
      const payload = event.payload as any;

      if (event.eventType === "STK_PUSH_CALLBACK") {
        await this.processStkPushCallback(event.id, payload);
      } else if (event.eventType === "C2B_CONFIRMATION") {
        await this.processC2bConfirmation(event.id, payload);
      } else if (event.eventType === "C2B_VALIDATION") {
        await this.processC2bValidation(event.id, payload);
      }

      await db.paymentEvent.update({
        where: { id: eventId },
        data: {
          processingStatus: "PROCESSED",
          processedAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error(`[PaymentProcessor] Error processing event ${eventId}:`, error);
      await db.paymentEvent.update({
        where: { id: eventId },
        data: {
          processingStatus: "FAILED",
        },
      });
      throw error;
    }
  }

  private async processStkPushCallback(eventId: string, payload: any) {
    const stkCallback = payload?.Body?.stkCallback;
    if (!stkCallback) return;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Retrieve pending MpesaTransaction
    const transaction = await db.mpesaTransaction.findUnique({
      where: { checkoutRequestId },
    });

    if (!transaction) {
      console.warn(`[PaymentProcessor] No MpesaTransaction found for CheckoutRequestID ${checkoutRequestId}`);
      return;
    }

    if (transaction.status === "SUCCESS") {
      // Already processed idempotently
      return;
    }

    if (resultCode === 0) {
      const items = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value?.toString();
      const amount = Number(items.find((i: any) => i.Name === "Amount")?.Value) || Number(transaction.amount);
      const phoneNumber = items.find((i: any) => i.Name === "PhoneNumber")?.Value?.toString() || transaction.phoneNumber;
      const transactionDateStr = items.find((i: any) => i.Name === "TransactionDate")?.Value?.toString();

      const transactionDate = transactionDateStr
        ? new Date(
            `${transactionDateStr.slice(0, 4)}-${transactionDateStr.slice(4, 6)}-${transactionDateStr.slice(6, 8)}T${transactionDateStr.slice(8, 10)}:${transactionDateStr.slice(10, 12)}:${transactionDateStr.slice(12, 14)}`
          )
        : new Date();

      if (!mpesaReceiptNumber) {
        throw new Error("Missing MpesaReceiptNumber in successful callback metadata");
      }

      await db.$transaction(async (tx) => {
        // Idempotency check on Payment
        let payment = await tx.payment.findUnique({
          where: { transactionRef: mpesaReceiptNumber },
        });

        if (!payment) {
          const receiptNumber = `RCP-${Date.now()}`;

          payment = await tx.payment.create({
            data: {
              organizationId: transaction.organizationId,
              tenantId: transaction.tenantId || "",
              paymentAccountId: transaction.paymentAccountId,
              amount,
              method: PaymentMethod.MPESA,
              status: PaymentStatus.COMPLETED,
              transactionRef: mpesaReceiptNumber,
              receiptNumber,
              paymentDate: transactionDate,
              invoiceId: transaction.invoiceId,
              notes: `M-Pesa STK Push Payment: ${mpesaReceiptNumber}`,
            },
          });

          // Create Receipt
          await tx.receipt.create({
            data: {
              paymentId: payment.id,
            },
          });
        }

        // Update MpesaTransaction
        await tx.mpesaTransaction.update({
          where: { id: transaction.id },
          data: {
            status: "SUCCESS",
            mpesaReceiptNumber,
            amount,
            phoneNumber,
            resultCode,
            resultDesc,
            transactionDate,
            paymentId: payment.id,
            rawCallback: payload,
          },
        });

        // Update Tenant Ledger & Invoice allocations if tenant exists
        if (transaction.tenantId) {
          await tenantLedgerService.recordEntry(tx, {
            organizationId: transaction.organizationId,
            tenantId: transaction.tenantId,
            type: LedgerEntryType.PAYMENT,
            description: `M-Pesa Payment Received (${mpesaReceiptNumber})`,
            credit: amount,
            reference: mpesaReceiptNumber,
            paymentId: payment.id,
            invoiceId: transaction.invoiceId || undefined,
          });

          // Auto allocation to invoices
          const overpayment = await allocationService.allocateAutomatically(
            tx,
            transaction.organizationId,
            transaction.tenantId,
            payment.id,
            amount
          );

          if (overpayment > 0) {
            await creditBalanceService.addCredit(transaction.tenantId, transaction.organizationId, overpayment, tx);
            await tenantLedgerService.recordEntry(tx, {
              organizationId: transaction.organizationId,
              tenantId: transaction.tenantId,
              type: LedgerEntryType.CREDIT,
              description: `Overpayment applied to credit balance`,
              credit: overpayment,
              paymentId: payment.id,
            });
          }
        }

        await systemAuditLog({
          action: "MPESA_STK_PAYMENT_PROCESSED",
          entity: "Payment",
          entityId: payment.id,
          organizationId: transaction.organizationId,
          newData: { mpesaReceiptNumber, amount, checkoutRequestId },
        });
      });
    } else {
      // Failed STK Push
      await db.mpesaTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          resultCode,
          resultDesc,
          rawCallback: payload,
        },
      });

      if (transaction.paymentId) {
        await db.payment.update({
          where: { id: transaction.paymentId },
          data: { status: PaymentStatus.FAILED },
        });
      }
    }
  }

  private async processC2bConfirmation(eventId: string, payload: any) {
    const { TransID, TransAmount, MSISDN, BillRefNumber, BusinessShortCode } = payload;
    if (!TransID) return;

    // Find account by shortcode
    const account = await db.paymentAccount.findFirst({
      where: { shortCode: BusinessShortCode, status: "ACTIVE" },
    });

    // Find tenant by account reference
    const tenant = await db.tenant.findFirst({
      where: {
        OR: [
          { tenantCode: BillRefNumber },
          { id: BillRefNumber },
        ],
      },
    });

    const organizationId = account?.organizationId || tenant?.organizationId;
    if (!organizationId) {
      console.warn(`[PaymentProcessor] C2B Confirmation could not resolve organizationId for ${TransID}`);
      return;
    }

    await db.$transaction(async (tx) => {
      // Check duplicate
      let payment = await tx.payment.findUnique({
        where: { transactionRef: TransID },
      });

      if (!payment) {
        const receiptNumber = `RCP-${Date.now()}`;
        const amount = Number(TransAmount);

        if (tenant) {
          payment = await tx.payment.create({
            data: {
              organizationId,
              tenantId: tenant.id,
              paymentAccountId: account?.id,
              amount,
              method: PaymentMethod.MPESA,
              status: PaymentStatus.COMPLETED,
              transactionRef: TransID,
              receiptNumber,
              notes: `M-Pesa C2B Payment: ${TransID}`,
            },
          });

          await tx.receipt.create({
            data: { paymentId: payment.id },
          });

          await tenantLedgerService.recordEntry(tx, {
            organizationId,
            tenantId: tenant.id,
            type: LedgerEntryType.PAYMENT,
            description: `M-Pesa C2B Payment Received (${TransID})`,
            credit: amount,
            reference: TransID,
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
        }
      }

      // Record MpesaTransaction for C2B
      const existingMpesaTx = await tx.mpesaTransaction.findUnique({
        where: { mpesaReceiptNumber: TransID },
      });

      if (!existingMpesaTx) {
        await tx.mpesaTransaction.create({
          data: {
            organizationId,
            tenantId: tenant?.id,
            paymentAccountId: account?.id,
            paymentId: payment?.id,
            mpesaReceiptNumber: TransID,
            amount: Number(TransAmount),
            phoneNumber: MSISDN,
            accountReference: BillRefNumber,
            transactionType: "C2B",
            status: "SUCCESS",
            rawCallback: payload,
          },
        });
      }
    });
  }

  private async processC2bValidation(eventId: string, payload: any) {
    // Validation is processed synchronously in the webhook response
    return;
  }
}

export const paymentProcessor = new PaymentProcessor();
