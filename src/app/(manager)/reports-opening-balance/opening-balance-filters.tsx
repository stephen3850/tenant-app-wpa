"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, FileText, Filter } from "lucide-react";
import { toast } from "sonner";

interface Props {
  properties: { id: string; propertyName: string }[];
  units: { id: string; unitNumber: string; propertyId: string }[];
  initialFilters: {
    year: string;
    propertyId: string;
    unitId: string;
  };
}

export function OpeningBalanceFilters({ properties, units, initialFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [year, setYear] = useState(initialFilters.year);
  const [propertyId, setPropertyId] = useState(initialFilters.propertyId);
  const [unitId, setUnitId] = useState(initialFilters.unitId);

  // Filter units based on selected property
  const filteredUnits = propertyId === "all"
    ? []
    : units.filter(u => u.propertyId === propertyId);

  // Reset unit if property changes and current unit is not in property
  useEffect(() => {
    if (propertyId === "all") {
        setUnitId("all");
    } else if (unitId !== "all") {
        const unitExists = units.find(u => u.id === unitId && u.propertyId === propertyId);
        if (!unitExists) setUnitId("all");
    }
  }, [propertyId, units, unitId]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    params.set("propertyId", propertyId);
    params.set("unitId", unitId);
    router.push(`?${params.toString()}`);
    toast.success("Filters applied");
  };

  const handleExportExcel = () => {
    toast.info("Preparing Excel export...");
    // Mock logic
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-4">
      <div className="lg:col-span-12 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#64748B] uppercase tracking-wider">Year</label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg px-2 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#64748B] uppercase tracking-wider">Property</label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg px-2 bg-white">
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-[#64748B] uppercase tracking-wider">Unit / Apartment</label>
            <Select value={unitId} onValueChange={setUnitId} disabled={propertyId === "all"}>
              <SelectTrigger className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg px-2 bg-white">
                <SelectValue placeholder="All units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All units</SelectItem>
                {filteredUnits.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.unitNumber}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button variant="outline" onClick={handleExportExcel} className="h-8 px-4 rounded-lg border-[#DCE3EA] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm">
                <FileDown className="h-3.5 w-3.5" />
                Excel
            </Button>
            <Button variant="outline" onClick={handlePrintPDF} className="h-8 px-4 rounded-lg border-[#DCE3EA] text-[#1E293B] font-bold text-[10px] gap-2 shadow-sm">
                <FileText className="h-3.5 w-3.5" />
                PDF
            </Button>
            <Button onClick={handleApply} className="h-8 px-8 rounded-lg bg-[#56A600] hover:bg-[#4a8e00] text-white font-black text-[11px] gap-2 uppercase shadow-md md:ml-2">
                <Filter className="h-3.5 w-3.5 fill-white" />
                Apply
            </Button>
        </div>
      </div>
    </div>
  );
}
