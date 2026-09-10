import { tenantRepository } from "../repositories/tenant-repository";
import { checkPermission } from "@/lib/permissions";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { TenantFormValues, TenantFilters } from "../schemas/tenant-schema";
import { TenantStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export class TenantService {
  private async getSession() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return session.user as any;
  }

  async listTenants(filters: TenantFilters) {
    const user = await this.getSession();
    await checkPermission("read", "tenant");
    return tenantRepository.findAll(user.organizationId, filters);
  }

  async getTenant(id: string) {
    const user = await this.getSession();
    await checkPermission("read", "tenant");
    const tenant = await tenantRepository.findById(id, user.organizationId);
    if (!tenant) throw new Error("Tenant not found");
    return tenant;
  }

  async createTenant(values: TenantFormValues) {
    const user = await this.getSession();
    await checkPermission("create", "tenant");

    // Check for existing tenant by phone
    const existing = await db.tenant.findUnique({
      where: { phone: values.phone }
    });

    if (existing) {
      if (existing.organizationId !== user.organizationId) {
        throw new Error("A tenant with this phone number already exists in another organization.");
      }
      return this.updateTenant(existing.id, values);
    }

    const tenant = await tenantRepository.create({
      ...values,
      organization: { connect: { id: user.organizationId } },
    } as any);

    await createAuditLog({
      action: "CREATE",
      entity: "Tenant",
      entityId: tenant.id,
      newData: tenant,
    });

    return tenant;
  }

  async createFullTenant(formData: any) {
    const user = await this.getSession();
    const orgId = user.organizationId;

    await checkPermission("create", "tenant");
    await checkPermission("create", "lease");

    // Split name
    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "N/A";

    return await db.$transaction(async (tx) => {
      // 1. Check if tenant already exists by phone (since it's unique)
      const existingTenant = await tx.tenant.findUnique({
        where: { phone: formData.phone }
      });

      let tenant;
      if (existingTenant) {
        if (existingTenant.organizationId !== orgId) {
          throw new Error("A tenant with this phone number already exists in another organization.");
        }
        // Update existing tenant info
        tenant = await tx.tenant.update({
          where: { id: existingTenant.id },
          data: {
            firstName,
            lastName,
            email: formData.email || existingTenant.email,
            idNumber: formData.idNumber || existingTenant.idNumber,
            status: "ACTIVE",
            alternativePhone: formData.whatsapp || existingTenant.alternativePhone,
            emergencyPhone: formData.nextOfKinPhone || existingTenant.emergencyPhone,
            occupation: formData.guarantorRelationship || existingTenant.occupation,
            employer: formData.guarantorName || existingTenant.employer,
          }
        });
      } else {
        // Create new Tenant
        tenant = await tx.tenant.create({
          data: {
            organizationId: orgId,
            firstName,
            lastName,
            phone: formData.phone,
            email: formData.email || null,
            idNumber: formData.idNumber || null,
            tenantCode: `TNT-${Date.now().toString().slice(-6)}`,
            status: "ACTIVE",
            moveInDate: formData.leaseStartDate ? new Date(formData.leaseStartDate) : new Date(),
            alternativePhone: formData.whatsapp || null,
            emergencyPhone: formData.nextOfKinPhone || null,
            occupation: formData.guarantorRelationship || null,
            employer: formData.guarantorName || null,
          },
        });
      }

      // 1.5 Auto-generate login credentials if requested
      if (formData.autoCreateLogin && formData.email) {
        const hashedPassword = await bcrypt.hash(formData.phone, 10);

        let userAccount = await tx.user.findUnique({
          where: { email: formData.email }
        });

        if (!userAccount) {
          userAccount = await tx.user.create({
            data: {
              name: formData.name,
              email: formData.email,
              password: hashedPassword,
              phone: formData.phone,
              organizationId: orgId,
              status: "ACTIVE",
            }
          });

          const tenantRole = await tx.role.findFirst({
            where: { name: "TENANT", organizationId: null }
          });

          if (tenantRole) {
            await tx.userRole.create({
              data: {
                userId: userAccount.id,
                roleId: tenantRole.id
              }
            });
          }
        }

        // Link user to tenant if not already linked
        if (tenant.userId !== userAccount.id) {
          tenant = await tx.tenant.update({
            where: { id: tenant.id },
            data: { userId: userAccount.id }
          });
        }
      }

      // 2. Create Lease
      const rentAmount = parseFloat(formData.rent.replace(/,/g, '')) || 0;
      const depositAmount = parseFloat(formData.leaseDeposit.replace(/,/g, '')) || 0;
      const serviceChargeAmount = parseFloat(formData.serviceChargeAmount.replace(/,/g, '')) || 0;

      const lease = await tx.lease.create({
        data: {
          organizationId: orgId,
          leaseNumber: `LS-${Date.now().toString().slice(-6)}`,
          tenantId: tenant.id,
          unitId: formData.unit,
          propertyId: formData.property,
          startDate: new Date(formData.leaseStartDate),
          endDate: formData.leaseEndDate ? new Date(formData.leaseEndDate) : null,
          monthlyRent: new Prisma.Decimal(rentAmount),
          securityDeposit: new Prisma.Decimal(depositAmount),
          serviceCharge: new Prisma.Decimal(serviceChargeAmount),
          billingDay: parseInt(formData.dueDay) || 1,
          status: "ACTIVE",
          leaseTermMonths: 12,
        },
      });

      // 3. Update Unit status
      await tx.unit.update({
        where: { id: formData.unit },
        data: { occupancyStatus: "OCCUPIED" },
      });

      // 4. Initial Invoice if requested
      if (formData.createFirstInvoice) {
         const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
         const total = rentAmount + serviceChargeAmount;

         await tx.invoice.create({
            data: {
                organizationId: orgId,
                invoiceNumber,
                leaseId: lease.id,
                billingMonth: new Date(formData.leaseStartDate).getMonth() + 1,
                billingYear: new Date(formData.leaseStartDate).getFullYear(),
                subtotal: new Prisma.Decimal(total),
                taxAmount: new Prisma.Decimal(0),
                totalAmount: new Prisma.Decimal(total),
                balanceDue: new Prisma.Decimal(total),
                dueDate: new Date(formData.leaseStartDate),
                status: "POSTED",
                lineItems: {
                    create: [
                        { description: "Initial Rent", quantity: 1, unitPrice: new Prisma.Decimal(rentAmount), amount: new Prisma.Decimal(rentAmount) },
                        ...(serviceChargeAmount > 0 ? [{ description: "Service Charge", quantity: 1, unitPrice: new Prisma.Decimal(serviceChargeAmount), amount: new Prisma.Decimal(serviceChargeAmount) }] : [])
                    ]
                }
            }
         });
      }

      await createAuditLog({
        action: "CREATE_FULL_TENANT",
        entity: "Tenant",
        entityId: tenant.id,
        newData: { tenantId: tenant.id, leaseId: lease.id },
        userId: user.id,
        organizationId: orgId
      });

      return tenant;
    });
  }

  async updateTenant(id: string, values: Partial<TenantFormValues>) {
    const user = await this.getSession();
    await checkPermission("update", "tenant");

    const oldData = await tenantRepository.findById(id, user.organizationId);
    if (!oldData) throw new Error("Tenant not found");

    const updated = await tenantRepository.update(id, user.organizationId, values as any);

    await createAuditLog({
      action: "UPDATE",
      entity: "Tenant",
      entityId: id,
      oldData,
      newData: updated,
    });

    return updated;
  }

  async updateStatus(id: string, status: TenantStatus) {
    const user = await this.getSession();
    await checkPermission("update", "tenant");

    const oldData = await tenantRepository.findById(id, user.organizationId);
    const updated = await tenantRepository.update(id, user.organizationId, { status });

    await createAuditLog({
      action: `SET_STATUS_${status}`,
      entity: "Tenant",
      entityId: id,
      oldData: { status: oldData?.status },
      newData: { status },
    });

    return updated;
  }

  async getTenantStats() {
    const user = await this.getSession();
    return tenantRepository.getStats(user.organizationId);
  }
}

export const tenantService = new TenantService();
