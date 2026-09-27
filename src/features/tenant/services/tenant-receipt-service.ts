import { tenantReceiptRepository } from "../repositories/tenant-receipt-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { createAuditLog } from "@/lib/audit";

export class TenantReceiptService {
  async getReceipts(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    return tenantReceiptRepository.findManyByTenantId(tenant.id);
  }

  async getReceiptDetails(userId: string, receiptId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    const tenantId = tenant?.id || "";
    const userEmail = tenant?.email || undefined;

    const receipt = await tenantReceiptRepository.findById(receiptId, tenantId, userEmail, userId);
    if (!receipt) throw new Error("Receipt not found or access denied");

    await createAuditLog({
      action: "RECEIPT_VIEWED",
      entity: "Receipt",
      entityId: receipt.id,
      organizationId: receipt.payment.organizationId,
      userId: userId,
    } as any);

    return receipt;
  }

  async logReceiptDownload(userId: string, receiptId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    const tenantId = tenant?.id || "";
    const userEmail = tenant?.email || undefined;

    const receipt = await tenantReceiptRepository.findById(receiptId, tenantId, userEmail, userId);
    if (!receipt) throw new Error("Receipt not found or access denied");

    await createAuditLog({
      action: "RECEIPT_DOWNLOADED",
      entity: "Receipt",
      entityId: receipt.id,
      organizationId: receipt.payment.organizationId,
      userId: userId,
    } as any);

    return receipt;
  }
}

export const tenantReceiptService = new TenantReceiptService();
