import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { paymentRouter } from "@/lib/payments/router";
import { paymentProviderFactory } from "@/lib/payments/provider-factory";
import { paymentProcessor } from "@/lib/payments/processor";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export class MpesaService {
  async initiateStkPush(params: {
    amount: number;
    phoneNumber: string;
    organizationId: string;
    tenantId?: string;
    invoiceId?: string;
  }) {
    const account = await paymentRouter.resolvePaymentAccount({
      organizationId: params.organizationId,
      invoiceId: params.invoiceId,
      paymentMethod: PaymentMethod.MPESA,
    });

    const accountRef = params.invoiceId || "TMS-RENT";

    const pendingPayment = await db.payment.create({
      data: {
        organizationId: params.organizationId,
        tenantId: params.tenantId || "",
        invoiceId: params.invoiceId,
        paymentAccountId: account.id,
        amount: params.amount,
        method: PaymentMethod.MPESA,
        status: PaymentStatus.PENDING,
        notes: `STK Push via ${account.displayName}`,
      },
    });

    const mpesaTx = await db.mpesaTransaction.create({
      data: {
        organizationId: params.organizationId,
        tenantId: params.tenantId,
        invoiceId: params.invoiceId,
        paymentAccountId: account.id,
        paymentId: pendingPayment.id,
        amount: params.amount,
        phoneNumber: params.phoneNumber,
        accountReference: accountRef,
        status: "PENDING",
      },
    });

    const provider = paymentProviderFactory.getProvider("MPESA");
    const result = await provider.initiatePayment(
      {
        amount: params.amount,
        phoneNumber: params.phoneNumber,
        accountReference: accountRef,
        paymentAccountId: account.id,
        organizationId: params.organizationId,
        tenantId: params.tenantId,
        invoiceId: params.invoiceId,
      },
      account
    );

    if (result.success) {
      await db.payment.update({
        where: { id: pendingPayment.id },
        data: { status: PaymentStatus.STK_REQUESTED },
      });

      await db.mpesaTransaction.update({
        where: { id: mpesaTx.id },
        data: {
          merchantRequestId: result.merchantRequestId,
          checkoutRequestId: result.checkoutRequestId,
          status: "STK_REQUESTED",
        },
      });

      await createAuditLog({
        action: "STK_PUSH_INITIATED",
        entity: "MpesaTransaction",
        entityId: result.checkoutRequestId || pendingPayment.id,
        organizationId: params.organizationId,
        newData: {
          amount: params.amount,
          checkoutRequestId: result.checkoutRequestId,
        },
      });

      return {
        ResponseCode: "0",
        MerchantRequestID: result.merchantRequestId,
        CheckoutRequestID: result.checkoutRequestId,
        ResponseDescription: result.responseDescription,
        CustomerMessage: result.customerMessage,
      };
    } else {
      await db.payment.update({
        where: { id: pendingPayment.id },
        data: { status: PaymentStatus.FAILED },
      });

      await db.mpesaTransaction.update({
        where: { id: mpesaTx.id },
        data: { status: "FAILED", resultDesc: result.responseDescription },
      });

      return {
        ResponseCode: "1",
        ResponseDescription: result.responseDescription,
      };
    }
  }

  async handleStkCallback(payload: any) {
    const event = await db.paymentEvent.create({
      data: {
        provider: "MPESA",
        eventType: "STK_PUSH_CALLBACK",
        providerEventId: payload?.Body?.stkCallback?.CheckoutRequestID,
        payload,
        processingStatus: "PENDING",
      },
    });

    await paymentProcessor.processEvent(event.id);
  }

  async handleC2BConfirmation(payload: any) {
    const event = await db.paymentEvent.create({
      data: {
        provider: "MPESA",
        eventType: "C2B_CONFIRMATION",
        providerEventId: payload?.TransID,
        payload,
        processingStatus: "PENDING",
      },
    });

    await paymentProcessor.processEvent(event.id);
  }

  async getMetrics(organizationId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    const [todayTransactions, totalSuccess, totalFailed] = await Promise.all([
      db.mpesaTransaction.aggregate({
        where: { organizationId, status: "SUCCESS", createdAt: { gte: startOfDay } },
        _sum: { amount: true },
      }),
      db.mpesaTransaction.count({ where: { organizationId, status: "SUCCESS" } }),
      db.mpesaTransaction.count({ where: { organizationId, status: "FAILED" } }),
    ]);

    const successRate = (totalSuccess / (totalSuccess + totalFailed || 1)) * 100;

    return {
      mpesaCollectionsToday: todayTransactions._sum.amount || 0,
      successRate: Math.round(successRate),
      failedTransactions: totalFailed,
    };
  }
}

export const mpesaService = new MpesaService();
