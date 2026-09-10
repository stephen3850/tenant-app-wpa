import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { systemAuditLog } from "@/lib/audit";
import { vendorRepository } from "../repositories/vendor-repository";

export class VendorService {
  async createVendor(organizationId: string, data: any) {
    await checkPermission("create", "all");
    const vendor = await vendorRepository.create({ ...data, organizationId });

    await systemAuditLog({
      action: "VENDOR_CREATED",
      entity: "Vendor",
      entityId: vendor.id,
      organizationId,
      newData: vendor,
    });

    return vendor;
  }

  async updateVendor(organizationId: string, vendorId: string, data: any) {
    await checkPermission("update", "all");
    const updated = await vendorRepository.update(vendorId, organizationId, data);

    await systemAuditLog({
      action: "VENDOR_UPDATED",
      entity: "Vendor",
      entityId: vendorId,
      organizationId,
      newData: updated,
    });

    return updated;
  }
}

export const vendorService = new VendorService();
