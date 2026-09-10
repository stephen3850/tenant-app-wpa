import { systemDb } from "@/lib/tenant-db";
import { ConfigCategory, Prisma } from "@prisma/client";

export class ConfigRepository {
  async getConfigurations(category?: ConfigCategory) {
    return systemDb.platformConfiguration.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });
  }

  async getConfigurationByKey(key: string) {
    return systemDb.platformConfiguration.findUnique({
      where: { key },
    });
  }

  async updateConfiguration(key: string, value: any, category?: ConfigCategory) {
    return systemDb.platformConfiguration.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
        category: category || "PLATFORM",
      },
    });
  }
}
