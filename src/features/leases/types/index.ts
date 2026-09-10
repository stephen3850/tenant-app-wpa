import { Lease, Property, Unit, Tenant, Invoice } from "@prisma/client";

export type LeaseWithDetails = Lease & {
  property: Property;
  unit: Unit;
  tenant: Tenant;
  invoices: Invoice[];
};

export type LeaseSummary = Lease & {
  property: Property;
  unit: Unit;
  tenant: Tenant;
};

export interface LeaseStats {
  activeLeases: number;
  expiringLeases: number;
  expiredLeases: number;
  renewedLeases: number;
  totalRevenue: number;
}
