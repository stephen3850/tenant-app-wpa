import { STKPushInput } from "../schemas/mpesa-schemas";
import { paymentRouter } from "@/lib/payments/router";
import { paymentProviderFactory } from "@/lib/payments/provider-factory";
import { db } from "@/lib/db";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export class MpesaService {
  async initiateSTKPush(organizationId: string, input: STKPushInput) {
    const invoiceId = input.invoiceIds?.[0];

    const account = await paymentRouter.resolvePaymentAccount({
      organizationId,
      invoiceId,
      paymentMethod: PaymentMethod.MPESA,
    });

    const pendingPayment = await db.payment.create({
      data: {
        organizationId,
        tenantId: input.tenantId || "",
        invoiceId,
        paymentAccountId: account.id,
        amount: input.amount,
        method: PaymentMethod.MPESA,
        status: PaymentStatus.PENDING,
        notes: `STK Push via ${account.displayName}`,
      },
    });

    const mpesaTx = await db.mpesaTransaction.create({
      data: {
        organizationId,
        tenantId: input.tenantId,
        invoiceId,
        paymentAccountId: account.id,
        paymentId: pendingPayment.id,
        amount: input.amount,
        phoneNumber: input.phoneNumber,
        accountReference: input.accountReference,
        status: "PENDING",
        transactionType: "STK_PUSH",
      },
    });

    const provider = paymentProviderFactory.getProvider("MPESA");
    const result = await provider.initiatePayment(
      {
        amount: input.amount,
        phoneNumber: input.phoneNumber,
        accountReference: input.accountReference,
        paymentAccountId: account.id,
        organizationId,
        tenantId: input.tenantId,
        invoiceId,
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
}

export const mpesaService = new MpesaService();
