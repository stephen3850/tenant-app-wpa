import { propertyRepository } from "../repositories/property-repository";
import { checkPermission } from "@/lib/permissions";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { PropertyFormValues, PropertyFilterValues } from "../schemas";
import { Prisma } from "@prisma/client";

export class PropertyService {
  private async getSession() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return session.user as any;
  }

  async listProperties(filters: PropertyFilterValues) {
    const user = await this.getSession();
    await checkPermission("read", "property");

    const where: Prisma.PropertyWhereInput = {
      organizationId: user.organizationId,
    };

    if (filters.search) {
      where.OR = [
        { propertyName: { contains: filters.search, mode: "insensitive" } },
        { propertyCode: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.status) where.status = filters.status;
    if (filters.county) where.county = filters.county;
    if (filters.landlordId) where.landlordId = filters.landlordId;

    // RBAC: Landlords can only see their own properties
    if (user.roles?.includes("LANDLORD")) {
      where.landlordId = user.id;
    }

    return propertyRepository.findMany(where);
  }

  async createProperty(values: PropertyFormValues) {
    const user = await this.getSession();
    await checkPermission("create", "property");

    const property = await propertyRepository.create({
      ...values,
      organization: { connect: { id: user.organizationId } },
      manager: { connect: { id: user.id } },
    } as any);

    await createAuditLog({
      action: "CREATE",
      entity: "Property",
      entityId: property.id,
      newData: property,
    });

    return property;
  }

  async updateProperty(id: string, values: PropertyFormValues) {
    const user = await this.getSession();
    await checkPermission("update", "property");

    const oldData = await propertyRepository.findUnique(id, user.organizationId);
    if (!oldData) throw new Error("Property not found");

    const updated = await propertyRepository.update(id, user.organizationId, values);

    await createAuditLog({
      action: "UPDATE",
      entity: "Property",
      entityId: id,
      oldData,
      newData: updated,
    });

    return updated;
  }

  async archiveProperty(id: string) {
    const user = await this.getSession();
    await checkPermission("update", "property");

    return propertyRepository.update(id, user.organizationId, { status: "ARCHIVED" });
  }

  async deleteProperty(id: string) {
    const user = await this.getSession();
    await checkPermission("delete", "property");

    // "Deleting" from main list now archives it
    const property = await propertyRepository.archive(id, user.organizationId);

    await createAuditLog({
      action: "ARCHIVE",
      entity: "Property",
      entityId: id,
      oldData: { id, status: "ACTIVE" },
      newData: { id, status: "ARCHIVED" },
    });

    return property;
  }

  async permanentDeleteProperty(id: string) {
    const user = await this.getSession();
    await checkPermission("delete", "property");

    const property = await propertyRepository.softDelete(id, user.organizationId);

    await createAuditLog({
      action: "DELETE_PERMANENT",
      entity: "Property",
      entityId: id,
      oldData: { id, status: "ARCHIVED" },
      newData: { id, deletedAt: new Date() },
    });

    return property;
  }

  async restoreProperty(id: string) {
    const user = await this.getSession();
    await checkPermission("update", "property");

    const property = await propertyRepository.restore(id, user.organizationId);

    await createAuditLog({
      action: "RESTORE",
      entity: "Property",
      entityId: id,
      oldData: { id, status: "ARCHIVED" },
      newData: { id, status: "ACTIVE" },
    });

    return property;
  }

  async getDashboardStats() {
    const user = await this.getSession();
    const orgId = user.organizationId;

    const [total, active, archived] = await Promise.all([
      propertyRepository.count({ organizationId: orgId }),
      propertyRepository.count({ organizationId: orgId, status: "ACTIVE" }),
      propertyRepository.count({ organizationId: orgId, status: "ARCHIVED" }),
    ]);

    return { total, active, archived, occupancy: 0 }; // Occupancy logic would go here
  }
}

export const propertyService = new PropertyService();
