import { utilityRepository } from "../repositories/utility-repository";
import { Prisma, ReadingStatus, BillingBasis } from "@prisma/client";
import { checkPermission } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";

export class UtilityService {
  async createMeter(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "utilities" as any);

    const meter = await utilityRepository.createMeter({
      ...data,
      organizationId,
    });

    await createAuditLog({
      action: "CREATE_METER",
      entity: "UtilityMeter",
      entityId: meter.id,
      newData: meter,
    });

    return meter;
  }

  async recordReading(userId: string, organizationId: string, data: any) {
    await checkPermission("create", "utilities" as any);

    const lastReading = await utilityRepository.findLastApprovedReading(data.meterId);
    const previousReading = lastReading ? Number(lastReading.currentReading) : 0;
    const consumption = Number(data.currentReading) - previousReading;

    if (consumption < 0) {
      throw new Error("Current reading cannot be less than previous reading");
    }

    const reading = await utilityRepository.createReading({
      ...data,
      organizationId,
      previousReading: new Prisma.Decimal(previousReading),
      consumption: new Prisma.Decimal(consumption),
      recordedById: userId,
      status: "PENDING_APPROVAL",
    });

    await createAuditLog({
      action: "RECORD_READING",
      entity: "UtilityReading",
      entityId: reading.id,
      newData: reading,
    });

    return reading;
  }

  async approveReading(userId: string, organizationId: string, readingId: string) {
    await checkPermission("approve", "utilities" as any);

    return await db.$transaction(async (tx) => {
      const reading = await tx.utilityReading.findUnique({
        where: { id: readingId, organizationId },
        include: {
          meter: {
            include: {
              utilityType: true,
              property: true,
              unit: {
                include: {
                  leases: {
                    where: { status: "ACTIVE" },
                    take: 1
                  }
                }
              }
            }
          }
        }
      });

      if (!reading) throw new Error("Reading not found");
      if (reading.status !== "PENDING_APPROVAL") throw new Error("Reading is not pending approval");

      const approvedReading = await tx.utilityReading.update({
        where: { id: readingId },
        data: {
          status: "APPROVED",
          approvedById: userId,
          approvedAt: new Date(),
        }
      });

      await createAuditLog({
        action: "APPROVE_READING",
        entity: "UtilityReading",
        entityId: readingId,
        newData: { status: "APPROVED" },
      });

      // Automatically generate billing if it's a unit meter with an active lease
      const activeLease = reading.meter.unit?.leases[0];
      if (activeLease) {
        await this.generateChargeForReading(tx, approvedReading, activeLease, organizationId);
      }

      return approvedReading;
    });
  }

  private async generateChargeForReading(tx: Prisma.TransactionClient, reading: any, lease: any, organizationId: string) {
    const billingRule = await tx.utilityBillingRule.findUnique({
      where: {
        propertyId_utilityTypeId: {
          propertyId: reading.meter.propertyId,
          utilityTypeId: reading.meter.utilityTypeId
        }
      },
      include: { utilityType: true }
    });

    if (!billingRule) return;

    let amount = 0;
    const consumption = Number(reading.consumption);

    switch (billingRule.basis) {
      case "FIXED":
        amount = Number(billingRule.fixedAmount || 0);
        break;
      case "CONSUMPTION":
        amount = consumption * Number(billingRule.unitPrice || 0);
        break;
      case "TIERED":
        // Simplified tiered logic
        const tiers = billingRule.tiers as any[];
        if (tiers && Array.isArray(tiers)) {
            for (const tier of tiers) {
                if (consumption >= tier.min && (tier.max === null || consumption <= tier.max)) {
                    amount = consumption * tier.price;
                    break;
                }
            }
        }
        break;
      default:
        return;
    }

    if (billingRule.minimumCharge && amount < Number(billingRule.minimumCharge)) {
        amount = Number(billingRule.minimumCharge);
    }

    // Find the latest DRAFT invoice for this lease, or create one for the current month
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let invoice = await tx.invoice.findFirst({
        where: {
            leaseId: lease.id,
            status: "DRAFT",
            organizationId
        }
    });

    if (!invoice) {
        // Create a new draft invoice if none exists
        const invoiceNumber = `INV-UTL-${Date.now()}`;
        invoice = await tx.invoice.create({
            data: {
                organizationId,
                invoiceNumber,
                leaseId: lease.id,
                billingMonth: month,
                billingYear: year,
                subtotal: new Prisma.Decimal(0),
                taxAmount: new Prisma.Decimal(0),
                totalAmount: new Prisma.Decimal(0),
                balanceDue: new Prisma.Decimal(0),
                dueDate: new Date(year, month, 5), // Default due date
                status: "DRAFT",
            }
        });
    }

    const description = `${billingRule.utilityType.name} Consumption: ${consumption} ${billingRule.utilityType.unitOfMeasure || ""} (${reading.meter.meterNumber})`;

    const lineItem = await tx.invoiceLineItem.create({
        data: {
            invoiceId: invoice.id,
            description,
            quantity: 1,
            unitPrice: new Prisma.Decimal(amount),
            amount: new Prisma.Decimal(amount),
        }
    });

    // Update invoice totals
    const subtotal = Number(invoice.subtotal) + amount;
    const totalAmount = subtotal + Number(invoice.taxAmount);

    await tx.invoice.update({
        where: { id: invoice.id },
        data: {
            subtotal: new Prisma.Decimal(subtotal),
            totalAmount: new Prisma.Decimal(totalAmount),
            balanceDue: new Prisma.Decimal(totalAmount),
        }
    });

    // Mark reading as billed
    await tx.utilityReading.update({
        where: { id: reading.id },
        data: {
            status: "BILLED",
            invoiceLineItemId: lineItem.id
        }
    });

    await tx.auditLog.create({
        data: {
            organizationId,
            userId: "SYSTEM",
            action: "GENERATE_CHARGE",
            entity: "UtilityReading",
            entityId: reading.id,
            newData: { amount, invoiceId: invoice.id }
        }
    });
  }

  async voidReading(userId: string, organizationId: string, readingId: string) {
    await checkPermission("update", "utilities" as any);

    const reading = await utilityRepository.updateReading(readingId, organizationId, {
      status: "VOIDED",
    });

    await createAuditLog({
      action: "VOID_READING",
      entity: "UtilityReading",
      entityId: readingId,
      newData: { status: "VOIDED" },
    });

    return reading;
  }
}

export const utilityService = new UtilityService();
