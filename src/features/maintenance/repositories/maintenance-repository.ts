import { db } from "@/lib/db";
import { Prisma, TicketStatus, TicketPriority } from "@prisma/client";

export class MaintenanceRepository {
  async findById(id: string, organizationId: string) {
    return db.ticket.findUnique({
      where: { id, organizationId },
      include: {
        property: true,
        unit: true,
        tenant: true,
        creator: true,
        assignee: true,
        attachments: true,
      },
    });
  }

  async create(data: Prisma.TicketUncheckedCreateInput) {
    return db.ticket.create({
      data,
      include: { attachments: true },
    });
  }

  async update(id: string, organizationId: string, data: Prisma.TicketUncheckedUpdateInput) {
    return db.ticket.update({
      where: { id, organizationId },
      data,
    });
  }

  async findMany(organizationId: string, filters?: { status?: TicketStatus; priority?: TicketPriority; propertyId?: string }) {
    return db.ticket.findMany({
      where: {
        organizationId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.priority && { priority: filters.priority }),
        ...(filters?.propertyId && { propertyId: filters.propertyId }),
      },
      include: {
        property: true,
        unit: true,
        tenant: true,
        assignee: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDashboardStats(organizationId: string) {
    const stats = await db.$transaction([
      db.ticket.count({ where: { organizationId, status: { notIn: ["RESOLVED", "CLOSED", "ARCHIVED"] } } }),
      db.ticket.count({ where: { organizationId, status: "OPEN" } }),
      db.ticket.count({ where: { organizationId, status: "IN_PROGRESS" } }),
      db.ticket.count({ where: { organizationId, priority: "URGENT", status: { notIn: ["RESOLVED", "CLOSED", "ARCHIVED"] } } }),
    ]);

    return {
      activeTickets: stats[0],
      openTickets: stats[1],
      inProgressTickets: stats[2],
      urgentTickets: stats[3],
    };
  }
}

export const maintenanceRepository = new MaintenanceRepository();
