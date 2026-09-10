import { db } from "@/lib/db";
import { Prisma, MeterStatus, ReadingStatus } from "@prisma/client";

export class UtilityRepository {
  // Meter Management
  async findMeters(organizationId: string, filters?: { propertyId?: string; status?: MeterStatus }) {
    return db.utilityMeter.findMany({
      where: {
        organizationId,
        ...(filters?.propertyId && { propertyId: filters.propertyId }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        property: true,
        unit: true,
        utilityType: true,
      },
      orderBy: { meterNumber: "asc" },
    });
  }

  async findMeterById(id: string, organizationId: string) {
    return db.utilityMeter.findUnique({
      where: { id, organizationId },
      include: {
        property: true,
        unit: true,
        utilityType: true,
        readings: {
          orderBy: { readingDate: "desc" },
          take: 10,
        },
      },
    });
  }

  async createMeter(data: Prisma.UtilityMeterUncheckedCreateInput) {
    return db.utilityMeter.create({ data });
  }

  // Reading Management
  async findReadings(organizationId: string, filters?: { meterId?: string; status?: ReadingStatus }) {
    return db.utilityReading.findMany({
      where: {
        organizationId,
        ...(filters?.meterId && { meterId: filters.meterId }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        meter: {
          include: {
            utilityType: true,
            property: true,
            unit: true,
          }
        },
        recordedBy: true,
        approvedBy: true,
      },
      orderBy: { readingDate: "desc" },
    });
  }

  async createReading(data: Prisma.UtilityReadingUncheckedCreateInput) {
    return db.utilityReading.create({ data });
  }

  async updateReading(id: string, organizationId: string, data: Prisma.UtilityReadingUncheckedUpdateInput) {
    return db.utilityReading.update({
      where: { id, organizationId },
      data,
    });
  }

  async findLastApprovedReading(meterId: string) {
    return db.utilityReading.findFirst({
      where: { meterId, status: "APPROVED" },
      orderBy: { readingDate: "desc" },
    });
  }

  // Utility Types
  async findUtilityTypes(organizationId: string) {
    return db.utilityType.findMany({
      where: {
        OR: [
          { organizationId },
          { isSystem: true }
        ]
      },
      orderBy: { name: "asc" },
    });
  }

  // Billing Rules
  async findBillingRules(organizationId: string, propertyId?: string) {
    return db.utilityBillingRule.findMany({
      where: {
        organizationId,
        ...(propertyId && { propertyId }),
      },
      include: {
        utilityType: true,
        property: true,
      },
    });
  }

  async findBillingRule(propertyId: string, utilityTypeId: string) {
    return db.utilityBillingRule.findUnique({
      where: {
        propertyId_utilityTypeId: { propertyId, utilityTypeId }
      }
    });
  }

  async getDashboardStats(organizationId: string) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [billedThisMonth, pendingApproval, faultyMeters] = await Promise.all([
      db.utilityReading.count({
        where: { organizationId, status: "BILLED", updatedAt: { gte: firstDayOfMonth } }
      }),
      db.utilityReading.count({
        where: { organizationId, status: "PENDING_APPROVAL" }
      }),
      db.utilityMeter.count({
        where: { organizationId, status: "FAULTY" }
      })
    ]);

    return {
      billedThisMonth,
      pendingApproval,
      faultyMeters,
    };
  }
}

export const utilityRepository = new UtilityRepository();
