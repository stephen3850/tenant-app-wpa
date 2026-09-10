import { unitRepository } from "../repositories/unit-repository";
import { checkPermission } from "@/lib/permissions";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { UnitFormValues, UnitFilters } from "../schemas/unit-schema";
import { OccupancyStatus, UnitStatus, Prisma } from "@prisma/client";

export class UnitService {
  private async getSession() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return session.user as any;
  }

  async listUnits(filters: UnitFilters) {
    const user = await this.getSession();
    await checkPermission("read", "unit");
    return unitRepository.findAll(user.organizationId, filters);
  }

  async getUnit(id: string) {
    const user = await this.getSession();
    await checkPermission("read", "unit");
    const unit = await unitRepository.findById(id, user.organizationId);
    if (!unit) throw new Error("Unit not found");
    return unit;
  }

  async bulkCreateUnits(propertyId: string, units: any[]) {
    const user = await this.getSession();
    await checkPermission("create", "unit");

    const formattedUnits = units.map(u => ({
      ...u,
      propertyId,
      monthlyRent: new Prisma.Decimal(u.monthlyRent || 0),
      securityDeposit: new Prisma.Decimal(u.securityDeposit || 0),
      serviceCharge: new Prisma.Decimal(u.serviceCharge || 0),
      status: UnitStatus.ACTIVE,
      occupancyStatus: OccupancyStatus.VACANT,
    }));

    const result = await unitRepository.createMany(formattedUnits);

    await createAuditLog({
      action: "BULK_CREATE",
      entity: "Unit",
      entityId: propertyId,
      newData: { count: result.count, units: formattedUnits },
    });

    return result;
  }

  async createUnit(values: UnitFormValues) {
    const user = await this.getSession();
    await checkPermission("create", "unit");

    const unit = await unitRepository.create({
      unitNumber: values.unitNumber,
      unitCode: values.unitCode,
      unitType: values.unitType,
      block: values.block,
      floor: values.floor,
      monthlyRent: values.monthlyRent,
      securityDeposit: values.securityDeposit,
      serviceCharge: values.serviceCharge,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      squareFootage: values.squareFootage,
      occupancyStatus: values.occupancyStatus,
      status: values.status,
      property: { connect: { id: values.propertyId } },
    });

    await createAuditLog({
      action: "CREATE",
      entity: "Unit",
      entityId: unit.id,
      newData: unit,
    });

    return unit;
  }

  async bulkCreateUnits(propertyId: string, units: any[]) {
    const user = await this.getSession();
    await checkPermission("create", "unit");

    const formattedUnits = units.map(u => ({
      ...u,
      propertyId,
      monthlyRent: new Prisma.Decimal(u.monthlyRent || 0),
      securityDeposit: new Prisma.Decimal(u.securityDeposit || 0),
      serviceCharge: new Prisma.Decimal(u.serviceCharge || 0),
      status: UnitStatus.ACTIVE,
      occupancyStatus: OccupancyStatus.VACANT,
    }));

    const result = await unitRepository.createMany(formattedUnits);

    await createAuditLog({
      action: "BULK_CREATE",
      entity: "Unit",
      entityId: propertyId,
      newData: { count: result.count, units: formattedUnits },
    });

    return result;
  }

  async updateUnit(id: string, values: Partial<UnitFormValues>) {
    const user = await this.getSession();
    await checkPermission("update", "unit");

    const oldData = await unitRepository.findById(id, user.organizationId);
    if (!oldData) throw new Error("Unit not found");

    const updated = await unitRepository.update(id, user.organizationId, values as any);

    await createAuditLog({
      action: "UPDATE",
      entity: "Unit",
      entityId: id,
      oldData,
      newData: updated,
    });

    return updated;
  }

  async archiveUnit(id: string) {
    const user = await this.getSession();
    await checkPermission("delete", "unit");

    const oldData = await unitRepository.findById(id, user.organizationId);
    // Archive only sets status to INACTIVE
    const updated = await unitRepository.archive(id, user.organizationId);

    await createAuditLog({
      action: "ARCHIVE",
      entity: "Unit",
      entityId: id,
      oldData,
      newData: updated,
    });

    return updated;
  }

  async permanentDeleteUnit(id: string) {
    const user = await this.getSession();
    await checkPermission("delete", "unit");

    const oldData = await unitRepository.findById(id, user.organizationId);
    // Permanent delete sets deletedAt
    const updated = await unitRepository.softDelete(id, user.organizationId);

    await createAuditLog({
      action: "DELETE_PERMANENT",
      entity: "Unit",
      entityId: id,
      oldData,
      newData: updated,
    });

    return updated;
  }

  async restoreUnit(id: string) {
    const user = await this.getSession();
    await checkPermission("update", "unit");

    const oldData = await unitRepository.findById(id, user.organizationId);
    const updated = await unitRepository.restore(id, user.organizationId);

    await createAuditLog({
      action: "RESTORE",
      entity: "Unit",
      entityId: id,
      oldData,
      newData: updated,
    });

    return updated;
  }

  async updateOccupancy(id: string, status: OccupancyStatus) {
    const user = await this.getSession();
    await checkPermission("update", "unit");

    const oldData = await unitRepository.findById(id, user.organizationId);
    const updated = await unitRepository.update(id, user.organizationId, { occupancyStatus: status });

    await createAuditLog({
      action: "UPDATE_OCCUPANCY",
      entity: "Unit",
      entityId: id,
      oldData: { occupancyStatus: oldData?.occupancyStatus },
      newData: { occupancyStatus: status },
    });

    return updated;
  }

  async syncOccupancyStatus(id: string) {
    const user = await this.getSession();
    const unit = await unitRepository.findById(id, user.organizationId);
    if (!unit) throw new Error("Unit not found");

    const activeLease = unit.leases.find(l => l.status === "ACTIVE");
    const newStatus = activeLease ? OccupancyStatus.OCCUPIED : OccupancyStatus.VACANT;

    if (unit.occupancyStatus !== newStatus && unit.occupancyStatus !== OccupancyStatus.MAINTENANCE) {
      await this.updateOccupancy(id, newStatus);
    }
  }

  async getUnitStats() {
    const user = await this.getSession();
    return unitRepository.getStats(user.organizationId);
  }
}

export const unitService = new UnitService();
