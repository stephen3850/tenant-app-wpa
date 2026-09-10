"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Handshake,
  AlertCircle,
  Calendar,
  MoreHorizontal,
  X,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-3 lg:p-4 space-y-3 bg-[#F5F7FA] min-h-screen font-sans">
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-3 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-0">
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#98A2B3]">RECEIVABLES</p>
          <h1 className="text-xl font-black text-[#111827] tracking-tight">Collections</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 lg:justify-end">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#98A2B3]" />
            <Input
              placeholder="Search tenant, unit, case.."
              className="pl-8 h-8 border-[#DCE3EA] bg-white rounded-md text-[10px] focus:ring-[#56A600]/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-32 border-[#DCE3EA] bg-white rounded-md text-[10px] font-medium text-[#667085]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-[10px]">All statuses</SelectItem>
              <SelectItem value="pending" className="text-[10px]">Pending</SelectItem>
              <SelectItem value="overdue" className="text-[10px]">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Button className="h-8 px-4 bg-[#2F80ED] hover:bg-[#2563EB] text-white text-[10px] font-bold rounded-md shadow-sm">
            Filter
          </Button>
          <Button variant="ghost" className="h-8 px-4 bg-[#1F2937] hover:bg-[#111827] text-white text-[10px] font-bold rounded-md">
            Clear
          </Button>
          <Button variant="outline" className="h-8 px-4 border-[#2F80ED] text-[#2F80ED] text-[10px] font-bold rounded-md gap-1.5 hover:bg-blue-50">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Promises Card */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-[#98A2B3] uppercase tracking-wider">PROMISES</p>
              <h2 className="text-lg font-black text-[#111827]">To pay today</h2>
            </div>

            <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3 min-w-[140px]">
              <div className="h-8 w-8 rounded-full bg-[#56A600]/10 flex items-center justify-center">
                 <Handshake className="h-4 w-4 text-[#56A600]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#111827] leading-none">0</p>
                <p className="text-[9px] font-medium text-[#667085] mt-1">Tenants promised</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white border border-[#DCE3EA] rounded-xl p-3 min-w-[180px]">
              <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-[#98A2B3] uppercase">Broken promises</p>
                <p className="text-[11px] font-black text-[#111827]">Missed commitments</p>
              </div>
              <div className="ml-auto h-7 w-7 rounded-full border border-rose-500 flex items-center justify-center text-rose-500 font-bold text-xs">
                0
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="bg-[#DCFCE7] text-[#166534] text-[9px] font-black px-2.5 py-1 rounded-md">
                Today
             </div>
             <Button variant="outline" className="h-9 px-5 border-[#2F80ED] text-[#2F80ED] text-xs font-bold rounded-lg hover:bg-blue-50">
               View promises
             </Button>
             <Button variant="outline" className="h-9 px-5 border-[#1F2937] text-[#1F2937] text-xs font-bold rounded-lg hover:bg-gray-50">
               View broken
             </Button>
          </div>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#DCE3EA]">
                <th className="px-4 py-2.5 text-[10px] font-black text-[#667085] uppercase tracking-wider">Tenant</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-[#667085] uppercase tracking-wider">Units</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-[#667085] uppercase tracking-wider">Due</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-[#667085] uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-[#667085] uppercase tracking-wider">Paid MTD</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-[#667085] uppercase tracking-wider">Balance</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-[#667085] uppercase tracking-wider">Last comment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-16">
                  <p className="text-[11px] font-medium text-[#667085]">No collections tenants found.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-[#F9FAFB] border-t border-[#DCE3EA] h-2 relative">
           {/* Custom Scrollbar visual */}
           <div className="absolute top-1/2 left-2 right-2 h-1.5 -translate-y-1/2 bg-[#D1D5DB] rounded-full w-4/5" />
        </div>
      </div>
    </div>
  );
}
