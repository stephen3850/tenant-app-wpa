"use server";

import { auth } from "@/auth";
import { collectionSettingService } from "../services/collection-setting-service";
import { serialize } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function getOrganizationId() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return (session.user as any).organizationId;
}

export async function getCollectionSettingsAction() {
  const organizationId = await getOrganizationId();
  const settings = await collectionSettingService.getSettings(organizationId);
  return serialize(settings);
}

export async function updateCollectionSettingsAction(data: {
  gracePeriod: number;
  upcomingDueDays: string;
  overdueDays: string;
  autoEscalateAfter: number;
}) {
  const organizationId = await getOrganizationId();
  const settings = await collectionSettingService.updateSettings(organizationId, data);
  revalidatePath("/settings");
  return serialize(settings);
}

export async function updateCollectionSmsSettingsAction(data: {
  enableBalanceSms: boolean;
  firstSendDay: number;
  repeatEvery: number;
  smsTemplate?: string;
}) {
  const organizationId = await getOrganizationId();
  const settings = await collectionSettingService.updateSmsSettings(organizationId, data);
  revalidatePath("/settings");
  return serialize(settings);
}
