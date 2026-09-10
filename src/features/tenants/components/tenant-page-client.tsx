"use client";

import React, { useState } from "react";
import {
  Plus,
  Download,
  FileSpreadsheet,
  CheckSquare,
  ArrowRightLeft,
  Filter,
  ChevronDown,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LayoutGrid,
  MoreHorizontal,
  Eye,
  Edit,
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";

interface TenantPageClientProps {
  initialTenants: any[];
  stats: any;
  initialFilters: any;
}

export function TenantPageClient({
  initialTenants,
  stats,
  initialFilters
}: TenantPageClientProps) {
  const [tenants, setTenants] = useState(initialTenants);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      {/* Main Control Card */}
      <Card className="border-[#E5EAF0] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-6 space-y-6">
          {/* Compact Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#62A800] uppercase tracking-[0.2em]">PEOPLE</p>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-[#1A202C] tracking-tight">Tenants</h1>
                <Badge variant="outline" className="bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7] font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider h-6">
                  {stats.totalTenants} tenants
                </Badge>
              </div>
              <p className="text-[13px] font-medium text-[#718096] max-w-md">
                Search, filter, and manage tenant lifecycle in one clean workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 shrink-0">
              <Button variant="outline" className="h-10 px-4 rounded-lg border-[#E2E8F0] text-[#1A202C] font-bold gap-2 text-[11px] bg-white shadow-sm hover:bg-gray-50 transition-all">
                <ClipboardCheck className="h-4 w-4 text-[#64748B]" />
                <span>Approvals</span>
              </Button>

              <Button asChild className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-10 px-4 rounded-lg shadow-sm gap-2 text-[11px] transition-all">
                <Link href="/tenants/new">
                  <UserPlus className="h-4 w-4" />
                  <span>Add Tenant</span>
                </Link>
              </Button>

              <Button variant="outline" className="h-10 px-4 rounded-lg border-[#E2E8F0] text-[#1A202C] font-bold gap-2 text-[11px] bg-white shadow-sm hover:bg-gray-50 transition-all">
                <FileSpreadsheet className="h-4 w-4 text-[#107C41]" />
                <span>Import CSV / Excel</span>
              </Button>

              <Button variant="outline" className="h-10 px-4 rounded-lg border-[#E2E8F0] text-[#4A5568] font-bold gap-2 text-[11px] bg-white shadow-sm hover:bg-gray-50 transition-all">
                <Download className="h-4 w-4 text-[#3182CE]" />
                <span>Export All</span>
              </Button>
            </div>
          </div>

          {/* Compact Color Indicators */}
          <div className="flex flex-wrap gap-4">
            <StatusIndicator
                dotColor="bg-[#22C55E]"
                bgColor="bg-[#F0FDF4]"
                borderColor="border-[#DCFCE7]"
                textColor="text-[#16A34A]"
                label="Green"
                value={stats.activeTenants || 0}
            />
            <StatusIndicator
                dotColor="bg-[#F59E0B]"
                bgColor="bg-[#FFFBEB]"
                borderColor="border-[#FEF3C7]"
                textColor="text-[#D97706]"
                label="Yellow"
                value={stats.formerTenants || 0}
            />
            <StatusIndicator
                dotColor="bg-[#EF4444]"
                bgColor="bg-[#FEF2F2]"
                borderColor="border-[#FEE2E2]"
                textColor="text-[#DC2626]"
                label="Red"
                value={stats.blacklistedTenants || 0}
            />
          </div>

          {/* Selection Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                <span>Showing {tenants.length} results on this page.</span>
                <span className="h-1 w-1 rounded-full bg-[#CBD5E0]" />
                <span>Total tenants {stats.totalTenants}</span>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" className="h-10 px-5 rounded-lg border-[#E2E8F0] text-[#4A5568] font-bold gap-2 text-[11px] bg-white shadow-sm hover:bg-gray-50 transition-all">
                  <CheckSquare className="h-4 w-4" />
                  <span>Bulk update status</span>
                </Button>

                <Button className="h-10 px-5 rounded-lg bg-[#A3D16B] hover:bg-[#92bf5a] text-white font-bold gap-2 text-[11px] shadow-sm transition-all">
                  <ArrowRightLeft className="h-4 w-4" />
                  <span>Move selected tenants</span>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compact Filter Toggle */}
      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-white shadow-sm">
         <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
               <Filter className="h-3.5 w-3.5 text-[#1A202C]" />
               <span className="text-[10px] font-bold text-[#1A202C] uppercase tracking-wider">Filters</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#94A3B8]">
               <span>Toggle</span>
               <ChevronDown className="h-4 w-4" />
            </div>
         </div>
      </div>

      {/* Table Section */}
      <Card className="border-[#E5EAF0] shadow-sm rounded-lg bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10 py-3 pl-5">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest text-center">#</TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest">Tenant</TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest">Property</TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest text-center">Unit</TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest">Rental</TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest">Balance</TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest">VAT</TableHead>
                  <TableHead className="py-3 font-bold text-[#1A202C] text-[9px] uppercase tracking-widest text-right pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <h3 className="text-xl font-black text-[#1A202C]">No tenants found.</h3>
                          <p className="text-[12px] font-medium text-[#718096]">Add your first tenant to get started.</p>
                          <Button asChild className="bg-[#56A600] hover:bg-[#4a8e00] rounded-lg px-6 h-10 font-black gap-2 mt-2">
                             <Link href="/tenants/new">
                                <UserPlus className="h-4 w-4" />
                                <span>Add Tenant</span>
                             </Link>
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((tenant, index) => {
                    const activeLease = tenant.leases?.find((l: any) => l.status === "ACTIVE");
                    return (
                      <TableRow key={tenant.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/50 transition-colors">
                        <TableCell className="pl-5"><Checkbox /></TableCell>
                        <TableCell className="text-center text-[10px] font-bold text-[#64748B] tabular-nums">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#1A202C]">{tenant.firstName} {tenant.lastName}</span>
                            <span className="text-[9px] font-medium text-[#718096] uppercase">{tenant.tenantCode}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-semibold text-[#4A5568]">{activeLease?.unit?.property?.propertyName || "-"}</span>
                        </TableCell>
                        <TableCell className="text-center">
                           <Badge variant="outline" className="rounded-md bg-[#F1F5F9] border-none text-[10px] font-black text-[#1A202C] px-2 py-0">
                              {activeLease?.unit?.unitNumber || "-"}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#1A202C] tabular-nums">
                          {formatCurrency(activeLease?.monthlyRent || 0)}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#E53E3E] tabular-nums">
                          {formatCurrency(0)}
                        </TableCell>
                        <TableCell>
                           <StatusBadge status={tenant.status} />
                        </TableCell>
                        <TableCell className="text-[10px] font-bold text-[#718096]">
                          0%
                        </TableCell>
                        <TableCell className="text-right pr-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
                                <MoreHorizontal className="h-4 w-4 text-[#64748B]" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-[#E2E8F0]">
                              <DropdownMenuLabel className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-3 py-2">Operations</DropdownMenuLabel>
                              <DropdownMenuItem asChild className="rounded-lg focus:bg-[#F0FDF4] focus:text-[#16A34A] cursor-pointer py-2">
                                <Link href={`/tenants/${tenant.id}`} className="flex items-center w-full">
                                  <Eye className="mr-3 h-4 w-4" />
                                  <span className="font-bold text-xs">View Profile</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="rounded-lg focus:bg-slate-50 cursor-pointer py-2">
                                <Link href={`/tenants/${tenant.id}/edit`} className="flex items-center w-full">
                                  <Edit className="mr-3 h-4 w-4" />
                                  <span className="font-bold text-xs">Edit Details</span>
                                </Link>
                              </DropdownMenuItem>
                              <div className="h-px bg-[#F1F5F9] my-1 mx-1" />
                              <DropdownMenuItem className="rounded-lg focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer py-2">
                                <Ban className="mr-3 h-4 w-4" />
                                <span className="font-bold text-xs">Blacklist Tenant</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer / Pagination Mock */}
      <div className="px-6 py-2 bg-transparent flex items-center gap-4">
         <ChevronLeft className="h-3 w-3 text-[#CBD5E1] cursor-pointer" />
         <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full relative overflow-hidden">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-4/5 h-1 bg-[#CBD5E1] rounded-full" />
         </div>
         <ChevronRight className="h-3 w-3 text-[#CBD5E1] cursor-pointer" />
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F8FAFC; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function StatusIndicator({ dotColor, bgColor, borderColor, textColor, label, value }: any) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border", bgColor, borderColor)}>
      <div className={cn("w-2 h-2 rounded-full", dotColor)} />
      <span className={cn("text-[11px] font-bold", textColor)}>{label}</span>
      <span className="text-[12px] font-black text-[#1A202C] bg-white px-2 py-0.5 rounded border border-inherit min-w-[24px] text-center shadow-sm">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    ACTIVE: "bg-[#F0FDF4] text-[#16A34A] ring-[#16A34A]/20",
    INACTIVE: "bg-[#F1F5F9] text-[#475569] ring-[#475569]/20",
    BLACKLISTED: "bg-[#FEF2F2] text-[#DC2626] ring-[#DC2626]/20",
    FORMER: "bg-[#FFFBEB] text-[#D97706] ring-[#D97706]/20",
  };
  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[9px] font-bold ring-1 ring-inset whitespace-nowrap uppercase",
      styles[status] || styles.INACTIVE
    )}>
      {status}
    </span>
  );
}
