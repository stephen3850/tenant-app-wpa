import { landlordMaintenanceRepository } from "../repositories/landlord-maintenance-repository";
import { createAuditLog } from "@/lib/audit";

export class LandlordMaintenanceService {
  async getMaintenanceDashboard(userId: string, organizationId: string, period: "MTD" | "QTD" | "YTD" = "MTD") {
    const data = await landlordMaintenanceRepository.getMaintenanceDashboard(userId, organizationId, period);

    await createAuditLog({
      action: "MAINTENANCE_OVERSIGHT_VIEWED",
      entity: "Maintenance",
      entityId: userId,
    });

    return data;
  }

  async getMaintenanceTickets(userId: string, organizationId: string, filters?: any) {
    const data = await landlordMaintenanceRepository.getMaintenanceTickets(userId, organizationId, filters);

    await createAuditLog({
      action: "TICKET_OVERSIGHT_VIEWED",
      entity: "Maintenance",
      entityId: userId,
    });

    return data;
  }

  async getEmergencyTickets(userId: string, organizationId: string) {
    const data = await landlordMaintenanceRepository.getEmergencyTickets(userId, organizationId);

    await createAuditLog({
      action: "EMERGENCY_OVERSIGHT_VIEWED",
      entity: "Maintenance",
      entityId: userId,
    });

    return data;
  }

  async getMaintenanceAnalytics(userId: string, organizationId: string, period: "MTD" | "QTD" | "YTD" = "MTD") {
    const data = await landlordMaintenanceRepository.getMaintenanceAnalytics(userId, organizationId, period);

    await createAuditLog({
      action: "MAINTENANCE_ANALYTICS_VIEWED",
      entity: "Maintenance",
      entityId: userId,
    });

    return data;
  }

  async getVendorPerformance(userId: string, organizationId: string) {
    const data = await landlordMaintenanceRepository.getVendorPerformance(userId, organizationId);

    await createAuditLog({
      action: "VENDOR_PERFORMANCE_VIEWED",
      entity: "Maintenance",
      entityId: userId,
    });

    return data;
  }
}

export const landlordMaintenanceService = new LandlordMaintenanceService();
