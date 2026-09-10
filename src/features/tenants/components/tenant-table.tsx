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
import { MoreHorizontal, Eye, Edit, Ban, Trash2, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { TenantStatus } from "@prisma/client";

interface TenantTableProps {
  data: any[];
}

export function TenantTable({ data }: TenantTableProps) {
  const getStatusColor = (status: TenantStatus) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "INACTIVE": return "secondary";
      case "BLACKLISTED": return "destructive";
      case "FORMER": return "outline";
      default: return "secondary";
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border border-dashed rounded-lg bg-slate-50/50">
        <h3 className="text-lg font-semibold text-slate-900">No tenants found</h3>
        <p className="text-muted-foreground mb-6">Start by adding a new tenant to your organization.</p>
        <Button asChild>
          <Link href="/tenants/new">Add New Tenant</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tenant) => {
            const activeLease = tenant.leases?.[0];
            const unit = activeLease?.unit;

            return (
              <TableRow key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{tenant.firstName} {tenant.lastName}</span>
                    <span className="text-xs text-slate-500">{tenant.tenantCode || "No Code"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{tenant.phone}</span>
                    <span className="text-xs text-slate-500">{tenant.email || "No email"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {unit ? (
                    <Badge variant="outline" className="font-normal">{unit.unitNumber}</Badge>
                  ) : (
                    <span className="text-slate-400 text-sm italic">Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{unit?.property?.propertyName || "N/A"}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(tenant.status)}>
                    {tenant.status}
                  </Badge>
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
                        <Link href={`/tenants/${tenant.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/tenants/${tenant.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Ban className="mr-2 h-4 w-4" /> Blacklist
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
