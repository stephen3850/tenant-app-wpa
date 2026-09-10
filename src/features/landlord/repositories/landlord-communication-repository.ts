import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class LandlordCommunicationRepository {
  async getConversations(userId: string, organizationId: string, filters?: {
    category?: string;
    priority?: string;
    search?: string;
  }) {
    const where: Prisma.ConversationWhereInput = {
      organizationId,
      participants: {
        some: { userId }
      }
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.search) {
      where.subject = { contains: filters.search, mode: "insensitive" };
    }

    return db.conversation.findMany({
      where,
      include: {
        participants: {
          include: {
            user: {
              select: { name: true, image: true, email: true }
            }
          }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: { name: true }
            }
          }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { lastMessageAt: "desc" }
    });
  }

  async getConversationById(conversationId: string, userId: string, organizationId: string) {
    return db.conversation.findFirst({
      where: {
        id: conversationId,
        organizationId,
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true, email: true }
            }
          }
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: { id: true, name: true, image: true }
            },
            attachments: true
          }
        }
      }
    });
  }

  async createConversation(data: {
    organizationId: string;
    subject: string;
    category?: string;
    priority?: string;
    participantIds: string[];
    messageContent: string;
    senderId: string;
  }) {
    return db.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          organizationId: data.organizationId,
          subject: data.subject,
          category: data.category,
          priority: data.priority || "NORMAL",
          participants: {
            create: data.participantIds.map(userId => ({ userId }))
          }
        }
      });

      await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: data.senderId,
          content: data.messageContent,
        }
      });

      return conversation;
    });
  }

  async addMessage(conversationId: string, senderId: string, content: string, attachments?: any[]) {
    return db.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId,
          content,
          attachments: attachments ? {
            create: attachments
          } : undefined
        }
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() }
      });

      return message;
    });
  }

  async markAsRead(conversationId: string, userId: string) {
    return db.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId
        }
      },
      data: {
        lastReadAt: new Date()
      }
    });
  }

  async getAnnouncements(userId: string, organizationId: string) {
    // Announcements targeted at LANDLORDS or ALL
    return db.announcement.findMany({
      where: {
        organizationId,
        status: "SENT",
        OR: [
          { targetType: "ALL" },
          { targetType: "LANDLORDS" }
        ],
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        creator: {
          select: { name: true }
        },
        attachments: true,
        reads: {
          where: { userId }
        }
      },
      orderBy: { sentAt: "desc" }
    });
  }

  async markAnnouncementRead(announcementId: string, userId: string) {
    return db.announcementRead.upsert({
      where: {
        announcementId_userId: {
          announcementId,
          userId
        }
      },
      create: {
        announcementId,
        userId,
        readAt: new Date()
      },
      update: {
        readAt: new Date()
      }
    });
  }
}

export const landlordCommunicationRepository = new LandlordCommunicationRepository();
