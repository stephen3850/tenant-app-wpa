import { systemDb } from "@/lib/tenant-db";

export class CollectionSettingService {
  async getSettings(organizationId: string) {
    let settings = await systemDb.collectionSetting.findUnique({
      where: { organizationId },
    });

    if (!settings) {
      settings = await systemDb.collectionSetting.create({
        data: {
          organizationId,
          gracePeriod: 0,
          upcomingDueDays: "5,3,1",
          overdueDays: "1,3,7,14,30",
          autoEscalateAfter: 60,
          enableBalanceSms: false,
          firstSendDay: 16,
          repeatEvery: 3,
        },
      });
    }

    return settings;
  }

  async updateSettings(organizationId: string, data: any) {
    return await systemDb.collectionSetting.upsert({
      where: { organizationId },
      update: {
        gracePeriod: data.gracePeriod,
        upcomingDueDays: data.upcomingDueDays,
        overdueDays: data.overdueDays,
        autoEscalateAfter: data.autoEscalateAfter,
      },
      create: {
        organizationId,
        gracePeriod: data.gracePeriod,
        upcomingDueDays: data.upcomingDueDays,
        overdueDays: data.overdueDays,
        autoEscalateAfter: data.autoEscalateAfter,
      },
    });
  }

  async updateSmsSettings(organizationId: string, data: any) {
    return await systemDb.collectionSetting.upsert({
      where: { organizationId },
      update: {
        enableBalanceSms: data.enableBalanceSms,
        firstSendDay: data.firstSendDay,
        repeatEvery: data.repeatEvery,
        smsTemplate: data.smsTemplate,
      },
      create: {
        organizationId,
        enableBalanceSms: data.enableBalanceSms,
        firstSendDay: data.firstSendDay,
        repeatEvery: data.repeatEvery,
        smsTemplate: data.smsTemplate,
      },
    });
  }
}

export const collectionSettingService = new CollectionSettingService();
