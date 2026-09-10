import { communicationRepository } from "../repositories/communication-repository";
import { CommunicationType, CommunicationStatus, Prisma } from "@prisma/client";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";

export class CommunicationService {
  async sendSMS(userId: string, organizationId: string, recipient: string, message: string) {
    await checkPermission("send", "communications" as any);

    const comm = await communicationRepository.create({
      organizationId,
      type: "SMS",
      recipient,
      content: message,
      status: "SENT", // Simulating immediate send
      sentAt: new Date(),
    });

    await createAuditLog({
      action: "SEND_SMS",
      entity: "Communication",
      entityId: comm.id,
      newData: { recipient, message },
    });

    return comm;
  }

  async sendEmail(userId: string, organizationId: string, recipient: string, subject: string, body: string) {
    await checkPermission("send", "communications" as any);

    const comm = await communicationRepository.create({
      organizationId,
      type: "EMAIL",
      recipient,
      subject,
      content: body,
      status: "SENT", // Simulating immediate send
      sentAt: new Date(),
    });

    await createAuditLog({
      action: "SEND_EMAIL",
      entity: "Communication",
      entityId: comm.id,
      newData: { recipient, subject, body },
    });

    return comm;
  }

  async createAnnouncement(userId: string, organizationId: string, data: any) {
    await checkPermission("announce", "communications" as any);

    const announcement = await communicationRepository.createAnnouncement({
      ...data,
      organizationId,
      createdById: userId,
    });

    await createAuditLog({
      action: "CREATE_ANNOUNCEMENT",
      entity: "Announcement",
      entityId: announcement.id,
      newData: announcement,
    });

    return announcement;
  }

  async markNotificationRead(userId: string, organizationId: string, notificationId: string) {
    const notification = await communicationRepository.markNotificationRead(notificationId, userId);

    await createAuditLog({
      action: "NOTIFICATION_READ",
      entity: "Notification",
      entityId: notificationId,
    });

    return notification;
  }

  async createInAppNotification(organizationId: string, userId: string, title: string, message: string, type: string = "INFO", link?: string) {
    return db.notification.create({
      data: {
        organizationId,
        userId,
        title,
        message,
        type,
        link,
      }
    });
  }

  async renderTemplate(templateName: string, organizationId: string, variables: Record<string, string>) {
    const template = await db.communicationTemplate.findFirst({
      where: {
        name: templateName,
        OR: [{ organizationId }, { isSystem: true }]
      }
    });

    if (!template) throw new Error(`Template ${templateName} not found`);

    let renderedBody = template.body;
    let renderedSubject = template.subject || "";

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      renderedBody = renderedBody.replace(new RegExp(placeholder, "g"), value);
      renderedSubject = renderedSubject.replace(new RegExp(placeholder, "g"), value);
    }

    return {
      subject: renderedSubject,
      body: renderedBody,
      type: template.type
    };
  }

  // Automation triggers (internal use)
  async triggerAutomation(organizationId: string, event: string, context: any) {
    // Example: Trigger on payment received
    if (event === "PAYMENT_RECEIVED") {
        const { tenant, payment } = context;
        const template = await this.renderTemplate("PAYMENT_CONFIRMATION", organizationId, {
            tenantName: `${tenant.firstName} ${tenant.lastName}`,
            amount: payment.amount.toString(),
            receiptNumber: payment.receiptNumber || payment.id
        });

        if (template.type === "SMS" && tenant.phone) {
            await this.sendSMS("SYSTEM", organizationId, tenant.phone, template.body);
        } else if (template.type === "EMAIL" && tenant.email) {
            await this.sendEmail("SYSTEM", organizationId, tenant.email, template.subject, template.body);
        }
    }
  }
}

export const communicationService = new CommunicationService();
