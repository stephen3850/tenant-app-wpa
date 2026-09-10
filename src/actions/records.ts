"use server";

import { auth } from "@/auth";
import { recordsService } from "@/features/records/services/records-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function searchRecords(query: string) {
  const user = await getSession();
  return recordsService.search(user.id, user.organizationId, query);
}

export async function createComplianceRecord(data: any) {
  const user = await getSession();
  const record = await recordsService.createComplianceRecord(user.id, user.organizationId, data);
  revalidatePath("/dashboard/records/compliance");
  return record;
}

export async function updateRetentionPolicy(entityType: string, periodYears: number) {
  const user = await getSession();
  const policy = await recordsService.updateRetentionPolicy(user.id, user.organizationId, entityType, periodYears);
  revalidatePath("/dashboard/records/settings");
  return policy;
}

export async function logRecordView(entityType: string, entityId: string) {
  const user = await getSession();
  return recordsService.logView(user.id, user.organizationId, entityType, entityId);
}
