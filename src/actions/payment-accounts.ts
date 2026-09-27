"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { encryptCredentials, decryptCredentials } from "@/lib/encryption";
import { paymentProviderFactory } from "@/lib/payments/provider-factory";
import { PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getOrgSession() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("Unauthorized: Missing organization context");
  }
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
  };
}

export async function getPaymentAccounts() {
  const { organizationId } = await getOrgSession();
  await checkPermission("read", "payment");

  const accounts = await db.paymentAccount.findMany({
    where: { organizationId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    include: {
      routes: {
        include: { property: { select: { id: true, propertyName: true } } },
      },
    },
  });

  return accounts.map((acc) => {
    let credentialsSafe: Record<string, any> = {};
    try {
      const dec = decryptCredentials(acc.credentialsEncrypted);
      credentialsSafe = {
        consumerKey: dec.consumerKey ? `${dec.consumerKey.slice(0, 4)}****` : "",
        shortCode: dec.shortCode || acc.shortCode || "",
        accountType: dec.accountType || acc.accountType,
        environment: dec.environment || "sandbox",
      };
    } catch {
      credentialsSafe = { shortCode: acc.shortCode };
    }

    return {
      ...acc,
      credentialsEncrypted: undefined,
      credentialsSafe,
    };
  });
}

export async function createPaymentAccount(data: {
  provider?: string;
  accountType: "TILL" | "PAYBILL" | "BANK_ACCOUNT";
  displayName: string;
  shortCode: string;
  consumerKey: string;
  consumerSecret: string;
  passkey?: string;
  environment?: "sandbox" | "production";
  isDefault?: boolean;
}) {
  const { organizationId } = await getOrgSession();
  await checkPermission("create", "payment");

  const providerName = data.provider || "MPESA";
  const provider = paymentProviderFactory.getProvider(providerName);

  // Validate credentials before saving
  const testResult = await provider.validateConfiguration({
    consumerKey: data.consumerKey,
    consumerSecret: data.consumerSecret,
    shortCode: data.shortCode,
    passkey: data.passkey,
    accountType: data.accountType,
    environment: data.environment || "sandbox",
  });

  if (!testResult.valid) {
    throw new Error(`Invalid credentials: ${testResult.message}`);
  }

  const encrypted = encryptCredentials({
    consumerKey: data.consumerKey,
    consumerSecret: data.consumerSecret,
    shortCode: data.shortCode,
    passkey: data.passkey,
    accountType: data.accountType,
    environment: data.environment || "sandbox",
  });

  if (data.isDefault) {
    await db.paymentAccount.updateMany({
      where: { organizationId, provider: providerName },
      data: { isDefault: false },
    });
  }

  const newAccount = await db.paymentAccount.create({
    data: {
      organizationId,
      provider: providerName,
      accountType: data.accountType,
      displayName: data.displayName,
      shortCode: data.shortCode,
      status: "ACTIVE",
      isDefault: data.isDefault ?? false,
      credentialsEncrypted: encrypted,
    },
  });

  revalidatePath("/settings/payment-accounts");
  revalidatePath("/api-integrations/payments");
  return newAccount;
}

export async function updatePaymentAccount(
  accountId: string,
  data: {
    displayName?: string;
    shortCode?: string;
    consumerKey?: string;
    consumerSecret?: string;
    passkey?: string;
    environment?: "sandbox" | "production";
    status?: "ACTIVE" | "INACTIVE";
    isDefault?: boolean;
  }
) {
  const { organizationId } = await getOrgSession();
  await checkPermission("update", "payment");

  const account = await db.paymentAccount.findUnique({
    where: { id: accountId, organizationId },
  });

  if (!account) {
    throw new Error("Payment account not found");
  }

  let updatedEncrypted = account.credentialsEncrypted;

  if (data.consumerKey && data.consumerSecret) {
    const provider = paymentProviderFactory.getProvider(account.provider);
    const testResult = await provider.validateConfiguration({
      consumerKey: data.consumerKey,
      consumerSecret: data.consumerSecret,
      shortCode: data.shortCode || account.shortCode,
      passkey: data.passkey,
      accountType: account.accountType,
      environment: data.environment || "sandbox",
    });

    if (!testResult.valid) {
      throw new Error(`Invalid credentials: ${testResult.message}`);
    }

    updatedEncrypted = encryptCredentials({
      consumerKey: data.consumerKey,
      consumerSecret: data.consumerSecret,
      shortCode: data.shortCode || account.shortCode,
      passkey: data.passkey,
      accountType: account.accountType,
      environment: data.environment || "sandbox",
    });
  }

  if (data.isDefault) {
    await db.paymentAccount.updateMany({
      where: { organizationId, provider: account.provider },
      data: { isDefault: false },
    });
  }

  const updated = await db.paymentAccount.update({
    where: { id: accountId },
    data: {
      displayName: data.displayName ?? account.displayName,
      shortCode: data.shortCode ?? account.shortCode,
      status: data.status ?? account.status,
      isDefault: data.isDefault ?? account.isDefault,
      credentialsEncrypted: updatedEncrypted,
    },
  });

  revalidatePath("/settings/payment-accounts");
  revalidatePath("/api-integrations/payments");
  return updated;
}

export async function testPaymentAccountCredentials(credentials: {
  provider?: string;
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passkey?: string;
  accountType?: string;
  environment?: string;
}) {
  await getOrgSession();
  await checkPermission("read", "payment");

  const providerName = credentials.provider || "MPESA";
  const provider = paymentProviderFactory.getProvider(providerName);

  return await provider.validateConfiguration(credentials);
}

export async function getPaymentRoutes() {
  const { organizationId } = await getOrgSession();
  await checkPermission("read", "payment");

  const [routes, properties, accounts] = await Promise.all([
    db.paymentRoute.findMany({
      where: { organizationId },
      include: {
        property: { select: { id: true, propertyName: true, propertyCode: true } },
        paymentAccount: { select: { id: true, displayName: true, shortCode: true, accountType: true } },
      },
    }),
    db.property.findMany({
      where: { organizationId },
      select: { id: true, propertyName: true, propertyCode: true },
    }),
    db.paymentAccount.findMany({
      where: { organizationId, status: "ACTIVE" },
      select: { id: true, displayName: true, shortCode: true, accountType: true },
    }),
  ]);

  return { routes, properties, accounts };
}

export async function upsertPaymentRoute(data: {
  propertyId?: string | null;
  paymentAccountId: string;
  paymentMethod?: PaymentMethod;
  isDefault?: boolean;
}) {
  const { organizationId } = await getOrgSession();
  await checkPermission("update", "payment");

  const method = data.paymentMethod || PaymentMethod.MPESA;

  // If propertyId is null/undefined, this sets org default route
  const existing = await db.paymentRoute.findFirst({
    where: {
      organizationId,
      propertyId: data.propertyId || null,
      paymentMethod: method,
    },
  });

  if (existing) {
    const updated = await db.paymentRoute.update({
      where: { id: existing.id },
      data: {
        paymentAccountId: data.paymentAccountId,
        isDefault: data.isDefault ?? existing.isDefault,
      },
    });
    revalidatePath("/settings/payment-accounts");
    return updated;
  } else {
    const created = await db.paymentRoute.create({
      data: {
        organizationId,
        propertyId: data.propertyId || null,
        paymentAccountId: data.paymentAccountId,
        paymentMethod: method,
        isDefault: data.isDefault ?? false,
      },
    });
    revalidatePath("/settings/payment-accounts");
    return created;
  }
}
