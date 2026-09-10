"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, FileDown } from "lucide-react";
import { toast } from "sonner";

interface Props {
  properties: { id: string; propertyName: string }[];
  initialFilters: {
    search: string;
    status: string;
    propertyId: string;
    rows: string;
  };
}

export function TenantStatementFilters({ properties, initialFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialFilters.search);
  const [status, setStatus] = useState(initialFilters.status);
  const [propertyId, setPropertyId] = useState(initialFilters.propertyId);
  const [rows, setRows] = useState(initialFilters.rows);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search); else params.delete("search");
    params.set("status", status);
    params.set("propertyId", propertyId);
    params.set("rows", rows);
    router.push(`?${params.toString()}`);
    toast.success("Filters applied");
  };

  const handleClear = () => {
    setSearch("");
    setStatus("active");
    setPropertyId("all");
    setRows("100");
    router.push(window.location.pathname);
  };

  const handleExportExcel = () => {
    toast.info("Preparing Excel export for tenant statements...");
    // In a real app, you might trigger a download from an API route
    setTimeout(() => {
       window.alert("Excel Export: Downloading tenant statement summary...");
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <div className="space-y-1 md:col-span-1 lg:col-span-1">
        <label className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">Search by name / unit</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#94A3B8]" />
          <Input
            placeholder="e.g. Esther or 12B"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-[11px] border-[#E2E8F0] rounded-lg focus-visible:ring-[#3B82F6]/20"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-lg px-2 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active" className="text-[11px]">Active</SelectItem>
            <SelectItem value="former" className="text-[11px]">Former</SelectItem>
            <SelectItem value="all" className="text-[11px]">All Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1 lg:col-span-1">
        <label className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">Property</label>
        <Select value={propertyId} onValueChange={setPropertyId}>
          <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-lg px-2 bg-white">
            <SelectValue placeholder="All properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[11px]">All properties</SelectItem>
            {properties.map(p => (
              <SelectItem key={p.id} value={p.id} className="text-[11px]">{p.propertyName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">Rows</label>
        <Select value={rows} onValueChange={setRows}>
          <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-lg px-2 bg-white">
            <SelectValue placeholder="100" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50" className="text-[11px]">50</SelectItem>
            <SelectItem value="100" className="text-[11px]">100</SelectItem>
            <SelectItem value="500" className="text-[11px]">500</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-2 md:col-span-2 lg:col-span-2">
         <Button onClick={handleApply} className="h-8 px-4 rounded-lg bg-[#1E293B] hover:bg-black text-white font-bold text-[10px] gap-1.5 uppercase">
           Filter
         </Button>
         <Button variant="outline" onClick={handleExportExcel} className="h-8 px-4 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[10px] gap-1.5 hover:bg-[#F8FAFC] uppercase">
           <Download className="h-3 w-3" />
           Excel
         </Button>
         <Button variant="ghost" onClick={handleClear} className="h-8 px-3 text-[#64748B] font-bold text-[10px] hover:bg-transparent uppercase">
           Clear
         </Button>
      </div>
    </div>
  );
}
