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
import { FileDown, FileText, Filter, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  properties: { id: string; propertyName: string }[];
  initialFilters: {
    start: string;
    end: string;
    propertyId: string;
  };
}

export function ReportFilters({ properties, initialFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [start, setStart] = useState(initialFilters.start);
  const [end, setEnd] = useState(initialFilters.end);
  const [propertyId, setPropertyId] = useState(initialFilters.propertyId);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("start", start);
    params.set("end", end);
    params.set("propertyId", propertyId);
    router.push(`?${params.toString()}`);
    toast.success("Filters applied successfully");
  };

  const handleExportCSV = () => {
    // Basic CSV trigger - in production this would call an API
    toast.info("Generating Excel export...");
    setTimeout(() => {
        window.alert("CSV Export logic: This will download a generated file based on the filtered dataset.");
    }, 500);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 relative z-10">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">START</label>
          <div className="relative group">
            <Input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">END</label>
          <Input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-wider">PROPERTY</label>
          <Select value={propertyId} onValueChange={setPropertyId}>
            <SelectTrigger className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg bg-white">
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
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleApply} className="h-9 px-6 bg-[#12B76A] hover:bg-[#0f9d58] text-white font-black text-[11px] rounded-lg shadow-sm">
          <Filter className="h-3.5 w-3.5 mr-2" />
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleExportCSV} className="h-9 px-4 rounded-lg border-[#E2E8F0] bg-white text-[#1E293B] font-bold text-[11px] gap-2 shadow-sm">
          <FileDown className="h-3.5 w-3.5" />
          Excel
        </Button>
        <Button variant="outline" onClick={handlePrintPDF} className="h-9 px-4 rounded-lg border-[#3B82F6] text-[#3B82F6] font-bold text-[11px] gap-2 shadow-sm">
          <FileText className="h-3.5 w-3.5" />
          PDF
        </Button>
      </div>
    </div>
  );
}
