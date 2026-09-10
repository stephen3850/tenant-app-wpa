import { db } from "@/lib/db";
import { auth } from "@/auth";
import { checkPermission } from "@/lib/permissions";

export class TicketService {
  private async getSession() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return session.user as any;
  }

  async createTicket(data: {
    propertyId: string;
    categoryId: string;
    unitId?: string;
    tenantId?: string;
    subject: string;
    description: string;
    priority: string;
  }) {
    const user = await this.getSession();
    await checkPermission("create", "ticket");

    return db.ticket.create({
      data: {
        ...data,
        ticketNumber: `TKT-${Date.now()}`,
        organizationId: user.organizationId,
        creatorId: user.id,
        status: "OPEN",
        priority: data.priority as any,
      },
    });
  }

  async listTickets() {
    const user = await this.getSession();
    await checkPermission("read", "ticket");

    return db.ticket.findMany({
      where: { organizationId: user.organizationId },
      include: {
        property: true,
        unit: true,
        tenant: true,
        assignee: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateTicketStatus(id: string, status: string) {
    const user = await this.getSession();
    await checkPermission("update", "ticket");

    return db.ticket.update({
      where: { id, organizationId: user.organizationId },
      data: { status: status as any },
    });
  }
}

export const ticketService = new TicketService();
