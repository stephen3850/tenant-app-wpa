import { ConfigRepository } from "../repositories/config-repository";
import { ConfigCategory } from "@prisma/client";

export class ConfigService {
  private repository = new ConfigRepository();

  async getConfigs(category?: ConfigCategory) {
    return this.repository.getConfigurations(category);
  }

  async updateConfig(key: string, value: any, category?: ConfigCategory) {
    return this.repository.updateConfiguration(key, value, category);
  }

  // Helper to get typed config
  async getSettings() {
    const configs = await this.repository.getConfigurations();
    return configs.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  }
}
