"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

import { OccupancyStatusBadge } from "./occupancy-status-badge";
import { UnitStatusBadge } from "./unit-status-badge";

interface UnitTableProps {
  data: any[];
  onDelete: (id: string) => void;
}

export function UnitTable({ data, onDelete }: UnitTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border border-dashed rounded-lg bg-slate-50/50">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Eye className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No units found</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-xs">
          Try adjusting your filters or add a new unit to this property.
        </p>
        <Button asChild>
          <Link href="/units/new">Add your first unit</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="w-[100px]">Unit #</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Rent</TableHead>
            <TableHead>Occupancy</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Tenant</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((unit) => {
            const activeLease = unit.leases?.find((l: any) => l.status === "ACTIVE");
            const tenant = activeLease?.tenant;

            return (
              <TableRow key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-bold">{unit.unitNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{unit.property?.propertyName}</span>
                    <span className="text-xs text-slate-500">{unit.floor ? `Floor ${unit.floor}` : ""} {unit.block ? `• ${unit.block}` : ""}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">{unit.unitType}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{formatCurrency(unit.monthlyRent)}</div>
                </TableCell>
                <TableCell>
                  <OccupancyStatusBadge status={unit.occupancyStatus} />
                </TableCell>
                <TableCell>
                  <UnitStatusBadge status={unit.status} />
                </TableCell>
                <TableCell>
                  {tenant ? (
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {tenant.firstName[0]}{tenant.lastName[0]}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{tenant.firstName} {tenant.lastName}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm italic">Vacant</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/units/${unit.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/units/${unit.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(unit.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
