import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { maintenanceRepository } from "../repositories/maintenance-repository";
import { TicketStatus, Prisma } from "@prisma/client";
import { CreateTicketInput, UpdateTicketInput } from "../schemas/maintenance-schemas";

export class MaintenanceService {
  async createTicket(organizationId: string, creatorId: string, input: CreateTicketInput) {
    await checkPermission("create", "all"); // Assuming 'all' or specific maintenance permission

    const ticket = await db.ticket.create({
      data: {
        organizationId,
        creatorId,
        ticketNumber: `TKT-${Date.now()}`,
        categoryId: input.categoryId,
        propertyId: input.propertyId,
        unitId: input.unitId,
        tenantId: input.tenantId,
        subject: input.subject,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate,
        estimatedCost: input.estimatedCost ? new Prisma.Decimal(input.estimatedCost) : null,
        status: TicketStatus.OPEN,
      },
    });

    await createAuditLog({
      action: "TICKET_CREATED",
      entity: "Ticket",
      entityId: ticket.id,
      newData: ticket,
    });

    return ticket;
  }

  async assignTicket(organizationId: string, ticketId: string, assigneeId: string) {
    await checkPermission("update", "all");

    const ticket = await maintenanceRepository.findById(ticketId, organizationId);
    if (!ticket) throw new Error("Ticket not found");

    const updated = await maintenanceRepository.update(ticketId, organizationId, {
      assigneeId,
      status: TicketStatus.ASSIGNED,
    });

    await createAuditLog({
      action: "TICKET_ASSIGNED",
      entity: "Ticket",
      entityId: ticketId,
      newData: { assigneeId, status: TicketStatus.ASSIGNED },
    });

    return updated;
  }

  async updateStatus(organizationId: string, ticketId: string, status: TicketStatus, notes?: string) {
    await checkPermission("update", "all");

    const ticket = await maintenanceRepository.findById(ticketId, organizationId);
    if (!ticket) throw new Error("Ticket not found");

    const updateData: Prisma.TicketUpdateInput = { status };
    if (status === TicketStatus.COMPLETED) {
      updateData.completedAt = new Date();
      if (notes) updateData.completionNotes = notes;
    }

    const updated = await maintenanceRepository.update(ticketId, organizationId, updateData);

    await createAuditLog({
      action: "TICKET_STATUS_UPDATED",
      entity: "Ticket",
      entityId: ticketId,
      newData: { status, notes },
    });

    return updated;
  }

  async recordCost(organizationId: string, ticketId: string, actualCost: number) {
    await checkPermission("update", "all");

    const updated = await maintenanceRepository.update(ticketId, organizationId, {
      actualCost: new Prisma.Decimal(actualCost),
    });

    await createAuditLog({
      action: "TICKET_COST_RECORDED",
      entity: "Ticket",
      entityId: ticketId,
      newData: { actualCost },
    });

    return updated;
  }

  async getDashboardStats(organizationId: string) {
    await checkPermission("read", "all");
    return maintenanceRepository.getDashboardStats(organizationId);
  }
}

export const maintenanceService = new MaintenanceService();
