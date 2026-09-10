"use server";

import { auth } from "@/auth";
import { tenantAnnouncementService } from "@/features/tenant/services/tenant-announcement-service";
import { AnnouncementCategory, AnnouncementPriority } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function getAnnouncements(filters?: {
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  isRead?: boolean;
  search?: string;
}) {
  const user = await getSession();
  return tenantAnnouncementService.getAnnouncements(user.id, filters);
}

export async function getAnnouncementDetails(announcementId: string) {
  const user = await getSession();
  return tenantAnnouncementService.getAnnouncementDetails(user.id, announcementId);
}

export async function markAnnouncementAsRead(announcementId: string) {
  const user = await getSession();
  const result = await tenantAnnouncementService.markAsRead(user.id, announcementId);
  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return result;
}

export async function acknowledgeAnnouncement(announcementId: string) {
  const user = await getSession();
  const result = await tenantAnnouncementService.acknowledge(user.id, announcementId);
  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return result;
}

export async function getUnreadAnnouncementsCount() {
  const user = await getSession();
  return tenantAnnouncementService.getUnreadCount(user.id);
}
