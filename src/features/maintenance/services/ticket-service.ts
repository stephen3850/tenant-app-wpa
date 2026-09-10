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
    unitId?: string;
    tenantId?: string;
    title: string;
    description: string;
    priority: string;
  }) {
    const user = await this.getSession();
    await checkPermission("create", "ticket");

    return db.ticket.create({
      data: {
        ...data,
        organizationId: user.organizationId,
        creatorId: user.id,
        status: "OPEN",
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
      data: { status },
    });
  }
}

export const ticketService = new TicketService();
