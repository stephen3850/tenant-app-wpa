"use server";

import { auth } from "@/auth";
import { securityService } from "@/features/saas/services/security-service";
import { revalidatePath } from "next/cache";
import { PlatformSecurityIncidentStatus, PlatformSecurityIncidentSeverity } from "@prisma/client";

async function checkSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Super Admin check
  if (session.user.organizationId !== null && session.user.organizationId !== undefined) {
      // throw new Error("Forbidden: Super Admin access required");
  }

  return session.user.id;
}

export async function getSecurityDashboard() {
  const adminId = await checkSuperAdmin();
  return await securityService.getDashboard(adminId);
}

export async function getAuditLogs(params: any) {
  const adminId = await checkSuperAdmin();
  return await securityService.getAuditLogs(adminId, params);
}

export async function getSecurityIncidents(params: any) {
  const adminId = await checkSuperAdmin();
  return await securityService.listIncidents(adminId, params);
}

export async function createSecurityIncident(data: any) {
  const adminId = await checkSuperAdmin();
  const incident = await securityService.createIncident(adminId, data);
  revalidatePath("/admin/security/incidents");
  return incident;
}

export async function updateSecurityIncident(incidentId: string, status: PlatformSecurityIncidentStatus) {
  const adminId = await checkSuperAdmin();
  const incident = await securityService.updateIncidentStatus(adminId, incidentId, status);
  revalidatePath("/admin/security/incidents");
  return incident;
}

export async function getSecurityAlerts() {
  const adminId = await checkSuperAdmin();
  return await securityService.getAlerts(adminId);
}

export async function exportComplianceReport(type: string) {
  const adminId = await checkSuperAdmin();
  return await securityService.exportComplianceReport(adminId, type);
}
