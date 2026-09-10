import { systemDb } from "@/lib/tenant-db";
import { systemAuditLog } from "@/lib/audit";

export class NotificationService {
  async sendEmail(organizationId: string, to: string, subject: string, body: string) {
    // Integration with Resend or Postmark would go here
    console.log(`Sending Email to ${to}: ${subject}`);

    await systemAuditLog({
      action: "EMAIL_SENT",
      entity: "Communication",
      entityId: to,
      organizationId,
      newData: { to, subject },
    });
  }

  async sendSMS(organizationId: string, to: string, message: string) {
    // Integration with Africa's Talking or Twilio would go here
    console.log(`Sending SMS to ${to}: ${message}`);

    await systemAuditLog({
      action: "SMS_SENT",
      entity: "Communication",
      entityId: to,
      organizationId,
      newData: { to, messageLength: message.length },
    });
  }
}

export const notificationService = new NotificationService();
