"use server";

import { auth } from "@/auth";
import { mpesaService } from "../services/mpesa-service";
import { mpesaCredentialRepository } from "../repositories/mpesa-credential-repository";
import { mpesaTransactionRepository } from "../repositories/mpesa-transaction-repository";
import { STKPushSchema, MpesaConfigurationSchema } from "../schemas/mpesa-schemas";
import { revalidatePath } from "next/cache";
import { checkPermission } from "@/lib/permissions";

async function getOrgId() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return (session.user as any).organizationId as string;
}

export async function initiateMpesaPaymentAction(input: any) {
  const organizationId = await getOrgId();
  await checkPermission("create", "all"); // Should be mpesa:initiate

  const validated = STKPushSchema.parse(input);
  const result = await mpesaService.initiateSTKPush(organizationId, validated);

  revalidatePath("/finance/mpesa");
  return result;
}

export async function configureMpesaAction(input: any) {
  const organizationId = await getOrgId();
  await checkPermission("manage", "organization"); // Should be mpesa:configure

  const validated = MpesaConfigurationSchema.parse(input);
  const result = await mpesaCredentialRepository.upsert(organizationId, validated);

  revalidatePath("/settings/mpesa");
  return result;
}

export async function getMpesaMetricsAction() {
  const organizationId = await getOrgId();
  return await mpesaTransactionRepository.getMetrics(organizationId);
}

export async function getMpesaTransactionsAction() {
  const organizationId = await getOrgId();
  return await mpesaTransactionRepository.findMany(organizationId);
}
