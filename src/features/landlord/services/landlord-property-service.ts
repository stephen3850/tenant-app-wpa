import { landlordPropertyRepository } from "../repositories/landlord-property-repository";
import { createAuditLog } from "@/lib/audit";
import { serialize } from "@/lib/utils";

export class LandlordPropertyService {
  async getLandlordProperties(userId: string, organizationId: string, filters?: { status?: string; search?: string }) {
    const properties = await landlordPropertyRepository.getProperties(userId, organizationId, filters);

    // We don't audit the list view every time to avoid log spam,
    // but the objective says track PROPERTY_VIEWED. Usually that's for details.
    return serialize(properties);
  }

  async getLandlordProperty(propertyId: string, userId: string, organizationId: string) {
    const property = await landlordPropertyRepository.getPropertyById(propertyId, userId, organizationId);

    if (property) {
      await createAuditLog({
        action: "PROPERTY_VIEWED",
        entity: "Property",
        entityId: propertyId,
        organizationId,
        userId,
      } as any);
    }

    return serialize(property);
  }

  async getPropertyUnits(propertyId: string, userId: string, organizationId: string) {
    const units = await landlordPropertyRepository.getPropertyUnits(propertyId, userId, organizationId);

    await createAuditLog({
      action: "UNIT_BREAKDOWN_VIEWED",
      entity: "Property",
      entityId: propertyId,
      organizationId,
      userId,
    } as any);

    return serialize(units);
  }

  async getPropertyDocuments(propertyId: string, userId: string, organizationId: string) {
    const documents = await landlordPropertyRepository.getPropertyDocuments(propertyId, userId, organizationId);
    return serialize(documents);
  }

  async getPropertyPerformance(propertyId: string, userId: string, organizationId: string, period: "MTD" | "PM" | "YTD" = "MTD") {
    const performance = await landlordPropertyRepository.getPropertyPerformance(propertyId, userId, organizationId, period);

    await createAuditLog({
      action: "PROPERTY_PERFORMANCE_VIEWED",
      entity: "Property",
      entityId: propertyId,
      organizationId,
      userId,
    } as any);

    return serialize(performance);
  }

  async getTenancyInsights(propertyId: string, userId: string, organizationId: string) {
    const insights = await landlordPropertyRepository.getTenancyInsights(propertyId, userId, organizationId);
    return serialize(insights);
  }

  async getMaintenanceInsights(propertyId: string, userId: string, organizationId: string) {
    const insights = await landlordPropertyRepository.getMaintenanceInsights(propertyId, userId, organizationId);
    return serialize(insights);
  }
}

export const landlordPropertyService = new LandlordPropertyService();
