import { db } from "@/lib/db";
import { auth } from "@/auth";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { Prisma } from "@prisma/client";

export class LeaseService {
  private async getOrgContext() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return (session.user as any).organizationId;
  }

  async createLease(data: {
    unitId: string;
    tenantId: string;
    startDate: Date;
    endDate?: Date;
    rentAmount: number;
    depositAmount: number;
  }) {
    const organizationId = await this.getOrgContext();
    await checkPermission("create", "lease");

    // Use transaction to create lease and update unit status
    return await db.$transaction(async (tx) => {
      const unit = await tx.unit.findUnique({ where: { id: data.unitId } });
      if (!unit) throw new Error("Unit not found");

      const lease = await tx.lease.create({
        data: {
          leaseNumber: `LSE-${Date.now()}`,
          organizationId,
          propertyId: unit.propertyId,
          unitId: data.unitId,
          tenantId: data.tenantId,
          startDate: data.startDate,
          endDate: data.endDate,
          monthlyRent: new Prisma.Decimal(data.rentAmount),
          securityDeposit: new Prisma.Decimal(data.depositAmount),
          status: "ACTIVE",
        },
      });

      await tx.unit.update({
        where: { id: data.unitId },
        data: { occupancyStatus: "OCCUPIED" },
      });

      await createAuditLog({
        action: "CREATE",
        entity: "Lease",
        entityId: lease.id,
        newData: lease,
      });

      return lease;
    });
  }

  async listLeases() {
    const organizationId = await this.getOrgContext();
    await checkPermission("read", "lease");

    return db.lease.findMany({
      where: { organizationId },
      include: {
        unit: { include: { property: true } },
        tenant: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async terminateLease(id: string) {
    const organizationId = await this.getOrgContext();
    await checkPermission("update", "lease");

    return await db.$transaction(async (tx) => {
      const lease = await tx.lease.update({
        where: { id, organizationId },
        data: { status: "TERMINATED" },
      });

      await tx.unit.update({
        where: { id: lease.unitId },
        data: { occupancyStatus: "VACANT" },
      });

      return lease;
    });
  }
}

export const leaseService = new LeaseService();
