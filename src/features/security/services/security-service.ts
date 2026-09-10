import { securityRepository } from "../repositories/security-repository";
import { SecurityIncidentStatus, SecurityIncidentSeverity, SecurityActivityType, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { checkPermission } from "@/lib/permissions";

export class SecurityService {
  private async generateLogNumber(organizationId: string) {
    const count = await db.securityIncident.count({ where: { organizationId } });
    return `OB-${(count + 1).toString().padStart(6, '0')}`;
  }

  async createIncident(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "security" as any);

    const logNumber = await this.generateLogNumber(organizationId);

    const incident = await securityRepository.createIncident({
      ...data,
      logNumber,
      organizationId,
      recordedById: userId,
      status: "OPEN",
    });

    await securityRepository.createActivity({
      incidentId: incident.id,
      userId,
      type: "INCIDENT_CREATED",
      content: "Incident recorded in Occurrence Book",
    });

    await createAuditLog({
      action: "CREATE",
      entity: "SecurityIncident",
      entityId: incident.id,
      newData: incident,
    });

    return incident;
  }

  async updateIncident(userId: string, organizationId: string, incidentId: string, data: any) {
    await checkPermission("update", "security" as any);

    const oldIncident = await securityRepository.findIncidentById(incidentId, organizationId);
    const incident = await securityRepository.updateIncident(incidentId, organizationId, data);

    await createAuditLog({
      action: "UPDATE",
      entity: "SecurityIncident",
      entityId: incident.id,
      oldData: oldIncident,
      newData: incident,
    });

    return incident;
  }

  async changeStatus(userId: string, organizationId: string, incidentId: string, status: SecurityIncidentStatus, notes?: string) {
    await checkPermission("update", "security" as any);

    const oldIncident = await securityRepository.findIncidentById(incidentId, organizationId);
    const incident = await securityRepository.updateIncident(incidentId, organizationId, {
      status,
      ...(status === "CLOSED" ? { closedAt: new Date() } : {}),
      ...(status === "RESOLVED" ? { resolvedAt: new Date() } : {}),
    });

    await securityRepository.createActivity({
      incidentId,
      userId,
      type: "STATUS_CHANGE",
      oldValue: oldIncident?.status,
      newValue: status,
      content: notes,
    });

    await createAuditLog({
      action: "STATUS_CHANGE",
      entity: "SecurityIncident",
      entityId: incidentId,
      oldData: { status: oldIncident?.status },
      newData: { status },
    });

    return incident;
  }

  // Visitor Management
  async recordVisitorCheckIn(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "security" as any);

    const visitor = await securityRepository.createVisitor({
      ...data,
      organizationId,
      securityOfficerId: userId,
      checkInTime: new Date(),
    });

    await createAuditLog({
      action: "VISITOR_CHECKIN",
      entity: "SecurityVisitor",
      entityId: visitor.id,
      newData: visitor,
    });

    return visitor;
  }

  async recordVisitorCheckOut(userId: string, organizationId: string, visitorId: string) {
    await checkPermission("update", "security" as any);

    const visitor = await securityRepository.updateVisitor(visitorId, organizationId, {
      checkOutTime: new Date(),
    });

    await createAuditLog({
      action: "VISITOR_CHECKOUT",
      entity: "SecurityVisitor",
      entityId: visitorId,
    });

    return visitor;
  }

  // Patrol Logs
  async recordPatrol(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "security" as any);

    const patrol = await securityRepository.createPatrol({
      ...data,
      organizationId,
      officerId: userId,
    });

    await createAuditLog({
      action: "PATROL_RECORDED",
      entity: "SecurityPatrol",
      entityId: patrol.id,
      newData: patrol,
    });

    return patrol;
  }

  // Shift Handover
  async recordHandover(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "security" as any);

    const handover = await securityRepository.createHandover({
      ...data,
      organizationId,
      outgoingOfficerId: userId,
      handoverTime: new Date(),
    });

    await createAuditLog({
      action: "SHIFT_HANDOVER",
      entity: "SecurityShiftHandover",
      entityId: handover.id,
      newData: handover,
    });

    return handover;
  }
}

export const securityService = new SecurityService();
