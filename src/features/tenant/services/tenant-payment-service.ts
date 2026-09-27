import { tenantPaymentRepository } from "../repositories/tenant-payment-repository";
import { tenantDashboardRepository } from "../repositories/tenant-dashboard-repository";
import { paymentRouter } from "@/lib/payments/router";
import { paymentProviderFactory } from "@/lib/payments/provider-factory";
import { db } from "@/lib/db";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";
import { maskPhoneNumber } from "@/lib/encryption";

export class TenantPaymentService {
  async getPaymentDashboard(userId: string) {
    const tenant = await tenantDashboardRepository.getTenantByUserId(userId);
    if (!tenant) throw new Error("Tenant profile not found");

    const [summary, recentPayments, outstandingInvoices] = await Promise.all([
      tenantPaymentRepository.getFinancialSummary(tenant.id),
      tenantPaymentRepository.findManyByTenantId(tenant.id, 5),
      tenantPaymentRepository.getOutstandingInvoices(tenant.id),
    ]);

    return {
      summary,
      recentPayments,
      outstandingInvoices,
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

    // Format phone number
    let formattedPhone = phoneNumber.replace(/\+/g, "").trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) {
      formattedPhone = "254" + formattedPhone;
    }

    const activeLease = await db.lease.findFirst({
      where: { tenantId: tenant.id, status: "ACTIVE" },
    });

    // Resolve tenant payment account
    const account = await paymentRouter.resolvePaymentAccount({
      organizationId: tenant.organizationId,
      propertyId: activeLease?.propertyId,
      leaseId: activeLease?.id,
      invoiceId,
      paymentMethod: PaymentMethod.MPESA,
    });

    const accountRef = tenant.tenantCode || tenant.id.slice(0, 8);

    // Create PENDING Payment & MpesaTransaction
    const pendingPayment = await db.payment.create({
      data: {
        organizationId: tenant.organizationId,
        tenantId: tenant.id,
        leaseId: activeLease?.id,
        invoiceId,
        paymentAccountId: account.id,
        amount,
        method: PaymentMethod.MPESA,
        status: PaymentStatus.PENDING,
        notes: `STK Push initiated for ${accountRef}`,
      },
    });

    const mpesaTx = await db.mpesaTransaction.create({
      data: {
        organizationId: tenant.organizationId,
        tenantId: tenant.id,
        invoiceId,
        paymentAccountId: account.id,
        paymentId: pendingPayment.id,
        amount,
        phoneNumber: formattedPhone,
        accountReference: accountRef,
        status: "PENDING",
        transactionType: "STK_PUSH",
      },
    });

    // Initiate via Provider Abstraction
    const provider = paymentProviderFactory.getProvider("MPESA");
    const result = await provider.initiatePayment(
      {
        amount,
        phoneNumber: formattedPhone,
        accountReference: accountRef,
        paymentAccountId: account.id,
        organizationId: tenant.organizationId,
        tenantId: tenant.id,
        invoiceId,
        leaseId: activeLease?.id,
        propertyId: activeLease?.propertyId,
      },
      account
    );

    if (result.success) {
      await db.payment.update({
        where: { id: pendingPayment.id },
        data: { status: PaymentStatus.STK_REQUESTED },
      });

      await db.mpesaTransaction.update({
        where: { id: mpesaTx.id },
        data: {
          merchantRequestId: result.merchantRequestId,
          checkoutRequestId: result.checkoutRequestId,
          status: "STK_REQUESTED",
        },
      });

      await createAuditLog({
        action: "STK_PUSH_INITIATED",
        entity: "MpesaTransaction",
        entityId: result.checkoutRequestId || pendingPayment.id,
        organizationId: tenant.organizationId,
        userId,
        newData: {
          amount,
          phone: maskPhoneNumber(formattedPhone),
          account: account.displayName,
          checkoutRequestId: result.checkoutRequestId,
        },
      } as any);

      return {
        ResponseCode: "0",
        MerchantRequestID: result.merchantRequestId,
        CheckoutRequestID: result.checkoutRequestId,
        ResponseDescription: result.responseDescription || "STK push initiated successfully",
        CustomerMessage: result.customerMessage,
      };
    } else {
      await db.payment.update({
        where: { id: pendingPayment.id },
        data: { status: PaymentStatus.FAILED },
      });

      await db.mpesaTransaction.update({
        where: { id: mpesaTx.id },
        data: { status: "FAILED", resultDesc: result.responseDescription },
      });

      return {
        ResponseCode: "1",
        ResponseDescription: result.responseDescription || "STK Push failed",
      };
    }
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
