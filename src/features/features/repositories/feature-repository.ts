import { systemDb } from "@/lib/tenant-db";
import { FeatureStatus, FeatureScope, Prisma } from "@prisma/client";

export class FeatureRepository {
  async getFeatureFlags(params: {
    status?: FeatureStatus;
    scope?: FeatureScope;
    search?: string;
  } = {}) {
    const { status, scope, search } = params;
    const where: Prisma.FeatureFlagWhereInput = {};

    if (status) where.status = status;
    if (scope) where.scope = scope;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { key: { contains: search, mode: "insensitive" } },
      ];
    }

    return systemDb.featureFlag.findMany({
      where,
      include: {
        _count: {
          select: { overrides: true }
        },
        lastModifiedBy: {
          select: { name: true }
        }
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getFeatureFlagById(id: string) {
    return systemDb.featureFlag.findUnique({
      where: { id },
      include: {
        overrides: {
          include: {
            organization: {
              select: { name: true, slug: true }
            }
          }
        },
        versions: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });
  }

  async createFeatureFlag(data: Prisma.FeatureFlagCreateInput) {
    return systemDb.featureFlag.create({ data });
  }

  async updateFeatureFlag(id: string, data: Prisma.FeatureFlagUpdateInput) {
    return systemDb.featureFlag.update({
      where: { id },
      data,
    });
  }

  async createVersion(flagId: string, data: any, createdById: string, reason?: string) {
    return systemDb.featureFlagVersion.create({
      data: {
        flagId,
        versionData: data,
        createdById,
        reason,
      }
    });
  }

  async setOverride(flagId: string, orgId: string, isEnabled: boolean, reason?: string) {
    return systemDb.featureFlagOverride.upsert({
      where: {
        flagId_organizationId: {
          flagId,
          organizationId: orgId
        }
      },
      update: {
        isEnabled,
        reason,
      },
      create: {
        flagId,
        organizationId: orgId,
        isEnabled,
        reason,
      }
    });
  }

  async getDashboardStats() {
    const [total, active, disabled, scheduled] = await Promise.all([
      systemDb.featureFlag.count(),
      systemDb.featureFlag.count({ where: { status: "ENABLED" } }),
      systemDb.featureFlag.count({ where: { status: "DISABLED" } }),
      systemDb.featureFlag.count({ where: { status: "SCHEDULED" } }),
    ]);

    const overrides = await systemDb.featureFlagOverride.count();

    return {
      totalFlags: total,
      activeFlags: active,
      disabledFlags: disabled,
      scheduledFlags: scheduled,
      totalOverrides: overrides,
    };
  }
}
