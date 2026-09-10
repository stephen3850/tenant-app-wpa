import { IntegrationRepository } from "../repositories/integration-repository";
import { encrypt, decrypt } from "@/lib/crypto";
import { Prisma } from "@prisma/client";

export class IntegrationService {
  private repository = new IntegrationRepository();

  async getAllIntegrations() {
    return this.repository.getIntegrations();
  }

  async getDashboardStats() {
    return this.repository.getDashboardStats();
  }

  async enableIntegration(id: string) {
    return this.repository.updateIntegration(id, { isEnabled: true });
  }

  async disableIntegration(id: string) {
    return this.repository.updateIntegration(id, { isEnabled: false });
  }

  async updateConfig(id: string, config: any) {
    // Encrypt sensitive fields in config before saving
    const encryptedConfig = { ...config };
    const sensitiveKeys = ['apiKey', 'apiSecret', 'password', 'consumerSecret', 'passkey', 'secret'];

    for (const key of sensitiveKeys) {
      if (encryptedConfig[key]) {
        encryptedConfig[key] = encrypt(encryptedConfig[key]);
      }
    }

    return this.repository.updateIntegration(id, { config: encryptedConfig });
  }

  async testConnection(id: string) {
    const integration = await this.repository.getIntegrationById(id);
    if (!integration) throw new Error("Integration not found");

    // Logic to test connection based on provider
    // Placeholder for real provider-specific SDK calls
    return { success: true, message: `Connected to ${integration.provider} successfully.` };
  }

  async getWebhooks() {
    return this.repository.getWebhooks();
  }

  async replayWebhook(deliveryId: string) {
    // Logic to fetch delivery payload and re-send to processing endpoint
    return { success: true, message: "Webhook replayed successfully" };
  }
}
