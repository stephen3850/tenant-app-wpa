"use server";

import { auth } from "@/auth";
import { tenantMaintenanceService } from "@/features/tenant/services/tenant-maintenance-service";
import { TicketStatus, TicketPriority } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getMaintenanceRequests(filters?: { status?: TicketStatus; search?: string }) {
  const user = await getSession();
  return tenantMaintenanceService.getRequests(user.id, filters);
}

export async function getMaintenanceRequest(requestId: string) {
  const user = await getSession();
  return tenantMaintenanceService.getRequestDetails(user.id, requestId);
}

export async function createMaintenanceRequest(data: {
  subject: string;
  description: string;
  categoryId: string;
  priority: TicketPriority;
  preferredAccessTime?: string;
  contactPreference?: string;
  attachments?: { url: string; name: string; type: string; size: number }[];
}) {
  const user = await getSession();
  const result = await tenantMaintenanceService.createRequest(user.id, data);
  revalidatePath("/portal/tickets");
  return result;
}

export async function addMaintenanceComment(requestId: string, content: string, attachments?: { url: string; name: string; type: string; size: number }[]) {
  const user = await getSession();
  const result = await tenantMaintenanceService.addComment(user.id, requestId, content, attachments);
  revalidatePath(`/portal/tickets/${requestId}`);
  return result;
}

export async function confirmResolution(requestId: string, rating: number, feedback?: string) {
  const user = await getSession();
  const result = await tenantMaintenanceService.confirmResolution(user.id, requestId, rating, feedback);
  revalidatePath(`/portal/tickets/${requestId}`);
  revalidatePath("/portal/tickets");
  return result;
}

export async function reopenRequest(requestId: string, reason: string) {
  const user = await getSession();
  const result = await tenantMaintenanceService.reopenRequest(user.id, requestId, reason);
  revalidatePath(`/portal/tickets/${requestId}`);
  revalidatePath("/portal/tickets");
  return result;
}

export async function getMaintenanceCategories() {
  const user = await getSession();
  return tenantMaintenanceService.getCategories(user.id);
}

export async function getMaintenanceDashboardSummary() {
  const user = await getSession();
  return tenantMaintenanceService.getDashboardSummary(user.id);
}
