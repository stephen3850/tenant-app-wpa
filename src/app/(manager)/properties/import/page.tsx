"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  ArrowLeft,
  Upload,
  FileDown,
  BookOpen,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PropertyImportPage() {
  const [loading, setLoading] = useState(false);

  const handleStartImport = () => {
    setLoading(true);
    // Logic for import
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-3 lg:p-6 space-y-3 bg-[#F5F7FA] min-h-screen font-sans animate-in fade-in duration-500">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-4 shadow-sm space-y-4">
        <div className="space-y-1">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#56A600]">DATA IMPORT</p>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Import properties, units & leases</h1>
          <p className="text-[12px] font-medium text-[#667085]">
            Upload one spreadsheet where each row creates the property, unit, tenant, optional landlord user, and lease in one go.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 px-4 border-[#56A600] text-[#56A600] text-[11px] font-black rounded-lg gap-2 hover:bg-emerald-50 transition-all shadow-sm">
            <FileDown className="h-4 w-4" />
            Download template
          </Button>
          <Button variant="outline" className="h-9 px-4 border-slate-900 text-slate-900 text-[11px] font-black rounded-lg gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <BookOpen className="h-4 w-4" />
            Download PDF guide
          </Button>
          <Button variant="outline" className="h-9 px-4 border-slate-900 text-slate-900 text-[11px] font-black rounded-lg gap-2 hover:bg-slate-50 transition-all shadow-sm" asChild>
            <Link href="/properties">
              <ChevronLeft className="h-4 w-4" />
              Back to properties
            </Link>
          </Button>
        </div>
      </div>

      {/* Upload Card */}
      <Card className="border border-[#DCE3EA] shadow-sm rounded-lg bg-white overflow-hidden">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#111827]">Upload your file</h3>
            <p className="text-[11px] font-medium text-[#667085]">
              Keep the header row from the template. Accepted formats: XLSX, XLS, CSV, or TXT.
            </p>
          </div>

          <div className="space-y-2 max-w-3xl pt-2">
            <p className="text-[10px] font-black text-[#98A2B3] uppercase tracking-wider ml-0.5">Select file</p>
            <div className="flex items-center border border-[#DCE3EA] rounded-lg overflow-hidden bg-white shadow-sm h-10">
              <label className="flex items-center px-5 h-full bg-slate-50 border-r border-[#DCE3EA] cursor-pointer hover:bg-slate-100 transition-colors group">
                <span className="text-[11px] font-black text-[#111827]">Choose File</span>
                <input type="file" className="hidden" />
              </label>
              <div className="px-5 text-[11px] font-medium text-[#98A2B3]">No file chosen</div>
            </div>
            <p className="text-[10px] text-[#667085] font-medium leading-relaxed">
              Each row should include property, unit, tenant, and lease details, with optional landlord columns.
            </p>
          </div>

          <Button
            onClick={handleStartImport}
            disabled={loading}
            className="h-10 px-8 bg-[#56A600] hover:bg-[#4a8e00] text-white text-[11px] font-black rounded-lg gap-2 shadow-sm transition-all active:scale-95 border-none mt-2"
          >
            <Upload className="h-4 w-4" />
            {loading ? "Processing..." : "Start import"}
          </Button>
        </CardContent>
      </Card>

      {/* Column Guide Card */}
      <Card className="border border-[#DCE3EA] shadow-sm rounded-lg bg-white overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#111827]">Column guide</h3>
            <p className="text-[11px] font-medium text-[#667085]">
              Use the <span className="text-[#2F80ED] font-bold">template headers</span> exactly as provided.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4">
            {/* Column 1: Property */}
            <ul className="space-y-3">
              {[
                { label: "Property Name", desc: "building name (required)" },
                { label: "Property Type", desc: "residential, commercial, warehouse, industrial" },
                { label: "Location", desc: "optional address or area" },
                { label: "Branch", desc: "branch name (must already exist if used)" },
                { label: "Unit Name / Number", desc: "shop/door reference (required)" },
                { label: "Unit Type", desc: "e.g. 2-BR, Shop, Office" },
                { label: "Monthly Rent", desc: "default rent for the unit" },
                { label: "Deposit", desc: "security deposit amount" },
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-relaxed">
                  <div className="h-1 w-1 rounded-full bg-slate-900 mt-2 shrink-0" />
                  <p className="text-[#111827] font-black"><span className="whitespace-nowrap">{item.label}</span> <span className="text-[#667085] font-medium">- {item.desc}</span></p>
                </li>
              ))}
            </ul>

            {/* Column 2: Tenant/Landlord */}
            <ul className="space-y-3">
              {[
                { label: "Tenant Name", desc: "full name (required)" },
                { label: "Tenant Email / Phone", desc: "contact details" },
                { label: "Landlord Name", desc: "optional landlord profile name" },
                { label: "Landlord Email", desc: "required when creating a new landlord user" },
                { label: "Landlord Phone", desc: "optional landlord contact number" },
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-relaxed">
                  <div className="h-1 w-1 rounded-full bg-slate-900 mt-2 shrink-0" />
                  <p className="text-[#111827] font-black"><span className="whitespace-nowrap">{item.label}</span> <span className="text-[#667085] font-medium">- {item.desc}</span></p>
                </li>
              ))}
            </ul>

            {/* Column 3: Lease */}
            <ul className="space-y-3">
              {[
                { label: "Lease Start Date", desc: "YYYY-MM-DD (required)" },
                { label: "Lease End Date", desc: "optional end date" },
                { label: "Lease Amount", desc: "overrides Monthly Rent if provided" },
                { label: "Billing Frequency", desc: "monthly, quarterly, or yearly" },
                { label: "Lease Status", desc: "active or occupied" },
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-relaxed">
                  <div className="h-1 w-1 rounded-full bg-slate-900 mt-2 shrink-0" />
                  <p className="text-[#111827] font-black"><span className="whitespace-nowrap">{item.label}</span> <span className="text-[#667085] font-medium">- {item.desc}</span></p>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
