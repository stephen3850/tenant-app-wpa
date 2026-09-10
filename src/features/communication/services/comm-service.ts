import { db } from "@/lib/db";
import { auth } from "@/auth";

export class CommunicationService {
  async sendMessage(data: {
    type: "SMS" | "EMAIL" | "WHATSAPP";
    recipient: string;
    message: string;
  }) {
    const session = await auth();
    const organizationId = (session?.user as any).organizationId;

    // Integration logic (e.g., Twilio, Africa's Talking, Resend) would go here
    console.log(`Sending ${data.type} to ${data.recipient}: ${data.message}`);

    return db.communication.create({
      data: {
        ...data,
        organizationId,
        status: "SENT",
      },
    });
  }

  async getHistory() {
    const session = await auth();
    const organizationId = (session?.user as any).organizationId;

    return db.communication.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const communicationService = new CommunicationService();
