import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { paymentService } from "./payment-service";
import { PaymentMethod } from "@prisma/client";

export class MpesaService {
  private consumerKey = process.env.MPESA_CONSUMER_KEY!;
  private consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
  private shortCode = process.env.MPESA_PAYBILL!;
  private passkey = process.env.MPESA_PASSKEY!;
  private callbackUrl = process.env.MPESA_CALLBACK_URL!;

  private async getAccessToken() {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    const data = await response.json();
    return data.access_token;
  }

  async initiateStkPush(params: {
    amount: number;
    phoneNumber: string;
    organizationId: string;
    tenantId?: string;
    invoiceId?: string;
  }) {
    const token = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: params.amount,
          PartyA: params.phoneNumber,
          PartyB: this.shortCode,
          PhoneNumber: params.phoneNumber,
          CallBackURL: `${this.callbackUrl}/api/webhooks/mpesa/stk-callback`,
          AccountReference: params.invoiceId || "TMS-RENT",
          TransactionDesc: "Rent Payment",
        }),
      }
    );

    const data = await response.json();

    if (data.ResponseCode === "0") {
      await db.mpesaTransaction.create({
        data: {
          organizationId: params.organizationId,
          tenantId: params.tenantId,
          invoiceId: params.invoiceId,
          merchantRequestId: data.MerchantRequestID,
          checkoutRequestId: data.CheckoutRequestID,
          amount: params.amount,
          phoneNumber: params.phoneNumber,
          status: "PENDING",
        },
      });

      await createAuditLog({
        action: "STK_PUSH_INITIATED",
        entity: "MpesaTransaction",
        entityId: data.CheckoutRequestID,
        newData: data,
      });
    }

    return data;
  }

  async handleStkCallback(payload: any) {
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = payload.stkCallback;

    await db.mpesaCallbackLog.create({
      data: { topic: "STK_PUSH", payload },
    });

    const transaction = await db.mpesaTransaction.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
    });

    if (!transaction) {
      console.error(`M-Pesa transaction not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return;
    }

    if (ResultCode === 0) {
      const metadata = payload.stkCallback.CallbackMetadata.Item;
      const mpesaReceiptNumber = metadata.find((i: any) => i.Name === "MpesaReceiptNumber").Value;
      const amount = metadata.find((i: any) => i.Name === "Amount").Value;

      await db.mpesaTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          mpesaReceiptNumber,
          rawCallback: payload,
        },
      });

      // Trigger Reconciliation
      if (transaction.tenantId) {
        await paymentService.recordPayment(transaction.organizationId, {
          tenantId: transaction.tenantId,
          amount: Number(amount),
          method: PaymentMethod.MPESA,
          transactionRef: mpesaReceiptNumber,
          paymentDate: new Date(),
          autoAllocate: true,
          notes: `M-Pesa STK Push: ${mpesaReceiptNumber}`,
        });
      }

      await createAuditLog({
        action: "MPESA_PAYMENT_CONFIRMED",
        entity: "MpesaTransaction",
        entityId: transaction.id,
        newData: { mpesaReceiptNumber, amount },
      });
    } else {
      await db.mpesaTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          rawCallback: payload,
        },
      });

      await createAuditLog({
        action: "MPESA_PAYMENT_FAILED",
        entity: "MpesaTransaction",
        entityId: transaction.id,
        newData: { ResultCode, ResultDesc },
      });
    }
  }

  async handleC2BConfirmation(payload: any) {
    await db.mpesaCallbackLog.create({
      data: { topic: "C2B_CONFIRMATION", payload },
    });

    const { TransID, TransAmount, MSISDN, BillRefNumber, BusinessShortCode } = payload;

    // Duplicate check
    const existing = await db.mpesaTransaction.findUnique({
      where: { mpesaReceiptNumber: TransID },
    });

    if (existing) {
        await createAuditLog({
            action: "MPESA_DUPLICATE_PREVENTED",
            entity: "MpesaTransaction",
            entityId: TransID,
            newData: { TransID }
        });
        return;
    }

    // Simple reconciliation by BillRefNumber (assuming it's tenant code or invoice number)
    // In production, you'd match against Tenant.tenantCode or Invoice.invoiceNumber
    const tenant = await db.tenant.findFirst({
        where: { tenantCode: BillRefNumber }
    });

    const organizationId = tenant?.organizationId || process.env.DEFAULT_ORG_ID!;

    await db.mpesaTransaction.create({
      data: {
        organizationId,
        tenantId: tenant?.id,
        mpesaReceiptNumber: TransID,
        amount: Number(TransAmount),
        phoneNumber: MSISDN,
        transactionType: "C2B",
        status: "SUCCESS",
        rawCallback: payload,
      },
    });

    if (tenant) {
      await paymentService.recordPayment(organizationId, {
        tenantId: tenant.id,
        amount: Number(TransAmount),
        method: PaymentMethod.MPESA,
        transactionRef: TransID,
        paymentDate: new Date(),
        autoAllocate: true,
        notes: `M-Pesa C2B: ${TransID}`,
      });
    }
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
