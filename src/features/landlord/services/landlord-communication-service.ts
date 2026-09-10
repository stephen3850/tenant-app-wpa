import { landlordCommunicationRepository } from "../repositories/landlord-communication-repository";
import { createAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";

export class LandlordCommunicationService {
  async getConversations(userId: string, organizationId: string, filters?: any) {
    const conversations = await landlordCommunicationRepository.getConversations(userId, organizationId, filters);

    await createAuditLog({
      action: "COMMUNICATION_CENTER_VIEWED",
      entity: "Conversation",
      entityId: "LIST",
      organizationId,
      userId,
    } as any);

    return conversations;
  }

  async getConversation(conversationId: string, userId: string, organizationId: string) {
    const conversation = await landlordCommunicationRepository.getConversationById(conversationId, userId, organizationId);

    if (conversation) {
      await landlordCommunicationRepository.markAsRead(conversationId, userId);

      await createAuditLog({
        action: "MESSAGE_VIEWED",
        entity: "Conversation",
        entityId: conversationId,
        organizationId,
        userId,
      } as any);
    }

    return conversation;
  }

  async startConversation(userId: string, organizationId: string, data: {
    subject: string;
    category: string;
    priority: string;
    message: string;
  }) {
    // Landlords start conversations with managers.
    // We need to find appropriate managers to include in the conversation.
    // For now, let's include the property managers of properties owned by this landlord.

    const ownedProperties = await db.property.findMany({
      where: { landlordId: userId, organizationId },
      select: { managerId: true }
    });

    const managerIds = Array.from(new Set(ownedProperties.map(p => p.managerId).filter(id => !!id))) as string[];

    // If no specific property manager, we might need a general organization admin or support user.
    // For simplicity, let's just pick all users with PROPERTY_MANAGER role in the org if none found.
    if (managerIds.length === 0) {
       const orgManagers = await db.userRole.findMany({
         where: {
           role: { name: "PROPERTY_MANAGER", organizationId: organizationId },
           user: { organizationId }
         },
         select: { userId: true }
       });
       managerIds.push(...orgManagers.map(m => m.userId));
    }

    const participantIds = [userId, ...managerIds];

    const conversation = await landlordCommunicationRepository.createConversation({
      organizationId,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      participantIds,
      messageContent: data.message,
      senderId: userId
    });

    await createAuditLog({
      action: "MESSAGE_SENT",
      entity: "Conversation",
      entityId: conversation.id,
      organizationId,
      userId,
    } as any);

    return conversation;
  }

  async reply(conversationId: string, userId: string, organizationId: string, content: string, attachments?: any[]) {
    // Verify participation
    const conversation = await landlordCommunicationRepository.getConversationById(conversationId, userId, organizationId);
    if (!conversation) throw new Error("Conversation not found or access denied");

    const message = await landlordCommunicationRepository.addMessage(conversationId, userId, content, attachments);

    await createAuditLog({
      action: "MESSAGE_REPLIED",
      entity: "Message",
      entityId: message.id,
      organizationId,
      userId,
    } as any);

    return message;
  }

  async getAnnouncements(userId: string, organizationId: string) {
    return await landlordCommunicationRepository.getAnnouncements(userId, organizationId);
  }

  async acknowledgeAnnouncement(announcementId: string, userId: string, organizationId: string) {
    await landlordCommunicationRepository.markAnnouncementRead(announcementId, userId);

    await createAuditLog({
      action: "MESSAGE_READ",
      entity: "Announcement",
      entityId: announcementId,
      organizationId,
      userId,
    } as any);

    return { success: true };
  }
}

export const landlordCommunicationService = new LandlordCommunicationService();
