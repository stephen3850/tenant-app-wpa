"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { checkPermission } from "@/lib/permissions";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";

async function getContext() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("Unauthorized: No organization context found");
  }
  return {
    organizationId: session.user.organizationId,
    userId: session.user.id,
  };
}

export async function createUnit(propertyId: string, values: any) {
  const { organizationId } = await getContext();
  await checkPermission("create", "unit");
  const tenantDb = getTenantDb(organizationId);

  // Verify property belongs to organization
  const property = await tenantDb.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new Error("Property not found");

  const unit = await tenantDb.unit.create({
    data: {
      unitNumber: values.unitNumber,
      unitType: values.type || values.unitType,
      monthlyRent: values.rentAmount || values.monthlyRent,
      securityDeposit: values.securityDeposit || 0,
      status: values.status || "ACTIVE",
      occupancyStatus: values.occupancyStatus || "VACANT",
      propertyId: propertyId,
    },
  });

  await createAuditLog({
    action: "CREATE",
    entity: "Unit",
    entityId: unit.id,
    newData: unit,
  });

  revalidatePath(`/properties/${propertyId}`);
  return serialize({ success: "Unit created!", data: unit });
}

export async function updateUnit(id: string, values: any) {
  const { organizationId } = await getContext();
  await checkPermission("update", "unit");
  const tenantDb = getTenantDb(organizationId);

  const oldData = await tenantDb.unit.findUnique({ where: { id } });
  if (!oldData) throw new Error("Unit not found");

  const updated = await tenantDb.unit.update({
    where: { id },
    data: {
      unitNumber: values.unitNumber,
      unitType: values.type || values.unitType,
      monthlyRent: values.rentAmount || values.monthlyRent,
      securityDeposit: values.securityDeposit,
      status: values.status,
      occupancyStatus: values.occupancyStatus,
    },
  });

  await createAuditLog({
    action: "UPDATE",
    entity: "Unit",
    entityId: id,
    oldData,
    newData: updated,
  });

  revalidatePath(`/properties/${updated.propertyId}`);
  return serialize({ success: "Unit updated!", data: updated });
}

export async function deleteUnit(id: string) {
  const { organizationId } = await getContext();
  await checkPermission("delete", "unit");
  const tenantDb = getTenantDb(organizationId);

  const unit = await tenantDb.unit.findUnique({ where: { id } });
  if (!unit) throw new Error("Unit not found");

  await tenantDb.unit.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entity: "Unit",
    entityId: id,
    oldData: unit,
  });

  revalidatePath(`/properties/${unit.propertyId}`);
  return { success: "Unit deleted!" };
}
