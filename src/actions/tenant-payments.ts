"use server";

import { auth } from "@/auth";
import { tenantPaymentService } from "@/features/tenant/services/tenant-payment-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getTenantPaymentDashboard() {
  const user = await getSession();
  return tenantPaymentService.getPaymentDashboard(user.id);
}

export async function getTenantPaymentHistory() {
  const user = await getSession();
  return tenantPaymentService.getPaymentHistory(user.id);
}

export async function initiateMpesaPayment(amount: number, phoneNumber: string, invoiceId?: string) {
  const user = await getSession();
  const result = await tenantPaymentService.initiateSTKPush(user.id, amount, phoneNumber, invoiceId);
  revalidatePath("/payments");
  return result;
}

export async function getMpesaPaymentStatus(checkoutRequestId: string) {
  const user = await getSession();
  return tenantPaymentService.getMpesaStatus(user.id, checkoutRequestId);
}
