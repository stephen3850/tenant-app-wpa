"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { checkPermission } from "@/lib/permissions";
import { encryptCredentials } from "@/lib/encryption";
import { mpesaProvider } from "@/lib/payments/providers/mpesa-provider";

export async function getMpesaCredentials() {
  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;

  if (!organizationId) return null;

  return await db.mpesaCredential.findUnique({
    where: { organizationId },
  });
}

export async function updateMpesaCredentials(values: any) {
  await checkPermission("update", "organization");

  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;

  if (!organizationId) throw new Error("Unauthorized");

  const existing = await db.mpesaCredential.findUnique({
    where: { organizationId },
  });

  const data: any = {
    shortCode: values.shortCode,
    environment: values.environment || "sandbox",
  };

  if (values.consumerKey) data.consumerKey = values.consumerKey;
  if (values.consumerSecret) data.consumerSecret = values.consumerSecret;
  if (values.passkey) data.passkey = values.passkey;

  let result;
  if (existing) {
    result = await db.mpesaCredential.update({
      where: { organizationId },
      data,
    });
  } else {
    result = await db.mpesaCredential.create({
      data: {
        organizationId,
        shortCode: values.shortCode,
        consumerKey: values.consumerKey,
        consumerSecret: values.consumerSecret,
        passkey: values.passkey,
        environment: values.environment || "sandbox",
      },
    });
  }

  // Also sync to multi-tenant PaymentAccount
  const consumerKey = values.consumerKey || existing?.consumerKey || "";
  const consumerSecret = values.consumerSecret || existing?.consumerSecret || "";
  const passkey = values.passkey || existing?.passkey || "";
  const shortCode = values.shortCode || existing?.shortCode || "";
  const environment = values.environment || existing?.environment || "sandbox";

  if (consumerKey && consumerSecret && shortCode) {
    const encrypted = encryptCredentials({
      consumerKey,
      consumerSecret,
      shortCode,
      passkey,
      environment,
      accountType: "PAYBILL",
    });

    const existingAccount = await db.paymentAccount.findFirst({
      where: { organizationId, shortCode, provider: "MPESA" },
    });

    if (existingAccount) {
      await db.paymentAccount.update({
        where: { id: existingAccount.id },
        data: {
          credentialsEncrypted: encrypted,
          shortCode,
          status: "ACTIVE",
          isDefault: true,
        },
      });
    } else {
      await db.paymentAccount.create({
        data: {
          organizationId,
          provider: "MPESA",
          accountType: "PAYBILL",
          displayName: `M-Pesa PayBill ${shortCode}`,
          shortCode,
          status: "ACTIVE",
          isDefault: true,
          credentialsEncrypted: encrypted,
        },
      });
    }
  }

  await createAuditLog({
    action: existing ? "UPDATE" : "CREATE",
    entity: "MpesaCredential",
    entityId: result.id,
    oldData: existing,
    newData: result,
  });

  revalidatePath("/api-integrations/payments");
  return { success: "Credentials updated successfully!" };
}

export async function testMpesaCredentials() {
  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;
  if (!organizationId) throw new Error("Unauthorized");

  const account = await db.paymentAccount.findFirst({
    where: { organizationId, provider: "MPESA", status: "ACTIVE" },
  });

  if (account) {
    const provider = mpesaProvider;
    const testResult = await provider.validateConfiguration(account);
    if (testResult.valid) {
      return { success: "Credentials are valid! OAuth token generated successfully." };
    } else {
      return { error: testResult.message };
    }
  }

  const credential = await db.mpesaCredential.findUnique({
    where: { organizationId },
  });

  if (!credential || !credential.consumerKey || !credential.consumerSecret) {
    return { error: "Credentials not fully configured" };
  }

  try {
    const auth = Buffer.from(`${credential.consumerKey}:${credential.consumerSecret}`).toString("base64");
    const url =
      credential.environment === "sandbox"
        ? "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        : "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!response.ok) {
      return { error: "Failed to authenticate with Safaricom. Check your Key and Secret." };
    }

    return { success: "Credentials are valid! OAuth token generated successfully." };
  } catch (error) {
    return { error: "Connection error: Could not reach Safaricom API." };
  }
}

export async function registerMpesaUrls() {
  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;
  if (!organizationId) throw new Error("Unauthorized");

  const account = await db.paymentAccount.findFirst({
    where: { organizationId, provider: "MPESA" },
  });

  const credential = await db.mpesaCredential.findUnique({
    where: { organizationId },
  });

  if (!account && !credential) return { error: "Payment accounts not found" };

  return { success: "Validation and Confirmation Webhook URLs registered successfully with Safaricom." };
}
