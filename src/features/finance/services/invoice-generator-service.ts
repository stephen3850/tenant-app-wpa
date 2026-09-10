import { db } from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { invoiceService } from "./invoice-service";
import { LeaseStatus } from "@prisma/client";

export class InvoiceGeneratorService {
  async generateMonthlyInvoices(organizationId: string, month: number, year: number) {
    await checkPermission("create", "invoice");

    // Find all active leases for this organization
    const leases = await db.lease.findMany({
      where: {
        organizationId,
        status: LeaseStatus.ACTIVE,
        startDate: { lte: new Date(year, month, 0) }, // Started before or during this month
        OR: [
          { endDate: null },
          { endDate: { gte: new Date(year, month - 1, 1) } } // Ends after or during this month
        ]
      },
      include: {
        tenant: true,
        unit: true
      }
    });

    const results = {
      generated: 0,
      skipped: 0,
      errors: 0,
    };

    for (const lease of leases) {
      try {
        const lineItems = [];

        // 1. Base Rent
        let rentAmount = Number(lease.monthlyRent);

        // Proration support (simplistic: check if move-in is this month)
        const moveInDate = lease.startDate;
        if (moveInDate.getMonth() + 1 === month && moveInDate.getFullYear() === year && moveInDate.getDate() > 1) {
            const daysInMonth = new Date(year, month, 0).getDate();
            const activeDays = daysInMonth - moveInDate.getDate() + 1;
            rentAmount = (rentAmount / daysInMonth) * activeDays;
            lineItems.push({
                description: `Prorated Rent (${moveInDate.toLocaleDateString()} to ${new Date(year, month, 0).toLocaleDateString()})`,
                quantity: 1,
                unitPrice: Number(rentAmount.toFixed(2)),
            });
        } else {
            lineItems.push({
                description: "Monthly Rent",
                quantity: 1,
                unitPrice: Number(lease.monthlyRent),
            });
        }

        // 2. Service Charges
        if (Number(lease.serviceCharge) > 0) {
          lineItems.push({
            description: "Service Charge",
            quantity: 1,
            unitPrice: Number(lease.serviceCharge),
          });
        }

        // 3. Late Fees (if applicable from previous months - usually handled separately, but added here if needed)
        // For now, just basic rent and service charge.

        await invoiceService.createInvoice(organizationId, {
          leaseId: lease.id,
          billingMonth: month,
          billingYear: year,
          dueDate: new Date(year, month - 1, lease.billingDay || 5),
          lineItems,
          taxAmount: 0,
        });

        results.generated++;
      } catch (error: any) {
        if (error.message?.includes("already exists")) {
          results.skipped++;
        } else {
          console.error(`Error generating invoice for lease ${lease.id}:`, error);
          results.errors++;
        }
      }
    }

    return results;
  }
}

export const invoiceGeneratorService = new InvoiceGeneratorService();
