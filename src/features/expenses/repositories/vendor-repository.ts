import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class VendorRepository {
  async findById(id: string, organizationId: string) {
    return db.vendor.findUnique({
      where: { id, organizationId },
    });
  }

  async findMany(organizationId: string) {
    return db.vendor.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
  }

  async create(data: Prisma.VendorCreateUncheckedInput) {
    return db.vendor.create({ data });
  }

  async update(id: string, organizationId: string, data: Prisma.VendorUpdateUncheckedInput) {
    return db.vendor.update({
      where: { id, organizationId },
      data,
    });
  }
}

export const vendorRepository = new VendorRepository();
