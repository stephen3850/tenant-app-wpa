"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { UsersIcon, MapPinIcon, HomeIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";

export function LeaseDetails({ lease }: { lease: any }) {
  if (!lease) return null;

  const outstandingCharges = lease.invoices?.reduce((sum: number, inv: any) => sum + Number(inv.balanceDue), 0) || 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Property & Unit Details */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Property & Unit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Property Address</p>
            <p className="text-sm font-medium">{lease.unit.property.address}</p>
            <p className="text-sm text-muted-foreground">{lease.unit.property.city}, {lease.unit.property.county}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Unit Number</p>
              <p className="text-sm font-bold">{lease.unit.unitNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Unit Type</p>
              <p className="text-sm">{lease.unit.unitType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Square Footage</p>
              <p className="text-sm">{lease.unit.squareFootage?.toString() || "N/A"} sq. ft.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Rooms</p>
              <p className="text-sm">{lease.unit.bedrooms || 0} Bed / {lease.unit.bathrooms || 0} Bath</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Monthly Rent</span>
              <span className="text-sm font-bold">{formatCurrency(lease.monthlyRent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Security Deposit Held</span>
              <span className="text-sm font-bold">{formatCurrency(lease.securityDeposit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Service Charge</span>
              <span className="text-sm font-bold">{formatCurrency(lease.serviceCharge)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold text-red-600">Outstanding Charges</span>
              <span className="text-sm font-bold text-red-600">{formatCurrency(outstandingCharges)}</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Utility Billing Rules</p>
            <div className="text-sm bg-slate-50 p-3 rounded-md">
                {lease.unit.property.utilityBillingRules?.length > 0 ? (
                    <ul className="space-y-1">
                        {lease.unit.property.utilityBillingRules.map((rule: any) => (
                            <li key={rule.id} className="flex justify-between">
                                <span>{rule.utilityType.name}</span>
                                <span className="font-medium">
                                    {rule.basis === 'CONSUMPTION' ? `${formatCurrency(rule.unitPrice)} / unit` : `${formatCurrency(rule.fixedAmount)} Fixed`}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xs italic text-muted-foreground">Standard utility rates apply.</p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupants */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center gap-2">
          <UsersIcon className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-lg">Authorized Occupants</CardTitle>
        </CardHeader>
        <CardContent>
          {lease.occupants?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>ID Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lease.occupants.map((occupant: any) => (
                  <TableRow key={occupant.id}>
                    <TableCell className="font-medium">{occupant.name}</TableCell>
                    <TableCell>{occupant.relationship}</TableCell>
                    <TableCell>{occupant.phone || "N/A"}</TableCell>
                    <TableCell>{occupant.idNumber || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No additional occupants listed on the lease.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
