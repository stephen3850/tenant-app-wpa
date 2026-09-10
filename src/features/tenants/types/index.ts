import { Tenant, Lease, Unit, Property, Ticket, Invoice, Payment, Communication, Document } from "@prisma/client";

export type TenantWithDetails = Tenant & {
  leases: (Lease & {
    unit: Unit & {
      property: Property;
    };
  })[];
  tickets: Ticket[];
  documents: Document[];
};

export type TenantSummary = Tenant & {
  leases: (Lease & {
    unit: Unit & {
      property: Property;
    };
  })[];
};

export interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  formerTenants: number;
  blacklistedTenants: number;
  newTenantsThisMonth: number;
}
