"use server";

// Project structure consolidated to src/actions
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { checkPermission } from "@/lib/permissions";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";

import fs from "fs";
import path from "path";
import crypto from "crypto";

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

export async function getProperties(orgId?: string) {
  let organizationId = orgId;
  if (!organizationId) {
    const context = await getContext();
    organizationId = context.organizationId;
  }
  await checkPermission("read", "property");
  const tenantDb = getTenantDb(organizationId);
  const properties = await tenantDb.property.findMany({
    where: {
      deletedAt: null,
      status: { not: "ARCHIVED" }
    },
    include: {
      _count: { select: { units: true } },
      units: {
        where: { deletedAt: null },
        select: { occupancyStatus: true, status: true }
      },
      landlord: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" },
  });
  return serialize(properties);
}

export async function getProperty(id: string) {
  const { organizationId } = await getContext();
  await checkPermission("read", "property");
  const tenantDb = getTenantDb(organizationId);
  const property = await tenantDb.property.findFirst({
    where: {
      id,
      organizationId,
      deletedAt: null,
      status: { not: "ARCHIVED" }
    },
    include: {
      units: {
        where: { deletedAt: null }
      },
      landlord: { select: { id: true, name: true, email: true, phone: true } }
    },
  });
  return serialize(property);
}

export async function getPropertyUnits(propertyId: string) {
  const { organizationId } = await getContext();
  await checkPermission("read", "property");
  const tenantDb = getTenantDb(organizationId);
  const units = await tenantDb.unit.findMany({
    where: {
      propertyId,
      deletedAt: null
    },
    orderBy: { unitNumber: "asc" },
  });
  return serialize(units);
}

export async function createProperty(values: any) {
  try {
    const { organizationId } = await getContext();
    await checkPermission("create", "property");
    const tenantDb = getTenantDb(organizationId);

    // Handle image upload to disk
    let featuredImageUrl = values.featuredImage;
    if (featuredImageUrl && featuredImageUrl.startsWith("data:image")) {
      try {
        const base64Data = featuredImageUrl.split(",")[1];
        const mimeType = featuredImageUrl.split(";")[0].split(":")[1];
        const extension = mimeType.split("/")[1] || "png";
        const fileName = `prop_${crypto.randomUUID()}.${extension}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        fs.writeFileSync(path.join(uploadDir, fileName), base64Data, "base64");
        featuredImageUrl = `/uploads/${fileName}`;
      } catch (err) {
        console.error("Image save failed:", err);
        featuredImageUrl = null;
      }
    }

    const property = await tenantDb.property.create({
      data: {
        organizationId,
        propertyName: values.propertyName || values.name,
        propertyCode: values.propertyCode || values.code,
        propertyType: values.propertyType || values.type,
        address: values.address || "N/A",
        city: values.city || "N/A",
        county: values.county || "Nairobi",
        description: values.description,
        featuredImage: featuredImageUrl,
        numberOfFloors: Number(values.numberOfFloors || 0),
        paybillNumber: values.paybillNumber,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        accountFormat: values.accountFormat,
        customFormat: values.customFormat,
        serviceChargeRate: values.serviceChargeRate ? Number(values.serviceChargeRate) : 0,
        waterUnitRate: values.waterUnitRate ? Number(values.waterUnitRate) : null,
        utilityDueRule: values.utilityDueRule || "Reading date",
        daysAfterReading: values.daysAfterReading ? Number(values.daysAfterReading) : null,
        nextMonthDay: values.nextMonthDay ? Number(values.nextMonthDay) : null,
        incomeTaxRate: values.incomeTaxRate ? Number(values.incomeTaxRate) : 0,
        landlordId: values.landlordId || null,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entity: "Property",
      entityId: property.id,
      newData: property,
    });

    revalidatePath("/properties");
    return serialize({ success: true, data: property });
  } catch (error: any) {
    console.error("Property creation error:", error);
    if (error.code === 'P2002') {
      return { error: "A property with this code already exists." };
    }
    return { error: error.message || "Failed to create property" };
  }
}

export async function updateProperty(id: string, values: any) {
  const { organizationId } = await getContext();
  await checkPermission("update", "property");
  const tenantDb = getTenantDb(organizationId);

  const oldData = await tenantDb.property.findUnique({ where: { id } });

  const updated = await tenantDb.property.update({
    where: { id },
    data: {
      propertyName: values.name,
      propertyCode: values.code,
      propertyType: values.type,
      address: values.address,
      city: values.city,
      county: values.county,
      description: values.description,
    },
  });

  await createAuditLog({
    action: "UPDATE",
    entity: "Property",
    entityId: id,
    oldData,
    newData: updated,
  });

  revalidatePath("/properties");
  revalidatePath(`/properties/${id}`);
  return serialize({ success: "Property updated!", data: updated });
}

export async function deleteProperty(id: string) {
  const { organizationId } = await getContext();
  await checkPermission("delete", "property");
  const tenantDb = getTenantDb(organizationId);

  const property = await tenantDb.property.findUnique({ where: { id } });
  if (!property) throw new Error("Property not found");

  await tenantDb.property.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entity: "Property",
    entityId: id,
    oldData: property,
  });

  revalidatePath("/properties");
  return { success: "Property deleted!" };
}

export async function getPropertyStats(orgId?: string) {
  let organizationId = orgId;
  if (!organizationId) {
    const context = await getContext();
    organizationId = context.organizationId;
  }
  try {
    const tenantDb = getTenantDb(organizationId);
    const [propertyCount, unitStats] = await Promise.all([
      tenantDb.property.count({
        where: { deletedAt: null, status: { not: "ARCHIVED" } }
      }),
      tenantDb.unit.groupBy({
        where: {
          property: {
            organizationId,
            deletedAt: null,
            status: { not: "ARCHIVED" }
          },
          deletedAt: null
        },
        by: ['occupancyStatus'],
        _count: { _all: true }
      })
    ]);

    const occupiedUnits = unitStats.find(s => s.occupancyStatus === 'OCCUPIED')?._count._all || 0;
    const vacantUnits = unitStats.find(s => s.occupancyStatus === 'VACANT')?._count._all || 0;
    const totalUnits = occupiedUnits + vacantUnits;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    return {
      propertyCount,
      occupiedUnits,
      vacantUnits,
      occupancyRate
    };
  } catch (error) {
    console.error("Error fetching property stats:", error);
    return null;
  }
}

export async function getLandlords(orgId?: string) {
  let organizationId = orgId;
  if (!organizationId) {
    const context = await getContext();
    organizationId = context.organizationId;
  }

  // Only return users who have the "LANDLORD" role and are active
  return await db.user.findMany({
    where: {
      organizationId,
      status: "ACTIVE",
      userRoles: {
        some: {
          role: {
            name: "LANDLORD"
          }
        }
      }
    },
    select: { id: true, name: true, email: true }
  });
}
