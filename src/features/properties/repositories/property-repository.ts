import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class PropertyRepository {
  async findMany(where: Prisma.PropertyWhereInput) {
    return db.property.findMany({
      where: {
        ...where,
        deletedAt: null, // Global soft-delete filter
        status: where.status !== undefined ? where.status : { not: "ARCHIVED" } // Default: exclude archived
      },
      include: {
        landlord: { select: { name: true, email: true } },
        caretaker: { select: { name: true } },
        _count: { select: { units: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findUnique(id: string, organizationId: string) {
    return db.property.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        landlord: true,
        caretaker: true,
        units: true,
      },
    });
  }

  async create(data: Prisma.PropertyCreateInput) {
    return db.property.create({ data });
  }

  async update(id: string, organizationId: string, data: Prisma.PropertyUpdateInput) {
    const property = await db.property.findFirst({
      where: { id, organizationId },
    });

    if (!property) throw new Error("Property not found or unauthorized");

    return db.property.update({
      where: { id },
      data,
    });
  }

  async archive(id: string, organizationId: string) {
    const property = await db.property.findFirst({
      where: { id, organizationId },
    });

    if (!property) throw new Error("Property not found or unauthorized");

    return db.property.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
  }

  async softDelete(id: string, organizationId: string) {
    const property = await db.property.findFirst({
      where: { id, organizationId },
    });

    if (!property) throw new Error("Property not found or unauthorized");

    return db.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, organizationId: string) {
    const property = await db.property.findFirst({
      where: { id, organizationId },
    });

    if (!property) throw new Error("Property not found or unauthorized");

    return db.property.update({
      where: { id },
      data: { deletedAt: null, status: "ACTIVE" },
    });
  }

  async count(where: Prisma.PropertyWhereInput) {
    return db.property.count({
      where: {
        ...where,
        deletedAt: null,
        status: where.status !== undefined ? where.status : { not: "ARCHIVED" }
      },
    });
  }
}

export const propertyRepository = new PropertyRepository();
