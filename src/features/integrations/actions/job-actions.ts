"use server";

import { JobService } from "../services/job-service";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const service = new JobService();

export async function getJobs(params: any) {
  await checkPermission("view", "all");
  return service.getJobs(params);
}

export async function getJob(id: string) {
  await checkPermission("view", "all");
  return service.getJobDetails(id);
}

export async function retryJob(id: string) {
  await checkPermission("manage", "all");
  const result = await service.retryJob(id);

  await createAuditLog({
    action: "JOB_RETRIED",
    entity: "PlatformJob",
    entityId: id,
  });

  revalidatePath("/admin/jobs");
  return result;
}

export async function cancelJob(id: string) {
  await checkPermission("manage", "all");
  const result = await service.cancelJob(id);

  await createAuditLog({
    action: "JOB_CANCELLED",
    entity: "PlatformJob",
    entityId: id,
  });

  revalidatePath("/admin/jobs");
  return result;
}

export async function getScheduledTasks() {
  await checkPermission("view", "all");
  return service.getScheduledTasks();
}
