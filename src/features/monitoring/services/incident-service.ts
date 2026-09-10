import { IncidentRepository } from "../repositories/incident-repository";
import { IncidentStatus, IncidentSeverity } from "@prisma/client";
import { auth } from "@/auth";

export class IncidentService {
  private repository = new IncidentRepository();

  async listIncidents(filters: any) {
    return this.repository.getIncidents(filters);
  }

  async getIncident(id: string) {
    return this.repository.getIncidentById(id);
  }

  async declareIncident(data: any) {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    const incident = await this.repository.createIncident({
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: "INVESTIGATING",
      commanderId: data.commanderId || userId,
    });

    if (data.affectedSystems) {
      await this.repository.setAffectedSystems(incident.id, data.affectedSystems);
    }

    await this.repository.addUpdate(
      incident.id,
      "Incident declared. Investigation started.",
      "INVESTIGATING",
      userId
    );

    return incident;
  }

  async updateIncident(id: string, data: any) {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (data.content) {
      await this.repository.addUpdate(id, data.content, data.status, userId);
    }

    return this.repository.updateIncident(id, {
      status: data.status,
      severity: data.severity,
      resolvedAt: data.status === "RESOLVED" ? new Date() : undefined,
    });
  }

  async publishPostmortem(id: string, postmortem: string) {
    return this.repository.updateIncident(id, {
      postmortem,
      isPublic: true,
    });
  }
}
