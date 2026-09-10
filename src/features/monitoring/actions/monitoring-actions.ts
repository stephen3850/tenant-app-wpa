"use server";

import { MonitoringService } from "../services/monitoring-service";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";

const service = new MonitoringService();

export async function getSystemHealth() {
  await checkPermission("view", "all");
  return service.getHealthDashboard();
}

export async function getIntegrationHealth() {
  await checkPermission("view", "all");
  return service.getIntegrations();
}

export async function getSentryErrors() {
  await checkPermission("view", "all");
  return service.getSentryErrors();
}

export async function getAxiomLogs(query?: string) {
  await checkPermission("view", "all");
  return service.getAxiomLogs(query);
}

export async function getAlertRules() {
  await checkPermission("manage", "all");
  return service.getAlerts();
}

export async function getStatusPage() {
  // Public access might be allowed, but for super admin management:
  await checkPermission("view", "all");
  return service.getStatusPageData();
}
