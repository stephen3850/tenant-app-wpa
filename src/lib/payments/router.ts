import { db } from "@/lib/db";
import { PaymentAccount, PaymentMethod } from "@prisma/client";
import { encryptCredentials } from "@/lib/encryption";

export interface ResolveRouteParams {
  organizationId: string;
  propertyId?: string;
  leaseId?: string;
  invoiceId?: string;
  paymentMethod?: PaymentMethod;
}

export class PaymentRouter {
  /**
   * Resolves the appropriate PaymentAccount for a given tenant/lease/invoice/property.
   */
  async resolvePaymentAccount(params: ResolveRouteParams): Promise<PaymentAccount> {
    const { organizationId } = params;
    const paymentMethod = params.paymentMethod || PaymentMethod.MPESA;
    let propertyId = params.propertyId;

    // 1. If invoiceId is provided, resolve lease & property
    if (params.invoiceId && !propertyId) {
      const invoice = await db.invoice.findUnique({
        where: { id: params.invoiceId, organizationId },
        include: { lease: { select: { propertyId: true } } },
      });
      if (invoice?.lease?.propertyId) {
        propertyId = invoice.lease.propertyId;
      }
    }

    // 2. If leaseId is provided, resolve property
    if (params.leaseId && !propertyId) {
      const lease = await db.lease.findUnique({
        where: { id: params.leaseId, organizationId },
        select: { propertyId: true },
      });
      if (lease?.propertyId) {
        propertyId = lease.propertyId;
      }
    }

    // 3. Check for property-specific route
    if (propertyId) {
      const propertyRoute = await db.paymentRoute.findFirst({
        where: {
          organizationId,
          propertyId,
          paymentMethod,
        },
        include: { paymentAccount: true },
      });

      if (propertyRoute?.paymentAccount && propertyRoute.paymentAccount.status === "ACTIVE") {
        return propertyRoute.paymentAccount;
      }
    }

    // 4. Check for organization-default route
    const defaultRoute = await db.paymentRoute.findFirst({
      where: {
        organizationId,
        propertyId: null,
        paymentMethod,
        isDefault: true,
      },
      include: { paymentAccount: true },
    });

    if (defaultRoute?.paymentAccount && defaultRoute.paymentAccount.status === "ACTIVE") {
      return defaultRoute.paymentAccount;
    }

    // 5. Check for default active PaymentAccount for organization
    const defaultAccount = await db.paymentAccount.findFirst({
      where: {
        organizationId,
        provider: "MPESA",
        status: "ACTIVE",
        isDefault: true,
      },
    });

    if (defaultAccount) {
      return defaultAccount;
    }

    // 6. Check for any active PaymentAccount for organization
    const anyActiveAccount = await db.paymentAccount.findFirst({
      where: {
        organizationId,
        status: "ACTIVE",
      },
    });

    if (anyActiveAccount) {
      return anyActiveAccount;
    }

    // 7. Fallback to legacy MpesaCredential in database if present
    const legacyCredential = await db.mpesaCredential.findUnique({
      where: { organizationId },
    });

    if (legacyCredential && legacyCredential.consumerKey && legacyCredential.consumerSecret) {
      const encrypted = encryptCredentials({
        consumerKey: legacyCredential.consumerKey,
        consumerSecret: legacyCredential.consumerSecret,
        shortCode: legacyCredential.shortCode || "174379",
        passkey: legacyCredential.passkey || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
        environment: legacyCredential.environment || "sandbox",
        accountType: "PAYBILL",
      });

      const migratedAccount = await db.paymentAccount.create({
        data: {
          organizationId,
          provider: "MPESA",
          accountType: "PAYBILL",
          displayName: `M-Pesa PayBill ${legacyCredential.shortCode || "174379"}`,
          shortCode: legacyCredential.shortCode || "174379",
          status: "ACTIVE",
          isDefault: true,
          credentialsEncrypted: encrypted,
        },
      });

      return migratedAccount;
    }

    // 8. Fallback to Vercel System Environment Variables
    const envConsumerKey = process.env.MPESA_CONSUMER_KEY;
    const envConsumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const envShortCode = process.env.MPESA_PAYBILL || process.env.MPESA_SHORTCODE || "174379";
    const envPasskey = process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const envEnvironment = process.env.MPESA_ENVIRONMENT || "sandbox";

    if (envConsumerKey && envConsumerSecret) {
      const encrypted = encryptCredentials({
        consumerKey: envConsumerKey,
        consumerSecret: envConsumerSecret,
        shortCode: envShortCode,
        passkey: envPasskey,
        environment: envEnvironment,
        accountType: "PAYBILL",
      });

      const envAccount = await db.paymentAccount.create({
        data: {
          organizationId,
          provider: "MPESA",
          accountType: "PAYBILL",
          displayName: `M-Pesa PayBill ${envShortCode} (Vercel Env)`,
          shortCode: envShortCode,
          status: "ACTIVE",
          isDefault: true,
          credentialsEncrypted: encrypted,
        },
      });

      return envAccount;
    }

    // 9. Ultimate Fallback: Safaricom Daraja Sandbox Default
    const defaultSandboxEncrypted = encryptCredentials({
      consumerKey: "CEIKMPBSn9G0eJU7thXP8xfJ9xftTciDJowAAnUyQmobnyK6",
      consumerSecret: "K19GGxCqArwRFi9CA9m8hRAUBwMKIhc9ovsEi6KRwGE2EQ3XmUHIVrA7dMqNWeKQ",
      shortCode: "174379",
      passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
      environment: "sandbox",
      accountType: "PAYBILL",
    });

    const defaultSandboxAccount = await db.paymentAccount.create({
      data: {
        organizationId,
        provider: "MPESA",
        accountType: "PAYBILL",
        displayName: "M-Pesa Daraja Sandbox PayBill 174379",
        shortCode: "174379",
        status: "ACTIVE",
        isDefault: true,
        credentialsEncrypted: defaultSandboxEncrypted,
      },
    });

    return defaultSandboxAccount;
  }
}

export const paymentRouter = new PaymentRouter();
