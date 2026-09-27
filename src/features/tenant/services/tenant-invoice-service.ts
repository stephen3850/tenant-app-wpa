import { tenantInvoiceRepository } from "../repositories/tenant-invoice-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { createAuditLog } from "@/lib/audit";
import { InvoiceStatus } from "@prisma/client";

export class TenantInvoiceService {
  async getInvoices(userId: string, filters: { status?: InvoiceStatus; search?: string }) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    return tenantInvoiceRepository.findManyByTenantId(tenant.id, filters);
  }

  async getInvoiceDetails(userId: string, invoiceId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    const tenantId = tenant?.id || "";
    const userEmail = tenant?.email || undefined;

    const invoice = await tenantInvoiceRepository.findById(invoiceId, tenantId, userEmail, userId);
    if (!invoice) throw new Error("Invoice not found or access denied");

    await createAuditLog({
      action: "INVOICE_VIEWED",
      entity: "Invoice",
      entityId: invoice.id,
      organizationId: invoice.organizationId,
      userId: userId
    } as any);

    return invoice;
  }

  async logInvoiceDownload(userId: string, invoiceId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    const tenantId = tenant?.id || "";
    const userEmail = tenant?.email || undefined;

    const invoice = await tenantInvoiceRepository.findById(invoiceId, tenantId, userEmail, userId);
    if (!invoice) throw new Error("Invoice not found");

    await createAuditLog({
      action: "INVOICE_DOWNLOADED",
      entity: "Invoice",
      entityId: invoice.id,
      organizationId: invoice.organizationId,
      userId: userId
    } as any);

    return invoice;
  }
}

export const tenantInvoiceService = new TenantInvoiceService();
