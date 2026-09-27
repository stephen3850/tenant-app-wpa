import { PaymentAccount } from "@prisma/client";
import {
  PaymentProvider,
  InitiatePaymentParams,
  InitiatePaymentResult,
  PaymentStatusParams,
  PaymentStatusResult,
  PaymentCallbackResult,
  MpesaCredentialsConfig,
} from "../types";
import { decryptCredentials, maskPhoneNumber } from "@/lib/encryption";
import { mpesaTokenManager } from "../token-manager";

export class MpesaProvider implements PaymentProvider {
  readonly providerName = "MPESA";

  private getCredentialsConfig(account: PaymentAccount): MpesaCredentialsConfig {
    const credentials = decryptCredentials<MpesaCredentialsConfig>(account.credentialsEncrypted);
    const env = (credentials.environment || process.env.MPESA_ENVIRONMENT || "sandbox") as "sandbox" | "production";

    const consumerKey = credentials.consumerKey || process.env.MPESA_CONSUMER_KEY || "";
    const consumerSecret = credentials.consumerSecret || process.env.MPESA_CONSUMER_SECRET || "";

    let shortCode = credentials.shortCode || account.shortCode || process.env.MPESA_PAYBILL || process.env.MPESA_SHORTCODE || "";
    if (!shortCode || shortCode === "N/A") {
      shortCode = env === "sandbox" ? "174379" : "";
    }

    let passkey = credentials.passkey || process.env.MPESA_PASSKEY || "";
    if (!passkey || passkey === "N/A") {
      passkey = env === "sandbox" ? "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" : "";
    }

    return {
      consumerKey,
      consumerSecret,
      shortCode,
      passkey,
      accountType: (credentials.accountType || account.accountType || "PAYBILL") as "TILL" | "PAYBILL",
      environment: env,
    };
  }

  private getBaseUrl(environment: "sandbox" | "production"): string {
    return environment === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";
  }

  async initiatePayment(
    params: InitiatePaymentParams,
    account: PaymentAccount
  ): Promise<InitiatePaymentResult> {
    const config = this.getCredentialsConfig(account);
    const token = await mpesaTokenManager.getAccessToken(account.id, config);

    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const passkey = config.passkey || "";
    const password = Buffer.from(`${config.shortCode}${passkey}${timestamp}`).toString("base64");

    const baseUrl = this.getBaseUrl(config.environment);
    const endpoint = `${baseUrl}/mpesa/stkpush/v1/processrequest`;

    // Transaction Type depends on account type
    const transactionType =
      config.accountType === "TILL"
        ? "CustomerBuyGoodsOnline"
        : "CustomerPayBillOnline";

    const callbackUrl =
      params.callbackUrl ||
      `${process.env.NEXT_PUBLIC_APP_URL || "https://app.tms.com"}/api/webhooks/mpesa`;

    // PartyB for Till is Till number; for PayBill it is Shortcode
    const payload = {
      BusinessShortCode: config.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transactionType,
      Amount: Math.round(params.amount),
      PartyA: params.phoneNumber,
      PartyB: config.shortCode,
      PhoneNumber: params.phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: params.accountReference || "RENT",
      TransactionDesc: params.transactionDesc || `Rent Payment - ${params.accountReference}`,
    };

    console.log(`[MpesaProvider] Initiating STK Push for Org ${account.organizationId}, Account ${account.id}, Phone ${maskPhoneNumber(params.phoneNumber)}`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.ResponseCode === "0") {
      return {
        success: true,
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage,
        rawResponse: data,
      };
    } else {
      return {
        success: false,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription || "M-Pesa STK Push rejected",
        error: data.errorMessage || data.ResponseDescription,
        rawResponse: data,
      };
    }
  }

  async getPaymentStatus(
    params: PaymentStatusParams,
    account: PaymentAccount
  ): Promise<PaymentStatusResult> {
    if (!params.checkoutRequestId) {
      throw new Error("checkoutRequestId required for M-Pesa status query");
    }

    const config = this.getCredentialsConfig(account);
    const token = await mpesaTokenManager.getAccessToken(account.id, config);

    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const passkey = config.passkey || "";
    const password = Buffer.from(`${config.shortCode}${passkey}${timestamp}`).toString("base64");

    const baseUrl = this.getBaseUrl(config.environment);
    const endpoint = `${baseUrl}/mpesa/stkpushquery/v1/query`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: config.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: params.checkoutRequestId,
      }),
    });

    const data = await response.json();

    if (data.ResultCode === "0" || data.ResultCode === 0) {
      return {
        status: "COMPLETED",
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc,
        rawStatus: data,
      };
    } else if (data.ResultCode === "1032" || data.ResultCode === 1032) {
      return {
        status: "CANCELLED",
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc || "User cancelled payment",
        rawStatus: data,
      };
    } else if (data.ResultCode === "1037" || data.ResultCode === 1037) {
      return {
        status: "EXPIRED",
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc || "STK Push request timed out",
        rawStatus: data,
      };
    } else {
      return {
        status: "FAILED",
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc || "STK Push failed",
        rawStatus: data,
      };
    }
  }

  async handleCallback(payload: any): Promise<PaymentCallbackResult> {
    // STK Callback structure
    if (payload?.Body?.stkCallback) {
      const { stkCallback } = payload.Body;
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const resultCode = stkCallback.ResultCode;
      const resultDesc = stkCallback.ResultDesc;

      let mpesaReceiptNumber: string | undefined;
      let amount: number | undefined;
      let phoneNumber: string | undefined;

      if (resultCode === 0 && stkCallback.CallbackMetadata?.Item) {
        const items = stkCallback.CallbackMetadata.Item;
        mpesaReceiptNumber = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value?.toString();
        amount = Number(items.find((i: any) => i.Name === "Amount")?.Value);
        phoneNumber = items.find((i: any) => i.Name === "PhoneNumber")?.Value?.toString();
      }

      return {
        success: resultCode === 0,
        topic: "STK_PUSH_CALLBACK",
        providerEventId: checkoutRequestId,
        checkoutRequestId,
        mpesaReceiptNumber,
        amount,
        phoneNumber,
        resultCode,
        resultDesc,
        payload,
      };
    }

    // C2B Confirmation/Validation structure
    if (payload?.TransID) {
      return {
        success: true,
        topic: payload.TransactionType === "Validation" ? "C2B_VALIDATION" : "C2B_CONFIRMATION",
        providerEventId: payload.TransID,
        shortCode: payload.BusinessShortCode,
        mpesaReceiptNumber: payload.TransID,
        amount: Number(payload.TransAmount),
        phoneNumber: payload.MSISDN,
        accountReference: payload.BillRefNumber,
        payload,
      };
    }

    return {
      success: false,
      topic: "UNKNOWN",
      payload,
    };
  }

  async validateConfiguration(credentials: Record<string, any>): Promise<{ valid: boolean; message?: string }> {
    try {
      const config: MpesaCredentialsConfig = {
        consumerKey: credentials.consumerKey || process.env.MPESA_CONSUMER_KEY || "",
        consumerSecret: credentials.consumerSecret || process.env.MPESA_CONSUMER_SECRET || "",
        shortCode: credentials.shortCode || "174379",
        passkey: credentials.passkey || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
        accountType: credentials.accountType || "PAYBILL",
        environment: credentials.environment || "sandbox",
      };

      const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
      const baseUrl = this.getBaseUrl(config.environment);

      const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: "GET",
        headers: { Authorization: `Basic ${auth}` },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          return { valid: true, message: "Connected to Safaricom Daraja API successfully" };
        }
      }

      const errorText = await response.text();
      return { valid: false, message: `Authentication failed: ${errorText || response.statusText}` };
    } catch (err: any) {
      return { valid: false, message: err.message || "Failed to validate credentials" };
    }
  }
}

export const mpesaProvider = new MpesaProvider();
