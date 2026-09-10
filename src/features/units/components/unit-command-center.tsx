"use client";

import React, { useState } from "react";
import { UnitStatsCards } from "./unit-stats-cards";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteUnitAction } from "../actions";

interface UnitCommandCenterProps {
  initialUnits: any[];
  properties: any[];
  initialFilters: any;
  stats: any;
}

export function UnitCommandCenter({
  initialUnits,
  properties,
  initialFilters,
  stats
}: UnitCommandCenterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.search) params.set("search", filters.search); else params.delete("search");
    if (filters.propertyId && filters.propertyId !== "all") params.set("propertyId", filters.propertyId); else params.delete("propertyId");
    if (filters.occupancyStatus && filters.occupancyStatus !== "all") params.set("occupancyStatus", filters.occupancyStatus); else params.delete("occupancyStatus");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this unit? This cannot be undone.")) return;

    setIsDeleting(id);
    try {
      const result = await deleteUnitAction(id);
      if (result.success) {
        toast.success("Unit deleted successfully");
        // Notify sidebar to refresh counts
        window.dispatchEvent(new CustomEvent("refresh-sidebar-stats"));
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete unit");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filter Card */}
      <Card className="border-[#E5EAF0] shadow-sm rounded-lg bg-white overflow-hidden">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Search Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#1F2937] uppercase tracking-wider">
                SEARCH UNIT, FLOOR, OR PROPERTY
              </label>
              <div className="flex items-stretch rounded-md border border-[#E5EAF0] overflow-hidden bg-white h-11">
                <div className="bg-[#F9FAFB] border-r border-[#E5EAF0] px-3 flex items-center justify-center">
                  <Search className="h-4 w-4 text-[#98A2B3]" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. A1, Floor 2, Citadel Towers"
                  className="w-full px-4 text-sm focus:outline-none placeholder:text-[#CBD5E1] text-[#1F2937]"
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                />
              </div>
              <Button
                onClick={handleApply}
                className="h-9 px-6 bg-[#56A600] hover:bg-[#4a8e00] rounded-full font-bold flex gap-2 shadow-sm transition-all active:scale-95 text-xs"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Apply</span>
              </Button>
            </div>

            {/* Property Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#1F2937] uppercase tracking-wider">
                PROPERTY
              </label>
              <Select value={filters.propertyId || "all"} onValueChange={(v) => setFilters({ ...filters, propertyId: v })}>
                <SelectTrigger className="h-11 rounded-md border-[#E5EAF0] text-sm font-medium text-[#1F2937] bg-white">
                  <SelectValue placeholder="All properties" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-[#E5EAF0]">
                  <SelectItem value="all">All properties</SelectItem>
                  {properties.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#1F2937] uppercase tracking-wider">
                STATUS
              </label>
              <Select value={filters.occupancyStatus || "all"} onValueChange={(v) => setFilters({ ...filters, occupancyStatus: v })}>
                <SelectTrigger className="h-11 rounded-md border-[#E5EAF0] text-sm font-medium text-[#1F2937] bg-white">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-[#E5EAF0]">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="OCCUPIED">Occupied</SelectItem>
                  <SelectItem value="VACANT">Vacant</SelectItem>
                  <SelectItem value="RESERVED">Reserved</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <UnitStatsCards stats={stats} />

      {/* Units Table */}
      <Card className="border-[#E5EAF0] shadow-sm rounded-lg bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 py-4 pl-6 font-bold text-[#64748B] text-[10px] uppercase tracking-widest">#</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Unit</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Floor</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Property</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Branch</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Type</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Rent</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Deposit</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Tenant</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-[#64748B] text-[10px] uppercase tracking-widest">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="py-20 text-center">
                       <p className="text-sm font-medium text-[#94A3B8]">No units found for the selected filters.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  initialUnits.map((unit, index) => (
                    <TableRow key={unit.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/50 transition-colors">
                      <TableCell className="py-4 pl-6 text-[11px] font-bold text-[#64748B] tabular-nums">{(index + 1).toString()}</TableCell>
                      <TableCell className="py-4"><span className="text-sm font-semibold text-[#1E293B]">{unit.unitNumber}</span></TableCell>
                      <TableCell className="py-4"><span className="text-xs font-medium text-[#64748B]">{unit.floor || "-"}</span></TableCell>
                      <TableCell className="py-4"><span className="text-sm font-medium text-[#1E293B]">{unit.property?.propertyName}</span></TableCell>
                      <TableCell className="py-4"><span className="text-xs font-medium text-[#64748B]">{unit.property?.branch || "Main"}</span></TableCell>
                      <TableCell className="py-4"><span className="text-[10px] font-bold text-[#1E293B] uppercase">{unit.unitType}</span></TableCell>
                      <TableCell className="py-4 font-semibold text-[#1E293B] tabular-nums text-sm">{formatCurrency(unit.monthlyRent)}</TableCell>
                      <TableCell className="py-4 font-semibold text-[#1E293B] tabular-nums text-sm">{formatCurrency(unit.securityDeposit)}</TableCell>
                      <TableCell className="py-4">
                        {unit.leases?.find((l: any) => l.status === "ACTIVE")?.tenant ? (
                          <span className="text-xs font-medium text-[#1E293B]">{unit.leases.find((l: any) => l.status === "ACTIVE").tenant.firstName} {unit.leases.find((l: any) => l.status === "ACTIVE").tenant.lastName}</span>
                        ) : (<span className="text-[#94A3B8] text-xs">-</span>)}
                      </TableCell>
                      <TableCell className="py-4"><StatusBadge status={unit.occupancyStatus} /></TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => router.push(`/units/${unit.id}`)}
                            className="text-[10px] font-bold text-[#62A800] uppercase hover:underline"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(unit.id)}
                            disabled={isDeleting === unit.id}
                            className="text-[10px] font-bold text-rose-600 uppercase hover:underline disabled:opacity-50"
                          >
                            {isDeleting === unit.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mock Scrollbar */}
          <div className="px-6 py-4 bg-white border-t border-[#F1F5F9] flex items-center gap-4">
             <ChevronLeft className="h-4 w-4 text-[#CBD5E1] cursor-pointer" />
             <div className="flex-1 h-3 bg-[#F1F5F9] rounded-full relative overflow-hidden">
                <div className="absolute top-1/2 left-4 -translate-y-1/2 w-4/5 h-1.5 bg-[#CBD5E1] rounded-full" />
             </div>
             <ChevronRight className="h-4 w-4 text-[#CBD5E1] cursor-pointer" />
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F8FAFC; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    OCCUPIED: "bg-[#F0FDF4] text-[#16A34A] ring-[#16A34A]/20",
    VACANT: "bg-[#FFF7ED] text-[#EA580C] ring-[#EA580C]/20",
    RESERVED: "bg-[#EFF6FF] text-[#3B82F6] ring-[#3B82F6]/20",
    MAINTENANCE: "bg-[#FEF2F2] text-[#EF4444] ring-[#EF4444]/20",
  };
  const labels: any = { OCCUPIED: "Occupied", VACANT: "Vacant", RESERVED: "Reserved", MAINTENANCE: "Maintenance" };
  return (
    <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold ring-1 ring-inset whitespace-nowrap uppercase", styles[status] || styles.VACANT)}>
      {labels[status] || status}
    </span>
  );
}
