"use server";

import { auth } from "@/auth";
import { tenantInvoiceService } from "@/features/tenant/services/tenant-invoice-service";
import { InvoiceStatus } from "@prisma/client";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getTenantInvoices(filters: { status?: InvoiceStatus; search?: string } = {}) {
  const user = await getSession();
  return tenantInvoiceService.getInvoices(user.id, filters);
}

export async function getTenantInvoiceDetails(invoiceId: string) {
  const user = await getSession();
  return tenantInvoiceService.getInvoiceDetails(user.id, invoiceId);
}

export async function logInvoiceDownload(invoiceId: string) {
  const user = await getSession();
  return tenantInvoiceService.logInvoiceDownload(user.id, invoiceId);
}
