import { db } from "@/lib/db";
import { Prisma, SecurityIncidentStatus, SecurityIncidentSeverity } from "@prisma/client";

export class SecurityRepository {
  async findIncidentById(id: string, organizationId: string) {
    return db.securityIncident.findUnique({
      where: { id, organizationId },
      include: {
        property: true,
        category: true,
        recordedBy: true,
        evidence: {
          include: {
            uploadedBy: true
          }
        },
        activities: {
          include: {
            user: true
          },
          orderBy: { createdAt: "desc" }
        }
      },
    });
  }

  async findIncidents(organizationId: string, filters?: {
    propertyId?: string;
    status?: SecurityIncidentStatus;
    severity?: SecurityIncidentSeverity;
    categoryId?: string;
  }) {
    return db.securityIncident.findMany({
      where: {
        organizationId,
        ...(filters?.propertyId && { propertyId: filters.propertyId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.severity && { severity: filters.severity }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
      },
      include: {
        property: true,
        category: true,
        recordedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createIncident(data: Prisma.SecurityIncidentUncheckedCreateInput) {
    return db.securityIncident.create({ data });
  }

  async updateIncident(id: string, organizationId: string, data: Prisma.SecurityIncidentUncheckedUpdateInput) {
    return db.securityIncident.update({
      where: { id, organizationId },
      data,
    });
  }

  async createActivity(data: Prisma.SecurityActivityUncheckedCreateInput) {
    return db.securityActivity.create({ data });
  }

  async addEvidence(data: Prisma.SecurityEvidenceUncheckedCreateInput) {
    return db.securityEvidence.create({ data });
  }

  // Visitor Management
  async createVisitor(data: Prisma.SecurityVisitorUncheckedCreateInput) {
    return db.securityVisitor.create({ data });
  }

  async updateVisitor(id: string, organizationId: string, data: Prisma.SecurityVisitorUncheckedUpdateInput) {
    return db.securityVisitor.update({
      where: { id, organizationId },
      data,
    });
  }

  async findVisitors(organizationId: string, filters?: { onSite?: boolean }) {
    return db.securityVisitor.findMany({
      where: {
        organizationId,
        ...(filters?.onSite && { checkOutTime: null }),
      },
      include: {
        hostTenant: true,
      },
      orderBy: { checkInTime: "desc" },
    });
  }

  // Patrol Logs
  async createPatrol(data: Prisma.SecurityPatrolUncheckedCreateInput) {
    return db.securityPatrol.create({ data });
  }

  async updatePatrol(id: string, organizationId: string, data: Prisma.SecurityPatrolUncheckedUpdateInput) {
    return db.securityPatrol.update({
      where: { id, organizationId },
      data,
    });
  }

  async findPatrols(organizationId: string) {
    return db.securityPatrol.findMany({
      where: { organizationId },
      include: { officer: true },
      orderBy: { startTime: "desc" },
    });
  }

  // Shift Handover
  async createHandover(data: Prisma.SecurityShiftHandoverUncheckedCreateInput) {
    return db.securityShiftHandover.create({ data });
  }

  async findHandovers(organizationId: string) {
    return db.securityShiftHandover.findMany({
      where: { organizationId },
      include: {
        incomingOfficer: true,
        outgoingOfficer: true,
      },
      orderBy: { handoverTime: "desc" },
    });
  }

  async getDashboardStats(organizationId: string) {
    const [openIncidents, incidentsByType, visitorsOnSite] = await Promise.all([
      db.securityIncident.count({
        where: { organizationId, status: { notIn: ["CLOSED", "RESOLVED", "ARCHIVED"] } }
      }),
      db.securityIncident.groupBy({
        by: ['categoryId'],
        where: { organizationId },
        _count: true,
      }),
      db.securityVisitor.count({
        where: { organizationId, checkOutTime: null }
      }),
    ]);

    return {
      openIncidents,
      incidentsByType,
      visitorsOnSite,
    };
  }
}

export const securityRepository = new SecurityRepository();
