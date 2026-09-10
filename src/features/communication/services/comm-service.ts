import { db } from "@/lib/db";
import { auth } from "@/auth";
import { CommunicationType } from "@prisma/client";

export class CommunicationService {
  async sendMessage(data: {
    type: CommunicationType;
    recipient: string;
    message: string;
  }) {
    const session = await auth();
    const organizationId = (session?.user as any)?.organizationId as string;

    if (!organizationId) {
      throw new Error("Organization ID not found in session");
    }

    // Integration logic (e.g., Twilio, Africa's Talking, Resend) would go here
    console.log(`Sending ${data.type} to ${data.recipient}: ${data.message}`);

    return db.communication.create({
      data: {
        type: data.type,
        recipient: data.recipient,
        content: data.message,
        organizationId,
        status: "SENT",
      },
    });
  }

  async getHistory() {
    const session = await auth();
    const organizationId = (session?.user as any)?.organizationId as string;

    if (!organizationId) {
      return [];
    }

    return db.communication.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const communicationService = new CommunicationService();
