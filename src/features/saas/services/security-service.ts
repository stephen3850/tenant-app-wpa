import { securityRepository } from "../repositories/security-repository";
import { createAuditLog } from "@/lib/audit";
import { PlatformSecurityIncidentStatus, PlatformSecurityIncidentSeverity } from "@prisma/client";

export class SecurityService {
  async getDashboard(adminId: string) {
    const stats = await securityRepository.getSecurityDashboardStats();

    await createAuditLog({
      action: "SECURITY_DASHBOARD_VIEWED",
      entity: "Platform",
      entityId: "SECURITY",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return stats;
  }

  async getAuditLogs(adminId: string, params: any) {
    const data = await securityRepository.getAuditLogs(params);

    await createAuditLog({
      action: "AUDIT_LOG_VIEWED",
      entity: "Audit",
      entityId: "GLOBAL",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return data;
  }

  async listIncidents(adminId: string, params: any) {
    return securityRepository.getSecurityIncidents(params);
  }

  async createIncident(adminId: string, data: any) {
    const incident = await securityRepository.createIncident({
      ...data,
      incidentNumber: `SEC-${Math.floor(100000 + Math.random() * 900000)}`,
    });

    await createAuditLog({
      action: "SECURITY_INCIDENT_CREATED",
      entity: "PlatformSecurityIncident",
      entityId: incident.id,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: data
    });

    return incident;
  }

  async updateIncidentStatus(adminId: string, incidentId: string, status: PlatformSecurityIncidentStatus) {
    const incident = await securityRepository.updateIncident(incidentId, {
      status,
      ...(status === "RESOLVED" ? { resolvedAt: new Date() } : {}),
      ...(status === "CLOSED" ? { closedAt: new Date() } : {}),
    });

    await createAuditLog({
      action: "SECURITY_INCIDENT_UPDATED",
      entity: "PlatformSecurityIncident",
      entityId: incidentId,
      userId: adminId,
      organizationId: "SYSTEM",
      newData: { status }
    });

    return incident;
  }

  async getAlerts(adminId: string) {
    const alerts = await securityRepository.getSecurityAlerts();

    await createAuditLog({
      action: "SECURITY_ALERT_VIEWED",
      entity: "SecurityAlert",
      entityId: "PENDING",
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return alerts;
  }

  async exportComplianceReport(adminId: string, type: string) {
    // Mock logic for compliance export
    await createAuditLog({
      action: "COMPLIANCE_REPORT_EXPORTED",
      entity: "Compliance",
      entityId: type,
      userId: adminId,
      organizationId: "SYSTEM",
    });

    return { success: true, url: "/exports/compliance-report.pdf" };
  }
}

export const securityService = new SecurityService();
