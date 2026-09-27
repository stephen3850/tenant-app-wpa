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
  try {
    const user = await getSession();
    return await tenantPaymentService.getPaymentDashboard(user.id);
  } catch (error: any) {
    console.error("[getTenantPaymentDashboard Action Error]:", error);
    return {
      summary: { totalOutstanding: 0, overdueAmount: 0, latestPayment: null, countOutstanding: 0 },
      recentPayments: [],
      outstandingInvoices: [],
    };
  }
}

export async function getTenantPaymentHistory() {
  try {
    const user = await getSession();
    return await tenantPaymentService.getPaymentHistory(user.id);
  } catch (error: any) {
    console.error("[getTenantPaymentHistory Action Error]:", error);
    return [];
  }
}

export async function initiateMpesaPayment(amount: number, phoneNumber: string, invoiceId?: string) {
  try {
    const user = await getSession();
    const result = await tenantPaymentService.initiateSTKPush(user.id, amount, phoneNumber, invoiceId);
    revalidatePath("/payments");
    return result;
  } catch (error: any) {
    console.error("[initiateMpesaPayment Action Error]:", error);
    return {
      ResponseCode: "1",
      ResponseDescription: error.message || "Failed to initiate M-Pesa payment",
    };
  }
}

export async function getMpesaPaymentStatus(checkoutRequestId: string) {
  try {
    const user = await getSession();
    return await tenantPaymentService.getMpesaStatus(user.id, checkoutRequestId);
  } catch (error: any) {
    console.error("[getMpesaPaymentStatus Action Error]:", error);
    return { status: "FAILED", error: error.message };
  }
}
