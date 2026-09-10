"use server";

import { auth } from "@/auth";
import { communicationService } from "@/features/communication/services/communication-service";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user as any;
}

export async function sendSMS(recipient: string, message: string) {
  const user = await getSession();
  const comm = await communicationService.sendSMS(user.id, user.organizationId, recipient, message);
  revalidatePath("/dashboard/communication/sms");
  return comm;
}

export async function sendEmail(recipient: string, subject: string, body: string) {
  const user = await getSession();
  const comm = await communicationService.sendEmail(user.id, user.organizationId, recipient, subject, body);
  revalidatePath("/dashboard/communication/email");
  return comm;
}

export async function createAnnouncement(data: any) {
  const user = await getSession();
  const announcement = await communicationService.createAnnouncement(user.id, user.organizationId, data);
  revalidatePath("/dashboard/communication/announcements");
  return announcement;
}

export async function markNotificationRead(notificationId: string) {
  const user = await getSession();
  const notification = await communicationService.markNotificationRead(user.id, user.organizationId, notificationId);
  revalidatePath("/dashboard/communication/notifications");
  return notification;
}
