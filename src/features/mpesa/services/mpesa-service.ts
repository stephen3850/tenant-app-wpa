import { MpesaCredential } from "@prisma/client";
import { mpesaCredentialRepository } from "../repositories/mpesa-credential-repository";
import { mpesaTransactionRepository } from "../repositories/mpesa-transaction-repository";
import { STKPushInput } from "../schemas/mpesa-schemas";

export class MpesaService {
  private async getAccessToken(credential: MpesaCredential) {
    const auth = Buffer.from(`${credential.consumerKey}:${credential.consumerSecret}`).toString("base64");
    const url = credential.environment === "sandbox"
      ? "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
      : "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!response.ok) throw new Error("Failed to get M-Pesa access token");
    const data = await response.json();
    return data.access_token;
  }

  async initiateSTKPush(organizationId: string, input: STKPushInput) {
    const credential = await mpesaCredentialRepository.findByOrganizationId(organizationId);
    if (!credential) throw new Error("M-Pesa credentials not configured for this organization");

    const token = await this.getAccessToken(credential);
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const password = Buffer.from(`${credential.shortCode}${credential.passkey}${timestamp}`).toString("base64");

    const url = credential.environment === "sandbox"
      ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
      : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const callbackUrl = credential.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/stk/callback`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: credential.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: input.amount,
        PartyA: input.phoneNumber,
        PartyB: credential.shortCode,
        PhoneNumber: input.phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: input.accountReference,
        TransactionDesc: `Rent Payment - ${input.accountReference}`,
      }),
    });

    const data = await response.json();

    if (data.ResponseCode === "0") {
      await mpesaTransactionRepository.create({
        organizationId,
        tenantId: input.tenantId,
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        amount: input.amount,
        phoneNumber: input.phoneNumber,
        accountReference: input.accountReference,
        status: "PENDING",
        transactionType: "STK_PUSH",
      });
    }

    return data;
  }
}

export const mpesaService = new MpesaService();
