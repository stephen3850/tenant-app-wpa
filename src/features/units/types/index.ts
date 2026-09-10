import { Unit, Property, Lease, Tenant } from "@prisma/client";

export type UnitWithProperty = Unit & {
  property: Property;
};

export type UnitWithDetails = Unit & {
  property: Property;
  leases: (Lease & {
    tenant: Tenant;
  })[];
};

export interface UnitStats {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  maintenanceUnits: number;
  reservedUnits: number;
  occupancyRate: number;
}
