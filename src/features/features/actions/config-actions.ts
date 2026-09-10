"use server";

import { ConfigService } from "../services/config-service";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { ConfigCategory } from "@prisma/client";

const service = new ConfigService();

export async function getConfigurations(category?: ConfigCategory) {
  await checkPermission("view", "all");
  return service.getConfigs(category);
}

export async function updateConfiguration(key: string, value: any, category?: ConfigCategory) {
  await checkPermission("manage", "all");
  const configs = await service.getConfigs();
  const oldConfig = configs.find(c => c.key === key);

  const result = await service.updateConfig(key, value, category);

  await createAuditLog({
    action: "CONFIGURATION_UPDATED",
    entity: "PlatformConfiguration",
    entityId: key,
    oldData: oldConfig?.value,
    newData: value,
  });

  revalidatePath("/admin/config");
  return result;
}
