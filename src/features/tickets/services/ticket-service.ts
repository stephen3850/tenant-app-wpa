import { ticketRepository } from "../repositories/ticket-repository";
import { TicketPriority, TicketStatus, TicketActivityType, Prisma } from "@prisma/client";
import { addHours, addDays } from "date-fns";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { checkPermission } from "@/lib/permissions";

export class TicketService {
  private calculateSLATargets(priority: TicketPriority) {
    const now = new Date();
    let responseHours = 24;
    let resolutionHours = 72;

    switch (priority) {
      case "EMERGENCY":
        responseHours = 2;
        resolutionHours = 6;
        break;
      case "URGENT":
        responseHours = 8;
        resolutionHours = 24;
        break;
      case "HIGH":
        responseHours = 24;
        resolutionHours = 48;
        break;
      case "MEDIUM":
        responseHours = 72;
        resolutionHours = 120; // 5 days
        break;
      case "LOW":
        responseHours = 168; // 7 days
        resolutionHours = 336; // 14 days
        break;
    }

    return {
      responseTimeTarget: addHours(now, responseHours),
      resolutionTarget: addHours(now, resolutionHours),
    };
  }

  private async generateTicketNumber(organizationId: string) {
    const count = await db.ticket.count({ where: { organizationId } });
    return `TKT-${(count + 1).toString().padStart(5, '0')}`;
  }

  async createTicket(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "ticket");

    const { responseTimeTarget, resolutionTarget } = this.calculateSLATargets(data.priority);
    const ticketNumber = await this.generateTicketNumber(organizationId);

    const ticket = await ticketRepository.create({
      ...data,
      ticketNumber,
      organizationId,
      creatorId: userId,
      status: "OPEN",
      responseTimeTarget,
      resolutionTarget,
    });

    await ticketRepository.createActivity({
      ticketId: ticket.id,
      userId,
      type: "COMMENT",
      content: "Ticket created",
    });

    await createAuditLog({
      action: "CREATE",
      entity: "Ticket",
      entityId: ticket.id,
      newData: ticket,
    });

    return ticket;
  }

  async updateTicket(userId: string, organizationId: string, ticketId: string, data: any) {
    await checkPermission("update", "ticket");

    const oldTicket = await ticketRepository.findById(ticketId, organizationId);
    const ticket = await ticketRepository.update(ticketId, organizationId, data);

    await createAuditLog({
      action: "UPDATE",
      entity: "Ticket",
      entityId: ticket.id,
      oldData: oldTicket,
      newData: ticket,
    });

    return ticket;
  }

  async assignTicket(userId: string, organizationId: string, ticketId: string, assigneeId: string, notes?: string) {
    await checkPermission("assign", "ticket");

    const result = await ticketRepository.assignTicket(ticketId, organizationId, assigneeId, userId, notes);

    await ticketRepository.createActivity({
      ticketId,
      userId,
      type: "ASSIGNMENT",
      newValue: assigneeId,
      content: notes,
    });

    await createAuditLog({
      action: "ASSIGN",
      entity: "Ticket",
      entityId: ticketId,
      newData: { assigneeId, notes },
    });

    return result;
  }

  async changeStatus(userId: string, organizationId: string, ticketId: string, status: TicketStatus, notes?: string) {
    await checkPermission("update", "ticket");

    const oldTicket = await ticketRepository.findById(ticketId, organizationId);
    const ticket = await ticketRepository.update(ticketId, organizationId, {
      status,
      ...(status === "CLOSED" ? { closedAt: new Date() } : {})
    });

    await ticketRepository.createActivity({
      ticketId,
      userId,
      type: "STATUS_CHANGE",
      oldValue: oldTicket?.status,
      newValue: status,
      content: notes,
    });

    await createAuditLog({
      action: "STATUS_CHANGE",
      entity: "Ticket",
      entityId: ticketId,
      oldData: { status: oldTicket?.status },
      newData: { status },
    });

    return ticket;
  }

  async addComment(userId: string, organizationId: string, ticketId: string, content: string, isInternal: boolean = false) {
    await checkPermission("view", "ticket");

    const comment = await ticketRepository.addComment({
      ticketId,
      userId,
      content,
      isInternal,
    });

    await ticketRepository.createActivity({
      ticketId,
      userId,
      type: "COMMENT",
      content,
      isInternal,
    });

    await createAuditLog({
      action: "COMMENT",
      entity: "Ticket",
      entityId: ticketId,
      newData: { commentId: comment.id, isInternal },
    });

    return comment;
  }

  async escalateTicket(userId: string, organizationId: string, ticketId: string, notes: string) {
    await checkPermission("update", "ticket");

    const ticket = await this.changeStatus(userId, organizationId, ticketId, "ESCALATED", notes);

    await ticketRepository.createActivity({
      ticketId,
      userId,
      type: "ESCALATION",
      content: notes,
    });

    return ticket;
  }

  async archiveTicket(userId: string, organizationId: string, ticketId: string) {
    await checkPermission("archive", "ticket");

    const ticket = await this.changeStatus(userId, organizationId, ticketId, "ARCHIVED");

    await createAuditLog({
      action: "ARCHIVE",
      entity: "Ticket",
      entityId: ticketId,
    });

    return ticket;
  }
}

export const ticketService = new TicketService();
