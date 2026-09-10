import { db } from "@/lib/db";
import { TicketStatus, Prisma } from "@prisma/client";

export class TenantMaintenanceRepository {
  async findAllByTenantId(tenantId: string, filters?: {
    status?: TicketStatus;
    search?: string;
  }) {
    const where: Prisma.TicketWhereInput = {
      tenantId,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: "insensitive" } },
        { ticketNumber: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return db.ticket.findMany({
      where,
      include: {
        category: true,
        assignee: {
          select: { name: true, image: true }
        },
        _count: {
          select: { comments: true, attachments: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string, tenantId: string) {
    return db.ticket.findUnique({
      where: { id, tenantId },
      include: {
        category: true,
        assignee: {
          select: { name: true, image: true, phone: true }
        },
        comments: {
          where: { isInternal: false },
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { name: true, image: true } },
            attachments: true
          }
        },
        attachments: true,
        activities: {
          where: { isInternal: false },
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });
  }

  async create(data: Prisma.TicketCreateInput) {
    return db.ticket.create({
      data,
      include: {
        category: true
      }
    });
  }

  async update(id: string, tenantId: string, data: Prisma.TicketUpdateInput) {
    return db.ticket.update({
      where: { id, tenantId },
      data
    });
  }

  async addComment(data: Prisma.TicketCommentCreateInput) {
    return db.ticketComment.create({
      data,
      include: {
        user: { select: { name: true, image: true } },
        attachments: true
      }
    });
  }

  async getDashboardSummary(tenantId: string) {
    const tickets = await db.ticket.findMany({
      where: { tenantId },
      select: { status: true }
    });

    return {
      open: tickets.filter(t => t.status === "OPEN" || t.status === "UNDER_REVIEW").length,
      inProgress: tickets.filter(t => t.status === "ASSIGNED" || t.status === "IN_PROGRESS").length,
      resolved: tickets.filter(t => t.status === "RESOLVED").length,
      recent: await db.ticket.findMany({
        where: { tenantId },
        orderBy: { updatedAt: "desc" },
        take: 3,
        include: { category: true }
      })
    };
  }

  async getCategories(organizationId: string) {
    return db.ticketCategory.findMany({
      where: { organizationId }
    });
  }
}

export const tenantMaintenanceRepository = new TenantMaintenanceRepository();
