import { db } from "@/lib/db";
import { Prisma, TicketStatus, TicketPriority } from "@prisma/client";

export class TicketRepository {
  async findById(id: string, organizationId: string) {
    return db.ticket.findFirst({
      where: { id, organizationId },
      include: {
        property: true,
        unit: true,
        tenant: true,
        category: true,
        creator: true,
        assignee: true,
        attachments: true,
        comments: {
          include: {
            user: true,
            attachments: true
          },
          orderBy: { createdAt: "asc" }
        },
        assignments: {
          include: {
            assignee: true,
            assignedBy: true
          },
          orderBy: { createdAt: "desc" }
        },
        activities: {
          include: {
            user: true
          },
          orderBy: { createdAt: "desc" }
        }
      },
    });
  }

  async createActivity(data: Prisma.TicketActivityUncheckedCreateInput) {
    return db.ticketActivity.create({ data });
  }

  async addComment(data: Prisma.TicketCommentUncheckedCreateInput) {
    return db.ticketComment.create({ data });
  }

  async assignTicket(ticketId: string, organizationId: string, assigneeId: string, assignedById: string, notes?: string) {
    const ticket = await db.ticket.findFirst({
      where: { id: ticketId, organizationId }
    });

    if (!ticket) throw new Error("Ticket not found or unauthorized");

    return db.$transaction([
      db.ticket.update({
        where: { id: ticketId },
        data: { assigneeId, status: "ASSIGNED" }
      }),
      db.ticketAssignment.create({
        data: { ticketId, assigneeId, assignedById, notes }
      })
    ]);
  }

  async findMany(organizationId: string, filters?: {
    propertyId?: string;
    unitId?: string;
    tenantId?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    categoryId?: string;
  }) {
    return db.ticket.findMany({
      where: {
        organizationId,
        ...(filters?.propertyId && { propertyId: filters.propertyId }),
        ...(filters?.unitId && { unitId: filters.unitId }),
        ...(filters?.tenantId && { tenantId: filters.tenantId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.priority && { priority: filters.priority }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
      },
      include: {
        property: true,
        unit: true,
        tenant: true,
        category: true,
        assignee: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.TicketCreateUncheckedInput) {
    return db.ticket.create({ data });
  }

  async update(id: string, organizationId: string, data: Prisma.TicketUpdateUncheckedInput) {
    const ticket = await db.ticket.findFirst({
      where: { id, organizationId }
    });

    if (!ticket) throw new Error("Ticket not found or unauthorized");

    return db.ticket.update({
      where: { id },
      data,
    });
  }

  async getDashboardStats(organizationId: string) {
    const now = new Date();
    const [open, byPriority, byStatus, overdue, slaBreaches] = await Promise.all([
      db.ticket.count({
        where: { organizationId, status: { notIn: ["RESOLVED", "CLOSED", "ARCHIVED"] } }
      }),
      db.ticket.groupBy({
        by: ['priority'],
        where: { organizationId, status: { notIn: ["RESOLVED", "CLOSED", "ARCHIVED"] } },
        _count: true
      }),
      db.ticket.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: true
      }),
      db.ticket.count({
        where: {
            organizationId,
            status: { notIn: ["RESOLVED", "CLOSED", "ARCHIVED"] },
            dueDate: { lt: now }
        }
      }),
      db.ticket.count({
        where: {
            organizationId,
            status: { notIn: ["RESOLVED", "CLOSED", "ARCHIVED"] },
            resolutionTarget: { lt: now }
        }
      })
    ]);

    // Calculate Average Resolution Time (in hours) for closed tickets in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const closedTickets = await db.ticket.findMany({
        where: {
            organizationId,
            status: "CLOSED",
            closedAt: { gte: thirtyDaysAgo },
            createdAt: { not: undefined }
        },
        select: { createdAt: true, closedAt: true }
    });

    let avgResolutionTime = 0;
    if (closedTickets.length > 0) {
        const totalDuration = closedTickets.reduce((acc, t) => {
            if (t.closedAt && t.createdAt) {
                return acc + (t.closedAt.getTime() - t.createdAt.getTime());
            }
            return acc;
        }, 0);
        avgResolutionTime = (totalDuration / closedTickets.length) / (1000 * 60 * 60); // Convert to hours
    }

    return {
      openTickets: open,
      byPriority,
      byStatus,
      overdueTickets: overdue,
      slaBreaches,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10
    };
  }
}

export const ticketRepository = new TicketRepository();
