import { leaseRepository } from "../repositories/lease-repository";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { LeaseFormValues, LeaseFilterValues, TerminationValues } from "../schemas";
import { LeaseStatus, OccupancyStatus } from "@prisma/client";

export class LeaseService {
  private async getSession() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return session.user as any;
  }

  async listLeases(filters: LeaseFilterValues) {
    const user = await this.getSession();
    await checkPermission("read", "lease");
    return leaseRepository.findAll(user.organizationId, filters);
  }

  async getLease(id: string) {
    const user = await this.getSession();
    await checkPermission("read", "lease");
    const lease = await leaseRepository.findById(id, user.organizationId);
    if (!lease) throw new Error("Lease not found");
    return lease;
  }

  async createLease(values: LeaseFormValues) {
    const user = await this.getSession();
    await checkPermission("create", "lease");

    return await db.$transaction(async (tx) => {
      // Check if unit has an active lease
      const existingActive = await tx.lease.findFirst({
        where: {
          unitId: values.unitId,
          status: LeaseStatus.ACTIVE,
          organizationId: user.organizationId,
        }
      });

      if (existingActive) {
        throw new Error("Unit already has an active lease");
      }

      const lease = await tx.lease.create({
        data: {
          ...values,
          organizationId: user.organizationId,
        } as any,
      });

      // Update unit status to OCCUPIED
      await tx.unit.update({
        where: { id: values.unitId },
        data: { occupancyStatus: OccupancyStatus.OCCUPIED },
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

  async terminateLease(id: string, values: TerminationValues) {
    const user = await this.getSession();
    await checkPermission("update", "lease");

    return await db.$transaction(async (tx) => {
      const lease = await tx.lease.findFirst({
        where: { id, organizationId: user.organizationId }
      });

      if (!lease) throw new Error("Lease not found");

      const updated = await tx.lease.update({
        where: { id },
        data: {
          status: LeaseStatus.TERMINATED,
          moveOutDate: values.moveOutDate,
          terminationReason: values.terminationReason,
        },
      });

      // Update unit status to VACANT
      await tx.unit.update({
        where: { id: lease.unitId },
        data: { occupancyStatus: OccupancyStatus.VACANT },
      });

      await createAuditLog({
        action: "TERMINATE",
        entity: "Lease",
        entityId: id,
        newData: updated,
      });

      return updated;
    });
  }

  async renewLease(id: string, values: LeaseFormValues) {
    const user = await this.getSession();
    await checkPermission("create", "lease");

    return await db.$transaction(async (tx) => {
      const oldLease = await tx.lease.findFirst({
        where: { id, organizationId: user.organizationId }
      });

      if (!oldLease) throw new Error("Lease not found");

      // Mark old lease as RENEWED
      await tx.lease.update({
        where: { id },
        data: { status: LeaseStatus.RENEWED },
      });

      // Create new lease
      const newLease = await tx.lease.create({
        data: {
          ...values,
          organizationId: user.organizationId,
        } as any,
      });

      await createAuditLog({
        action: "RENEW",
        entity: "Lease",
        entityId: newLease.id,
        oldData: { oldLeaseId: id },
        newData: newLease,
      });

      return newLease;
    });
  }

  async restoreLease(id: string) {
    const user = await this.getSession();
    await checkPermission("update", "lease");

    const lease = await leaseRepository.restore(id, user.organizationId);

    await createAuditLog({
      action: "RESTORE",
      entity: "Lease",
      entityId: id,
      oldData: { id, status: "TERMINATED" },
      newData: { id, status: "ACTIVE" },
    });

    return lease;
  }

  async permanentDeleteLease(id: string) {
    const user = await this.getSession();
    await checkPermission("delete", "lease");

    const lease = await leaseRepository.softDelete(id, user.organizationId);

    await createAuditLog({
      action: "DELETE_PERMANENT",
      entity: "Lease",
      entityId: id,
      oldData: { id, status: "TERMINATED" },
      newData: { id, deletedAt: new Date() },
    });

    return lease;
  }

  async getLeaseStats() {
    const user = await this.getSession();
    return leaseRepository.getStats(user.organizationId);
  }
}

export const leaseService = new LeaseService();
