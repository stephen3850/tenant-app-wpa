"use server";

import { FeatureService } from "../services/feature-service";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { FeatureStatus, FeatureScope } from "@prisma/client";

const service = new FeatureService();

export async function getFeatureFlags(params: {
  status?: FeatureStatus;
  scope?: FeatureScope;
  search?: string;
} = {}) {
  await checkPermission("view", "all");
  return service.getFeatureFlags(params);
}

export async function getFeatureFlag(id: string) {
  await checkPermission("view", "all");
  return service.getFlagDetails(id);
}

export async function createFeatureFlag(data: any) {
  await checkPermission("manage", "all");
  const result = await service.createFlag(data);

  await createAuditLog({
    action: "FEATURE_FLAG_CREATED",
    entity: "FeatureFlag",
    entityId: result.id,
    newData: result,
  });

  revalidatePath("/admin/features");
  return result;
}

export async function updateFeatureFlag(id: string, data: any, reason?: string) {
  await checkPermission("manage", "all");
  const oldData = await service.getFlagDetails(id);
  const result = await service.updateFlag(id, data, reason);

  await createAuditLog({
    action: "FEATURE_FLAG_UPDATED",
    entity: "FeatureFlag",
    entityId: id,
    oldData,
    newData: result,
    reason,
  });

  revalidatePath("/admin/features");
  return result;
}

export async function enableFeatureFlag(id: string) {
  return updateFeatureFlag(id, { status: "ENABLED" }, "Enabled via dashboard");
}

export async function disableFeatureFlag(id: string) {
  return updateFeatureFlag(id, { status: "DISABLED" }, "Disabled via dashboard");
}

export async function setFeatureOverride(flagId: string, orgId: string, isEnabled: boolean, reason?: string) {
  await checkPermission("manage", "all");
  const result = await service.setOverride(flagId, orgId, isEnabled, reason);

  await createAuditLog({
    action: "OVERRIDE_CREATED",
    entity: "FeatureFlagOverride",
    entityId: result.id,
    newData: { flagId, orgId, isEnabled, reason },
  });

  revalidatePath("/admin/features");
  return result;
}

export async function getFeatureFlagsDashboard() {
  await checkPermission("view", "all");
  return service.getDashboardStats();
}
