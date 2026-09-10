"use server";

import { IntegrationService } from "../services/integration-service";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const service = new IntegrationService();

export async function getIntegrationsDashboard() {
  await checkPermission("view", "all"); // Super Admin check
  return service.getDashboardStats();
}

export async function getIntegrations() {
  await checkPermission("view", "all");
  return service.getAllIntegrations();
}

export async function enableIntegration(id: string) {
  await checkPermission("manage", "all");
  const result = await service.enableIntegration(id);

  await createAuditLog({
    action: "INTEGRATION_ENABLED",
    entity: "PlatformIntegration",
    entityId: id,
    newData: { isEnabled: true },
  });

  revalidatePath("/admin/integrations");
  return result;
}

export async function disableIntegration(id: string) {
  await checkPermission("manage", "all");
  const result = await service.disableIntegration(id);

  await createAuditLog({
    action: "INTEGRATION_DISABLED",
    entity: "PlatformIntegration",
    entityId: id,
    newData: { isEnabled: false },
  });

  revalidatePath("/admin/integrations");
  return result;
}

export async function updateIntegrationConfig(id: string, config: any) {
  await checkPermission("manage", "all");
  const result = await service.updateConfig(id, config);

  await createAuditLog({
    action: "SECRET_ROTATED",
    entity: "PlatformIntegration",
    entityId: id,
    reason: "Manual configuration update",
  });

  revalidatePath("/admin/integrations");
  return result;
}

export async function testIntegrationConnection(id: string) {
  await checkPermission("manage", "all");
  const result = await service.testConnection(id);

  await createAuditLog({
    action: "CONNECTION_TESTED",
    entity: "PlatformIntegration",
    entityId: id,
    newData: result,
  });

  return result;
}

export async function getWebhooks() {
  await checkPermission("view", "all");
  return service.getWebhooks();
}

export async function replayWebhook(deliveryId: string) {
  await checkPermission("manage", "all");
  const result = await service.replayWebhook(deliveryId);

  await createAuditLog({
    action: "WEBHOOK_REPLAYED",
    entity: "PlatformWebhookDelivery",
    entityId: deliveryId,
  });

  return result;
}
