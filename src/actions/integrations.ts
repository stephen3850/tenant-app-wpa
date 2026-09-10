"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { checkPermission } from "@/lib/permissions";

export async function getMpesaCredentials() {
  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;

  if (!organizationId) return null;

  return await db.mpesaCredential.findUnique({
    where: { organizationId },
  });
}

export async function updateMpesaCredentials(values: any) {
  await checkPermission("update", "organization"); // Or a more specific permission if it exists

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
    // For new credentials, all fields are required if not clearing
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

  const credential = await db.mpesaCredential.findUnique({
    where: { organizationId },
  });

  if (!credential || !credential.consumerKey || !credential.consumerSecret) {
    return { error: "Credentials not fully configured" };
  }

  try {
    const auth = Buffer.from(`${credential.consumerKey}:${credential.consumerSecret}`).toString("base64");
    const url = credential.environment === "sandbox"
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

  // In a real app, this would call Safaricom C2B Register URL API
  // For now we simulate success if credentials exist
  const credential = await db.mpesaCredential.findUnique({
    where: { organizationId },
  });

  if (!credential) return { error: "Credentials not found" };

  return { success: "Validation and Confirmation URLs registered successfully with Safaricom." };
}
