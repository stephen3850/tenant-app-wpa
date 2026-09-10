"use server";

import { IncidentService } from "../services/incident-service";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const service = new IncidentService();

export async function getIncidents(filters?: any) {
  await checkPermission("view", "all");
  return service.listIncidents(filters);
}

export async function getIncident(id: string) {
  await checkPermission("view", "all");
  return service.getIncident(id);
}

export async function declareIncident(data: any) {
  await checkPermission("manage", "all");
  const result = await service.declareIncident(data);

  await createAuditLog({
    action: "INCIDENT_DECLARED",
    entity: "PlatformIncident",
    entityId: result.id,
    newData: result,
  });

  revalidatePath("/admin/monitoring/incidents");
  return result;
}

export async function updateIncident(id: string, data: any) {
  await checkPermission("manage", "all");
  const result = await service.updateIncident(id, data);

  await createAuditLog({
    action: "INCIDENT_UPDATED",
    entity: "PlatformIncident",
    entityId: id,
    newData: data,
  });

  revalidatePath(`/admin/monitoring/incidents/${id}`);
  revalidatePath("/admin/monitoring/incidents");
  return result;
}

export async function publishPostmortem(id: string, postmortem: string) {
  await checkPermission("manage", "all");
  const result = await service.publishPostmortem(id, postmortem);

  await createAuditLog({
    action: "POSTMORTEM_PUBLISHED",
    entity: "PlatformIncident",
    entityId: id,
  });

  revalidatePath(`/admin/monitoring/incidents/${id}`);
  return result;
}
