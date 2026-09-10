"use server";

import { auth } from "@/auth";
import { tenantReceiptService } from "@/features/tenant/services/tenant-receipt-service";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getTenantReceipts() {
  const user = await getSession();
  return tenantReceiptService.getReceipts(user.id);
}

export async function getTenantReceiptDetails(receiptId: string) {
  const user = await getSession();
  return tenantReceiptService.getReceiptDetails(user.id, receiptId);
}

export async function logReceiptDownload(receiptId: string) {
  const user = await getSession();
  return tenantReceiptService.logReceiptDownload(user.id, receiptId);
}
