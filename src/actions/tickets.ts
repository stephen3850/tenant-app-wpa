"use server";

import { auth } from "@/auth";
import { ticketService } from "@/features/tickets/services/ticket-service";
import { revalidatePath } from "next/cache";
import type { TicketStatus } from "@prisma/client";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function createTicket(data: any) {
  const user = await getSession();
  const ticket = await ticketService.createTicket(user.id, user.organizationId, data);
  revalidatePath("/dashboard/tickets");
  return ticket;
}

export async function updateTicket(ticketId: string, data: any) {
  const user = await getSession();
  const ticket = await ticketService.updateTicket(user.id, user.organizationId, ticketId, data);
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return ticket;
}

export async function assignTicket(ticketId: string, assigneeId: string, notes?: string) {
  const user = await getSession();
  const result = await ticketService.assignTicket(user.id, user.organizationId, ticketId, assigneeId, notes);
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return result;
}

export async function changeTicketStatus(ticketId: string, status: TicketStatus, notes?: string) {
  const user = await getSession();
  const ticket = await ticketService.changeStatus(user.id, user.organizationId, ticketId, status, notes);
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return ticket;
}

export async function addComment(ticketId: string, content: string, isInternal: boolean = false) {
  const user = await getSession();
  const comment = await ticketService.addComment(user.id, user.organizationId, ticketId, content, isInternal);
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return comment;
}

export async function escalateTicket(ticketId: string, notes: string) {
  const user = await getSession();
  const ticket = await ticketService.escalateTicket(user.id, user.organizationId, ticketId, notes);
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return ticket;
}

export async function closeTicket(ticketId: string, notes?: string) {
  return changeTicketStatus(ticketId, "CLOSED", notes);
}

export async function reopenTicket(ticketId: string, notes?: string) {
  return changeTicketStatus(ticketId, "REOPENED", notes);
}

export async function archiveTicket(ticketId: string) {
  const user = await getSession();
  const ticket = await ticketService.archiveTicket(user.id, user.organizationId, ticketId);
  revalidatePath("/dashboard/tickets");
  return ticket;
}
