"use server";

import { auth } from "@/auth";
import { billingService } from "@/features/saas/services/billing-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getSubscription() {
  const user = await getSession();
  return billingService.getSubscription(user.organizationId);
}

export async function changePlan(newPlanId: string) {
  const user = await getSession();
  const subscription = await billingService.changePlan(user.id, user.organizationId, newPlanId);
  revalidatePath("/dashboard/settings/billing");
  return subscription;
}

export async function cancelSubscription() {
  const user = await getSession();
  const subscription = await billingService.cancelSubscription(user.id, user.organizationId);
  revalidatePath("/dashboard/settings/billing");
  return subscription;
}

export async function getBillingInvoices() {
  const user = await getSession();
  return billingService.getBillingInvoices(user.organizationId);
}

export async function recordBillingPayment(invoiceId: string, amount: number, method: string, transactionRef?: string) {
  const user = await getSession();
  const payment = await billingService.recordPayment(user.id, user.organizationId, invoiceId, amount, method, transactionRef);
  revalidatePath("/dashboard/settings/billing");
  return payment;
}
