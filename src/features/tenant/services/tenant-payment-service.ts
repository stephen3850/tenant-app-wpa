import { tenantPaymentRepository } from "../repositories/tenant-payment-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { mpesaService } from "@/features/mpesa/services/mpesa-service";
import { createAuditLog } from "@/lib/audit";

export class TenantPaymentService {
  async getPaymentDashboard(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const [summary, recentPayments, outstandingInvoices] = await Promise.all([
      tenantPaymentRepository.getFinancialSummary(tenant.id),
      tenantPaymentRepository.findManyByTenantId(tenant.id, 5),
      tenantPaymentRepository.getOutstandingInvoices(tenant.id)
    ]);

    return {
      summary,
      recentPayments,
      outstandingInvoices
    };
  }

  async getPaymentHistory(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    return tenantPaymentRepository.findManyByTenantId(tenant.id);
  }

  async initiateSTKPush(userId: string, amount: number, phoneNumber: string, invoiceId?: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    // Formatting phone number (Kenya specific for M-Pesa)
    let formattedPhone = phoneNumber.replace(/\+/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) {
      formattedPhone = "254" + formattedPhone;
    }

    const result = await mpesaService.initiateSTKPush(tenant.organizationId, {
      amount,
      phoneNumber: formattedPhone,
      tenantId: tenant.id,
      accountReference: tenant.tenantCode || tenant.id.slice(0, 8),
      invoiceId // Optional: can be used in callback to allocate specifically
    });

    await createAuditLog({
      action: "PAYMENT_INITIATED",
      entity: "MpesaTransaction",
      entityId: result.CheckoutRequestID || "N/A",
      organizationId: tenant.organizationId,
      userId: userId,
      newData: { amount, phoneNumber: formattedPhone, invoiceId }
    } as any);

    return result;
  }

  async getMpesaStatus(userId: string, checkoutRequestId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const transaction = await tenantPaymentRepository.findMpesaTransactionByCheckoutId(checkoutRequestId);
    if (!transaction) throw new Error("Transaction not found");
    if (transaction.tenantId !== tenant.id) throw new Error("Unauthorized");

    return transaction;
  }
}

export const tenantPaymentService = new TenantPaymentService();
