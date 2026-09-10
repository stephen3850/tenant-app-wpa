"use server";

import { auth } from "@/auth";
import { landlordCommunicationService } from "@/features/landlord/services/landlord-communication-service";
import { revalidatePath } from "next/cache";

async function getLandlordSession() {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.organizationId) {
    throw new Error("Unauthorized");
  }
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
  };
}

export async function getLandlordConversations(filters?: any) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordCommunicationService.getConversations(userId, organizationId, filters);
}

export async function getLandlordConversation(conversationId: string) {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordCommunicationService.getConversation(conversationId, userId, organizationId);
}

export async function startLandlordConversation(data: any) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordCommunicationService.startConversation(userId, organizationId, data);
  revalidatePath("/landlord/communication");
  return result;
}

export async function replyToLandlordConversation(conversationId: string, content: string, attachments?: any[]) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordCommunicationService.reply(conversationId, userId, organizationId, content, attachments);
  revalidatePath(`/landlord/communication/${conversationId}`);
  return result;
}

export async function getLandlordAnnouncements() {
  const { userId, organizationId } = await getLandlordSession();
  return await landlordCommunicationService.getAnnouncements(userId, organizationId);
}

export async function acknowledgeLandlordAnnouncement(announcementId: string) {
  const { userId, organizationId } = await getLandlordSession();
  const result = await landlordCommunicationService.acknowledgeAnnouncement(announcementId, userId, organizationId);
  revalidatePath("/landlord/communication");
  return result;
}

export async function markLandlordMessageRead(conversationId: string) {
    const { userId, organizationId } = await getLandlordSession();
    // getConversation already marks it as read in the service
    return await landlordCommunicationService.getConversation(conversationId, userId, organizationId);
}
