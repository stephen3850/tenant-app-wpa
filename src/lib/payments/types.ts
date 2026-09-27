import { PaymentAccount, PaymentMethod } from "@prisma/client";

export interface MpesaCredentialsConfig {
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passkey?: string;
  accountType: "TILL" | "PAYBILL";
  environment: "sandbox" | "production";
  initiatorName?: string;
  securityCredential?: string;
}

export interface BankCredentialsConfig {
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode?: string;
  branchCode?: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface InitiatePaymentParams {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc?: string;
  callbackUrl?: string;
  paymentAccountId: string;
  organizationId: string;
  tenantId?: string;
  invoiceId?: string;
  leaseId?: string;
  propertyId?: string;
}

export interface InitiatePaymentResult {
  success: boolean;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  responseCode?: string;
  responseDescription?: string;
  customerMessage?: string;
  error?: string;
  rawResponse?: any;
}

export interface PaymentStatusParams {
  paymentAccountId: string;
  checkoutRequestId?: string;
  providerTransactionId?: string;
}

export interface PaymentStatusResult {
  status: "PENDING" | "STK_REQUESTED" | "COMPLETED" | "FAILED" | "CANCELLED" | "EXPIRED" | "REVERSED";
  providerTransactionId?: string;
  amount?: number;
  phoneNumber?: string;
  resultCode?: number | string;
  resultDesc?: string;
  rawStatus?: any;
}

export interface PaymentCallbackResult {
  success: boolean;
  topic: string; // STK_PUSH_CALLBACK, C2B_VALIDATION, C2B_CONFIRMATION
  providerEventId?: string;
  shortCode?: string;
  checkoutRequestId?: string;
  mpesaReceiptNumber?: string;
  amount?: number;
  phoneNumber?: string;
  accountReference?: string;
  resultCode?: number;
  resultDesc?: string;
  payload: any;
}

export interface PaymentProvider {
  readonly providerName: string;

  initiatePayment(
    params: InitiatePaymentParams,
    account: PaymentAccount
  ): Promise<InitiatePaymentResult>;

  getPaymentStatus(
    params: PaymentStatusParams,
    account: PaymentAccount
  ): Promise<PaymentStatusResult>;

  handleCallback(
    payload: any
  ): Promise<PaymentCallbackResult>;

  validateConfiguration(
    credentials: Record<string, any>
  ): Promise<{ valid: boolean; message?: string }>;
}
