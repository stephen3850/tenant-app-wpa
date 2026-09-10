"use server";

import { auth } from "@/auth";
import { maintenanceService } from "../services/maintenance-service";
import { CreateTicketSchema, CreateTicketInput, UpdateTicketSchema, UpdateTicketInput } from "../schemas/maintenance-schemas";
import { revalidatePath } from "next/cache";
import { TicketStatus } from "@prisma/client";

async function getContext() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return {
    organizationId: (session.user as any).organizationId as string,
    userId: session.user.id as string,
  };
}

export async function createTicketAction(input: CreateTicketInput) {
  const { organizationId, userId } = await getContext();
  const validated = CreateTicketSchema.parse(input);

  const result = await maintenanceService.createTicket(organizationId, userId, validated);
  revalidatePath("/tickets");
  return result;
}

export async function assignTicketAction(ticketId: string, assigneeId: string) {
  const { organizationId } = await getContext();
  const result = await maintenanceService.assignTicket(organizationId, ticketId, assigneeId);
  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/tickets");
  return result;
}

export async function updateTicketStatusAction(ticketId: string, status: TicketStatus, notes?: string) {
  const { organizationId } = await getContext();
  const result = await maintenanceService.updateStatus(organizationId, ticketId, status, notes);
  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/tickets");
  return result;
}

export async function recordTicketCostAction(ticketId: string, cost: number) {
  const { organizationId } = await getContext();
  const result = await maintenanceService.recordCost(organizationId, ticketId, cost);
  revalidatePath(`/tickets/${ticketId}`);
  return result;
}

export async function getMaintenanceStatsAction() {
  const { organizationId } = await getContext();
  return await maintenanceService.getDashboardStats(organizationId);
}
