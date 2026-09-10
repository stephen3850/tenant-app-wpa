"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Send,
  Import,
  Check,
  ChevronDown,
  Building2,
  Home,
  Wallet,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function InvoicesPage() {
  const [autoGenerate, setAutoGenerate] = useState(true);

  // Mock data for UI replication
  const stats = {
    pending: 0,
    closed: 0,
    all: 0,
    rent: 0,
    utility: 0
  };

  return (
    <div className="p-3 lg:p-4 space-y-3 bg-[#F5F7FA] min-h-screen font-sans">
      {/* Main Top Card */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-3 shadow-sm space-y-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
          <div className="space-y-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#56A600]">BILLING</p>
            <h1 className="text-xl font-black text-[#111827] tracking-tight">Invoices</h1>
            <p className="text-[10px] font-medium text-[#667085]">Track issuance, deposits, and status flow from one focused ledger.</p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <Button variant="secondary" className="h-7 px-2.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#374151] text-[9px] font-bold rounded-md gap-1 border border-[#D1D5DB] shadow-sm">
              <Activity className="h-3 w-3" />
              Invoice report
            </Button>
            <Button disabled variant="outline" className="h-7 px-2.5 border-[#E5E7EB] text-[#9CA3AF] text-[9px] font-bold rounded-md gap-1 opacity-50 bg-white">
              <Send className="h-3 w-3" />
              Bulk message pending
            </Button>
            <Button variant="outline" className="h-7 px-2.5 border-[#2F80ED] text-[#2F80ED] text-[9px] font-bold rounded-md gap-1 hover:bg-blue-50 transition-colors shadow-sm">
              <Import className="h-3 w-3" />
              Import
            </Button>
            <Button className="h-7 px-2.5 bg-[#56A600] hover:bg-[#4a8e00] text-white text-[9px] font-bold rounded-md gap-1 shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              New invoice
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#DCE3EA] rounded-lg overflow-hidden divide-x divide-[#DCE3EA]">
          <div className="p-2.5 bg-white space-y-0">
            <p className="text-[8px] font-bold text-[#98A2B3] uppercase tracking-wider">PENDING</p>
            <p className="text-xl font-black text-[#111827] leading-tight">0</p>
            <p className="text-[9px] font-medium text-[#667085]">Awaiting approval / payment</p>
          </div>
          <div className="p-2.5 bg-white space-y-0">
            <p className="text-[8px] font-bold text-[#98A2B3] uppercase tracking-wider">CLOSED</p>
            <p className="text-xl font-black text-[#111827] leading-tight">0</p>
            <p className="text-[9px] font-medium text-[#667085]">Settled and archived</p>
          </div>
          <div className="p-2.5 bg-white space-y-0">
            <p className="text-[8px] font-bold text-[#98A2B3] uppercase tracking-wider">ALL INVOICES</p>
            <p className="text-xl font-black text-[#111827] leading-tight">0</p>
            <p className="text-[9px] font-medium text-[#667085]">Pending + closed</p>
          </div>
          <div className="p-2.5 bg-white space-y-1.5">
            <p className="text-[8px] font-bold text-[#98A2B3] uppercase tracking-wider">TYPES</p>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 bg-[#F0F7FF] px-1.5 py-0.5 rounded border border-[#D0E5FF]">
                <span className="text-[9px] font-bold text-[#2F80ED]">Rent</span>
                <span className="text-base font-black text-[#111827] leading-none">0</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#DCFCE7]">
                <span className="text-[9px] font-bold text-[#56A600]">Utility</span>
                <span className="text-base font-black text-[#111827] leading-none">0</span>
              </div>
            </div>
            <p className="text-[8px] font-medium text-[#667085]">Distribution by invoice type</p>
          </div>
        </div>

        {/* Monthly Generation Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-[#F9FAFB] rounded-md border border-[#DCE3EA]">
              <FileText className="h-3 w-3 text-[#56A600]" />
            </div>
            <div>
              <p className="text-[8px] font-bold text-[#111827] uppercase tracking-widest leading-none">MONTHLY GENERATION</p>
              <p className="text-[9px] font-medium text-[#667085] mt-0.5">Create rent invoices for a selected month without a brought-forward line.</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div
                onClick={() => setAutoGenerate(!autoGenerate)}
                className={cn(
                  "h-6 w-4 flex items-center justify-center rounded-[2px] cursor-pointer transition-all",
                  autoGenerate ? "bg-[#2F80ED]" : "bg-[#D1D5DB]"
                )}
              >
                {autoGenerate && <Check className="h-2.5 w-2.5 text-white" strokeWidth={5} />}
              </div>
              <span className="text-[10px] font-bold text-[#111827]">Auto-generate <span className="text-[#667085] font-medium">Enabled</span></span>
            </div>
            <Button variant="outline" className="h-8 px-3 border-[#2F80ED] text-[#2F80ED] text-[9px] font-black rounded-md gap-1 hover:bg-blue-50 transition-all shadow-sm">
              <Plus className="h-3 w-3" />
              Generate invoices
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-2.5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[8px] font-black text-[#98A2B3] uppercase tracking-wider">FILTERS</p>
          <div className="flex items-center gap-1 bg-white border border-[#DCE3EA] rounded px-1.5 py-0.5">
             <span className="text-[9px] font-medium text-[#667085]">Status</span>
             <span className="text-[9px] font-bold text-[#111827]">Pending</span>
          </div>
        </div>
        <Button variant="outline" className="h-7 px-3 border-[#111827] text-[9px] font-black rounded-md gap-1 shadow-sm bg-white">
          Show
          <ChevronDown className="h-3 w-3 text-[#111827]" />
        </Button>
      </div>

      {/* Correction Workbench */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-4 shadow-sm space-y-3">
        <div className="space-y-0">
          <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#98A2B3]">CORRECTION WORKBENCH</p>
          <h2 className="text-lg font-black text-[#111827]">Review, move, delete, and fix invoice lines from the ledger.</h2>
          <p className="text-[10px] font-medium text-[#667085]">Filter first, select the affected invoices, then use the guarded bulk actions or open one invoice for line-item corrections.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
           <div className="bg-white border border-[#DCE3EA] rounded-lg p-2.5 space-y-0 shadow-sm">
             <p className="text-[8px] font-bold text-[#98A2B3] uppercase tracking-wider">Rows in view</p>
             <p className="text-lg font-black text-[#111827]">0 / 0</p>
           </div>
           <div className="bg-white border border-[#DCE3EA] rounded-lg p-2.5 space-y-0 shadow-sm">
             <p className="text-[8px] font-bold text-[#98A2B3] uppercase tracking-wider">Visible total due</p>
             <p className="text-lg font-black text-[#111827]">KES 0.00</p>
           </div>
           <div className="bg-white border border-[#DCE3EA] rounded-lg p-2.5 space-y-0 shadow-sm">
             <p className="text-[8px] font-bold text-[#98A2B3] uppercase tracking-wider">Line items loaded</p>
             <p className="text-lg font-black text-[#111827]">0</p>
           </div>
           <div className="bg-white border border-[#DCE3EA] rounded-lg p-2.5 space-y-0 shadow-sm">
             <p className="text-[8px] font-bold text-[#98A2B3] uppercase tracking-wider">Imported rows here</p>
             <p className="text-lg font-black text-[#111827]">0</p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
           <div className="bg-[#FFF1F2] text-[#E11D48] text-[9px] font-bold px-2.5 py-1 rounded border border-[#FFE4E6]">
             Bulk delete requires typed DELETE confirmation
           </div>
           <div className="bg-[#EFF6FF] text-[#2563EB] text-[9px] font-bold px-2.5 py-1 rounded border border-[#DBEAFE]">
             Imported batches can be rolled back from the import page
           </div>
           <div className="bg-[#F8FAFC] text-[#475569] text-[9px] font-bold px-2.5 py-1 rounded border border-[#F1F5F9]">
             Open an invoice to edit quantity, amount, service, and description
           </div>
        </div>
      </div>

      {/* Invoice Ledger Section - All in one container as requested */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] shadow-sm overflow-hidden">
        {/* Ledger Header Area */}
        <div className="p-3 border-b border-[#DCE3EA] bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
             <div className="space-y-0 ml-1">
                <p className="text-[9px] font-bold text-[#111827] uppercase tracking-[0.1em]">INVOICE LEDGER</p>
                <p className="text-[9px] font-medium text-[#667085]">0 visible • 0-0 of 0 • 0 filters</p>
             </div>
             <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center border border-[#DCE3EA] rounded bg-white overflow-hidden w-44 lg:w-48 shadow-sm">
                  <div className="px-2 py-1.5 bg-[#F9FAFB] border-r border-[#DCE3EA]">
                    <Building2 className="h-3 w-3 text-[#98A2B3]" />
                  </div>
                  <Input placeholder="Property" className="border-none shadow-none focus-visible:ring-0 h-8 text-[9px] font-medium" />
                </div>
                <div className="flex items-center border border-[#DCE3EA] rounded bg-white overflow-hidden w-44 lg:w-48 shadow-sm">
                  <div className="px-2 py-1.5 bg-[#F9FAFB] border-r border-[#DCE3EA]">
                    <Home className="h-3 w-3 text-[#98A2B3]" />
                  </div>
                  <Input placeholder="Unit" className="border-none shadow-none focus-visible:ring-0 h-8 text-[9px] font-medium" />
                </div>
                <div className="flex items-center border border-[#DCE3EA] rounded bg-white overflow-hidden w-44 lg:w-48 shadow-sm">
                  <div className="px-2 py-1.5 bg-[#F9FAFB] border-r border-[#DCE3EA]">
                    <Wallet className="h-3 w-3 text-[#98A2B3]" />
                  </div>
                  <Input placeholder="e.g. >20000" className="border-none shadow-none focus-visible:ring-0 h-8 text-[9px] font-medium" />
                </div>
             </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#DCE3EA]">
                <th className="px-3 py-2 w-10">
                  <div className="h-4 w-4 border border-[#DCE3EA] rounded cursor-pointer bg-white" />
                </th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider w-8">#</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">ID</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Title</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Tenant</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Property</th>
                <th className="px-4 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Unit</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider text-right">Rent</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider text-right">Total due</th>
                <th className="px-3 py-2 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={11} className="px-3 py-16 text-center">
                  <p className="text-[10px] font-medium text-[#667085]">No invoices yet.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-[#F9FAFB] border-t border-[#DCE3EA] h-1" />
      </div>
    </div>
  );
}
