import { qstash } from "@/lib/qstash";

export class JobPublisher {
  /**
   * Queues an email notification.
   */
  async queueEmail(params: { organizationId: string; to: string; subject: string; body: string }) {
    return qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/notifications/email`,
      body: params,
    });
  }

  /**
   * Queues an SMS notification.
   */
  async queueSMS(params: { organizationId: string; to: string; message: string }) {
    return qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/notifications/sms`,
      body: params,
    });
  }

  /**
   * Queues a dashboard refresh for an organization.
   */
  async queueDashboardRefresh(organizationId: string) {
    return qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/dashboard-refresh`,
      body: { organizationId },
    });
  }
}

export const jobPublisher = new JobPublisher();
