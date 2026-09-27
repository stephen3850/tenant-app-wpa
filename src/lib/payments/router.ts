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

    // 7. Fallback to legacy MpesaCredential if present, automatically creating a PaymentAccount for seamless transition
    const legacyCredential = await db.mpesaCredential.findUnique({
      where: { organizationId },
    });

    if (legacyCredential) {
      const encrypted = encryptCredentials({
        consumerKey: legacyCredential.consumerKey,
        consumerSecret: legacyCredential.consumerSecret,
        shortCode: legacyCredential.shortCode,
        passkey: legacyCredential.passkey,
        environment: legacyCredential.environment || "sandbox",
        accountType: "PAYBILL",
      });

      const migratedAccount = await db.paymentAccount.create({
        data: {
          organizationId,
          provider: "MPESA",
          accountType: "PAYBILL",
          displayName: `M-Pesa PayBill ${legacyCredential.shortCode}`,
          shortCode: legacyCredential.shortCode,
          status: "ACTIVE",
          isDefault: true,
          credentialsEncrypted: encrypted,
        },
      });

      return migratedAccount;
    }

    throw new Error(
      `No active payment account configured for organization ${organizationId}. Please configure a payment account in Settings > Payment Accounts.`
    );
  }
}

export const paymentRouter = new PaymentRouter();
