import { tenantMaintenanceRepository } from "../repositories/tenant-maintenance-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { createAuditLog } from "@/lib/audit";
import { TicketStatus, TicketPriority, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export class TenantMaintenanceService {
  private async getTenant(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");
    return tenant;
  }

  async getRequests(userId: string, filters?: { status?: TicketStatus; search?: string }) {
    const tenant = await this.getTenant(userId);
    return tenantMaintenanceRepository.findAllByTenantId(tenant.id, filters);
  }

  async getRequestDetails(userId: string, requestId: string) {
    const tenant = await this.getTenant(userId);
    const ticket = await tenantMaintenanceRepository.findById(requestId, tenant.id);
    if (!ticket) throw new Error("Request not found or access denied");
    return ticket;
  }

  async createRequest(userId: string, data: {
    subject: string;
    description: string;
    categoryId: string;
    priority: TicketPriority;
    preferredAccessTime?: string;
    contactPreference?: string;
    attachments?: { url: string; name: string; type: string; size: number }[];
  }) {
    const tenant = await this.getTenant(userId);

    // Get an active lease to link property and unit
    const activeLease = tenant.leases.find(l => l.status === "ACTIVE" || l.status === "EXPIRING");
    if (!activeLease) throw new Error("No active lease found to associate with maintenance request");

    // Generate ticket number (simplified for this example)
    const ticketCount = await db.ticket.count({ where: { organizationId: tenant.organizationId } });
    const ticketNumber = `TKT-${(ticketCount + 1).toString().padStart(5, '0')}`;

    const ticket = await tenantMaintenanceRepository.create({
      ticketNumber,
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      status: "OPEN",
      preferredAccessTime: data.preferredAccessTime,
      contactPreference: data.contactPreference,
      organization: { connect: { id: tenant.organizationId } },
      tenant: { connect: { id: tenant.id } },
      property: { connect: { id: activeLease.propertyId } },
      unit: { connect: { id: activeLease.unitId } },
      category: { connect: { id: data.categoryId } },
      creator: { connect: { id: userId } },
      attachments: {
        create: data.attachments?.map(a => ({
          url: a.url,
          name: a.name,
          type: a.type,
          size: a.size,
          uploadedBy: { connect: { id: userId } }
        }))
      }
    });

    await createAuditLog({
      action: "MAINTENANCE_REQUEST_CREATED",
      entity: "Ticket",
      entityId: ticket.id,
      organizationId: tenant.organizationId,
      userId: userId,
      newData: { subject: data.subject, priority: data.priority }
    } as any);

    return ticket;
  }

  async addComment(userId: string, requestId: string, content: string, attachments?: { url: string; name: string; type: string; size: number }[]) {
    const tenant = await this.getTenant(userId);
    const ticket = await tenantMaintenanceRepository.findById(requestId, tenant.id);
    if (!ticket) throw new Error("Request not found");
    if (ticket.status === "CLOSED") throw new Error("Cannot add comments to a closed request");

    const comment = await tenantMaintenanceRepository.addComment({
      content,
      isInternal: false,
      ticket: { connect: { id: requestId } },
      user: { connect: { id: userId } },
      attachments: {
        create: attachments?.map(a => ({
          url: a.url,
          name: a.name,
          type: a.type,
          size: a.size,
          uploadedBy: { connect: { id: userId } },
          ticket: { connect: { id: requestId } }
        }))
      }
    });

    await createAuditLog({
      action: "MAINTENANCE_COMMENT_ADDED",
      entity: "TicketComment",
      entityId: comment.id,
      organizationId: tenant.organizationId,
      userId: userId
    } as any);

    return comment;
  }

  async confirmResolution(userId: string, requestId: string, rating: number, feedback?: string) {
    const tenant = await this.getTenant(userId);
    const ticket = await tenantMaintenanceRepository.findById(requestId, tenant.id);
    if (!ticket) throw new Error("Request not found");

    const updated = await tenantMaintenanceRepository.update(requestId, tenant.id, {
      status: "CLOSED",
      closedAt: new Date(),
      satisfactionRating: rating,
      satisfactionFeedback: feedback
    });

    await db.ticketActivity.create({
      data: {
        ticketId: requestId,
        userId: userId,
        type: "CLOSED",
        content: `Tenant confirmed resolution. Rating: ${rating}/5. Feedback: ${feedback || "None"}`
      }
    });

    await createAuditLog({
      action: "MAINTENANCE_RESOLUTION_CONFIRMED",
      entity: "Ticket",
      entityId: requestId,
      organizationId: tenant.organizationId,
      userId: userId,
      newData: { rating, feedback }
    } as any);

    return updated;
  }

  async reopenRequest(userId: string, requestId: string, reason: string) {
    const tenant = await this.getTenant(userId);
    const ticket = await tenantMaintenanceRepository.findById(requestId, tenant.id);
    if (!ticket) throw new Error("Request not found");

    const updated = await tenantMaintenanceRepository.update(requestId, tenant.id, {
      status: "REOPENED",
      closedAt: null
    });

    await db.ticketActivity.create({
      data: {
        ticketId: requestId,
        userId: userId,
        type: "REOPENED",
        content: `Tenant reopened the request. Reason: ${reason}`
      }
    });

    await createAuditLog({
      action: "MAINTENANCE_REQUEST_REOPENED",
      entity: "Ticket",
      entityId: requestId,
      organizationId: tenant.organizationId,
      userId: userId,
      newData: { reason }
    } as any);

    return updated;
  }

  async getDashboardSummary(userId: string) {
    const tenant = await this.getTenant(userId);
    return tenantMaintenanceRepository.getDashboardSummary(tenant.id);
  }

  async getCategories(userId: string) {
    const tenant = await this.getTenant(userId);
    return tenantMaintenanceRepository.getCategories(tenant.organizationId);
  }
}

export const tenantMaintenanceService = new TenantMaintenanceService();
