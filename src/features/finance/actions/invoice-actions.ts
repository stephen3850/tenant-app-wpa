"use server";

import { auth } from "@/auth";
import { invoiceService } from "../services/invoice-service";
import { invoiceGeneratorService } from "../services/invoice-generator-service";
import { CreateInvoiceSchema, CreateInvoiceInput } from "../schemas/invoice-schemas";
import { revalidatePath } from "next/cache";

async function getOrgContext() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return (session.user as any).organizationId as string;
}

export async function createInvoiceAction(input: CreateInvoiceInput) {
  const organizationId = await getOrgContext();
  const validated = CreateInvoiceSchema.parse(input);

  const result = await invoiceService.createInvoice(organizationId, validated);

  revalidatePath("/", "layout");

  return result;
}

export async function generateMonthlyInvoicesAction(month: number, year: number) {
  const organizationId = await getOrgContext();
  const result = await invoiceGeneratorService.generateMonthlyInvoices(organizationId, month, year);

  revalidatePath("/finance/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/landlord/dashboard");

  return result;
}

export async function postInvoiceAction(invoiceId: string) {
  const organizationId = await getOrgContext();
  const result = await invoiceService.postInvoice(organizationId, invoiceId);

  revalidatePath("/finance/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/landlord/dashboard");

  return result;
}

export async function cancelInvoiceAction(invoiceId: string) {
  const organizationId = await getOrgContext();
  const result = await invoiceService.cancelInvoice(organizationId, invoiceId);
  revalidatePath("/finance/invoices");
  return result;
}

export async function markOverdueAction(invoiceId: string) {
  const organizationId = await getOrgContext();
  const result = await invoiceService.markOverdue(organizationId, invoiceId);
  revalidatePath("/finance/invoices");
  return result;
}

export async function getInvoiceStatsAction() {
  const organizationId = await getOrgContext();
  return await invoiceService.getDashboardStats(organizationId);
}
