import { subscriptionRepository } from "../repositories/subscription-repository";
import { billingInvoiceRepository } from "../repositories/billing-invoice-repository";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import { SubscriptionStatus } from "@prisma/client";

export class BillingService {
  async getSubscription(organizationId: string) {
    await checkPermission("view", "billing");
    return subscriptionRepository.findByOrganizationId(organizationId);
  }

  async changePlan(userId: string, organizationId: string, newPlanId: string) {
    await checkPermission("update", "billing");

    const oldSubscription = await subscriptionRepository.findByOrganizationId(organizationId);
    const subscription = await subscriptionRepository.update(organizationId, {
      planId: newPlanId,
    });

    await createAuditLog({
      action: "PLAN_CHANGED",
      entity: "Subscription",
      entityId: subscription.id,
      oldData: oldSubscription,
      newData: subscription,
    });

    return subscription;
  }

  async cancelSubscription(userId: string, organizationId: string) {
    await checkPermission("update", "billing");

    const subscription = await subscriptionRepository.update(organizationId, {
      cancelAtPeriodEnd: true,
      canceledAt: new Date(),
    });

    await createAuditLog({
      action: "SUBSCRIPTION_CANCELLED",
      entity: "Subscription",
      entityId: subscription.id,
      newData: { cancelAtPeriodEnd: true },
    });

    return subscription;
  }

  async getBillingInvoices(organizationId: string) {
    await checkPermission("view", "billing");
    return billingInvoiceRepository.findMany(organizationId);
  }

  async recordPayment(userId: string, organizationId: string, invoiceId: string, amount: number, method: string, transactionRef?: string) {
    await checkPermission("pay", "billing");

    const payment = await billingInvoiceRepository.createPayment({
      organizationId,
      billingInvoiceId: invoiceId,
      amount,
      method,
      transactionRef,
      status: "COMPLETED",
    });

    await createAuditLog({
      action: "PAYMENT_RECORDED",
      entity: "BillingInvoice",
      entityId: invoiceId,
      newData: payment,
    });

    return payment;
  }

  async getPlans() {
    return subscriptionRepository.findPlans();
  }

  async getUsageStats(organizationId: string) {
    await checkPermission("view", "billing");

    const activeUnits = await db.unit.count({
      where: {
        property: { organizationId },
        status: "ACTIVE",
        deletedAt: null
      }
    });

    const activeUsers = await db.user.count({
      where: {
        organizationId,
        status: "ACTIVE"
      }
    });

    const metrics = await subscriptionRepository.getUsageMetrics(organizationId);

    const smsSent = await db.communication.count({
      where: { organizationId, type: "SMS", status: "SENT" }
    });

    const emailSent = await db.communication.count({
      where: { organizationId, type: "EMAIL", status: "SENT" }
    });

    return {
      activeUnits,
      activeUsers,
      smsSent,
      emailSent,
      historical: metrics
    };
  }

  async generateMonthlyInvoice(organizationId: string) {
    const subscription = await subscriptionRepository.findByOrganizationId(organizationId);
    if (!subscription) throw new Error("No subscription found");

    const usage = await this.getUsageStats(organizationId);
    const plan = subscription.plan;
    const features = plan.features as any;

    let subtotal = Number(plan.price);
    const items = [
      { description: `${plan.name} Base Subscription`, amount: Number(plan.price) }
    ];

    // Overage logic (Example)
    if (usage.activeUnits > features.maxUnits) {
      const overage = (usage.activeUnits - features.maxUnits) * (features.unitOveragePrice || 0);
      if (overage > 0) {
        items.push({ description: `Unit Overage (${usage.activeUnits - features.maxUnits} units)`, amount: overage });
        subtotal += overage;
      }
    }

    if (usage.activeUsers > features.maxUsers) {
        const overage = (usage.activeUsers - features.maxUsers) * (features.userOveragePrice || 0);
        if (overage > 0) {
            items.push({ description: `User Overage (${usage.activeUsers - features.maxUsers} users)`, amount: overage });
            subtotal += overage;
        }
    }

    const taxAmount = subtotal * 0.16; // 16% VAT example
    const total = subtotal + taxAmount;

    const invoice = await billingInvoiceRepository.create({
      organizationId,
      subscriptionId: subscription.id,
      invoiceNumber: `INV-SAAS-${Date.now()}`,
      periodStart: new Date(), // Should be calculated based on billing cycle
      periodEnd: new Date(),   // Should be calculated based on billing cycle
      amount: subtotal,
      tax: taxAmount,
      total: total,
      status: "ISSUED",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      lineItems: {
        create: items
      }
    });

    await createAuditLog({
      action: "INVOICE_ISSUED",
      entity: "BillingInvoice",
      entityId: invoice.id,
      newData: invoice,
    });

    return invoice;
  }
}

export const billingService = new BillingService();
