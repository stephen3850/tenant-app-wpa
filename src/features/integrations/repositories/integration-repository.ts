import { systemDb } from "@/lib/tenant-db";
import { IntegrationType, IntegrationProvider, Prisma } from "@prisma/client";

export class IntegrationRepository {
  async getIntegrations() {
    return systemDb.platformIntegration.findMany({
      include: {
        _count: {
          select: {
            webhooks: true,
            jobs: true,
          },
        },
      },
    });
  }

  async getIntegrationById(id: string) {
    return systemDb.platformIntegration.findUnique({
      where: { id },
      include: {
        webhooks: true,
      },
    });
  }

  async updateIntegration(id: string, data: Prisma.PlatformIntegrationUpdateInput) {
    return systemDb.platformIntegration.update({
      where: { id },
      data,
    });
  }

  async getWebhooks() {
    return systemDb.platformWebhook.findMany({
      include: {
        integration: true,
      },
    });
  }

  async getWebhookDeliveries(webhookId: string) {
    return systemDb.platformWebhookDelivery.findMany({
      where: { webhookId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async getDashboardStats() {
    const [total, active, failed] = await Promise.all([
      systemDb.platformIntegration.count(),
      systemDb.platformIntegration.count({ where: { isEnabled: true } }),
      systemDb.platformJob.count({ where: { status: "FAILED" } }),
    ]);

    const jobsToday = await systemDb.platformJob.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    return {
      totalIntegrations: total,
      activeIntegrations: active,
      failedIntegrations: failed,
      jobsToday,
    };
  }
}
