"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function RevenueActions() {
  const handleExportExcel = () => {
    toast.info("Preparing Excel export for property revenue...");
    // Mock export logic
    setTimeout(() => {
      window.alert("Excel Export: Downloading property revenue data...");
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button
        variant="outline"
        onClick={handleExportExcel}
        className="h-9 px-4 rounded-lg border-[#E2E8F0] text-[#1E293B] font-bold text-[11px] gap-2 shadow-sm"
      >
        <Download className="h-4 w-4" />
        Export Excel
      </Button>
      <Button
        onClick={handlePrint}
        className="h-9 px-6 rounded-lg bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold text-[11px] shadow-sm"
      >
        Print Report
      </Button>
    </div>
  );
}
