"use server";

import { auth } from "@/auth";
import { communicationService } from "../services/communication-service";
import { communicationRepository } from "../repositories/communication-repository";
import { serialize } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getNotificationsAction() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const organizationId = (session.user as any).organizationId;

  const notifications = await communicationRepository.findNotifications(userId, organizationId);
  return serialize(notifications);
}

export async function markNotificationReadAction(notificationId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const organizationId = (session.user as any).organizationId;

  await communicationService.markNotificationRead(userId, organizationId, notificationId);
  revalidatePath("/notifications");
  return { success: true };
}

export async function getCommunicationStatsAction() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    const organizationId = (session.user as any).organizationId;
    return communicationRepository.getDashboardStats(organizationId);
}
