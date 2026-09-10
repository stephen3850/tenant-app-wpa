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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LeaseStatusBadge } from "./lease-status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";

interface LeaseTableProps {
  data: any[];
}

export function LeaseTable({ data }: LeaseTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border border-dashed rounded-lg bg-slate-50/50">
        <FileText className="h-10 w-10 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No leases found</h3>
        <p className="text-muted-foreground mb-6">Create a lease to start managing occupancy.</p>
        <Button asChild>
          <Link href="/leases/new">Create Lease</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead>Lease #</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Rent</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((lease) => (
            <TableRow key={lease.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-bold">{lease.leaseNumber}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">{lease.tenant.firstName} {lease.tenant.lastName}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lease.unit.unitNumber}</span>
                  <span className="text-xs text-slate-500">{lease.property.propertyName}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(lease.monthlyRent)}</TableCell>
              <TableCell>
                <div className="flex flex-col text-xs">
                  <span>Start: {formatDate(lease.startDate)}</span>
                  <span>End: {lease.endDate ? formatDate(lease.endDate) : "Open-ended"}</span>
                </div>
              </TableCell>
              <TableCell>
                <LeaseStatusBadge status={lease.status} />
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
                      <Link href={`/leases/${lease.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/leases/${lease.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Terms
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
