"use server";

import { auth } from "@/auth";
import { paymentService } from "../services/payment-service";
import { tenantLedgerService } from "../services/tenant-ledger-service";
import { paymentRepository } from "../repositories/payment-repository";
import {
  RecordPaymentSchema,
  ReversePaymentSchema,
  ApplyCreditSchema
} from "../schemas/payment-schemas";
import { revalidatePath } from "next/cache";

async function getOrgId() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return (session.user as any).organizationId as string;
}

export async function recordPaymentAction(input: any) {
  const organizationId = await getOrgId();
  const validated = RecordPaymentSchema.parse(input);
  const result = await paymentService.recordPayment(organizationId, validated);

  // Revalidate everything to ensure all counts and totals are fresh
  revalidatePath("/", "layout");

  return result;
}

export async function reversePaymentAction(input: any) {
  const organizationId = await getOrgId();
  const validated = ReversePaymentSchema.parse(input);
  const result = await paymentService.reversePayment(organizationId, validated.paymentId, validated.reason);

  revalidatePath("/finance/payments");
  revalidatePath("/dashboard");
  revalidatePath("/properties");
  revalidatePath("/landlord/dashboard");

  return result;
}

export async function applyTenantCreditAction(input: any) {
  const organizationId = await getOrgId();
  const validated = ApplyCreditSchema.parse(input);
  const result = await paymentService.applyCredit(organizationId, validated.tenantId, validated.invoiceId, validated.amount);

  revalidatePath("/finance/payments");
  revalidatePath("/dashboard");
  revalidatePath("/landlord/dashboard");

  return result;
}

export async function getTenantStatementAction(tenantId: string) {
  const organizationId = await getOrgId();
  return await tenantLedgerService.getStatement(tenantId, organizationId);
}

export async function getPaymentSummaryAction() {
  const organizationId = await getOrgId();
  return await paymentService.getMetrics(organizationId);
}

export async function getRecentPaymentsAction() {
  const organizationId = await getOrgId();
  return await paymentRepository.findMany(organizationId);
}
