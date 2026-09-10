"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTenant(data: any, organizationId: string) {
  try {
    const tenant = await prisma.tenant.create({
      data: {
        ...data,
        organizationId,
      },
    });
    revalidatePath("/manager/tenants");
    return { success: true, tenant };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Phone number already exists" };
    return { success: false, error: "Failed to create tenant" };
  }
}

export async function getTenants(organizationId: string) {
  return await prisma.tenant.findMany({
    where: { organizationId },
  });
}

export async function createLease(data: any) {
  try {
    const lease = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.findUnique({
        where: { id: data.tenantId }
      });
      if (!tenant) throw new Error("Tenant not found");

      const newLease = await tx.lease.create({
        data: {
          ...data,
          organizationId: tenant.organizationId,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          status: "ACTIVE",
        },
      });

      await tx.unit.update({
        where: { id: data.unitId },
        data: { status: "OCCUPIED" },
      });

      return newLease;
    });

    revalidatePath("/manager/leases");
    return { success: true, lease };
  } catch (error) {
    return { success: false, error: "Failed to create lease" };
  }
}

export async function getLeases(organizationId: string) {
  return await prisma.lease.findMany({
    where: {
      tenant: { organizationId },
    },
    include: {
      tenant: true,
      unit: { include: { property: true } },
    },
  });
}
