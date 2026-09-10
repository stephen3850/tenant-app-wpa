import { systemDb } from "@/lib/tenant-db";
import { Prisma, IncidentStatus, IncidentSeverity } from "@prisma/client";

export class IncidentRepository {
  async getIncidents(params: { status?: IncidentStatus; severity?: IncidentSeverity } = {}) {
    return systemDb.platformIncident.findMany({
      where: params,
      include: {
        commander: { select: { name: true, email: true } },
        _count: { select: { updates: true } },
        affectedSystems: true,
      },
      orderBy: { startedAt: "desc" },
    });
  }

  async getIncidentById(id: string) {
    return systemDb.platformIncident.findUnique({
      where: { id },
      include: {
        commander: { select: { name: true, email: true } },
        updates: {
          include: { creator: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
        affectedSystems: true,
      },
    });
  }

  async createIncident(data: Prisma.PlatformIncidentUncheckedCreateInput) {
    return systemDb.platformIncident.create({ data });
  }

  async updateIncident(id: string, data: Prisma.PlatformIncidentUpdateInput) {
    return systemDb.platformIncident.update({
      where: { id },
      data,
    });
  }

  async addUpdate(incidentId: string, content: string, status: IncidentStatus, createdById: string) {
    return systemDb.platformIncidentUpdate.create({
      data: {
        incidentId,
        content,
        status,
        createdById,
      },
    });
  }

  async setAffectedSystems(incidentId: string, systems: { systemName: string; status: string }[]) {
    // Delete existing and recreate
    await systemDb.platformAffectedSystem.deleteMany({ where: { incidentId } });
    return systemDb.platformAffectedSystem.createMany({
      data: systems.map(s => ({ ...s, incidentId })),
    });
  }
}
