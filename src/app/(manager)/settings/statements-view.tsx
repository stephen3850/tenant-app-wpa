"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { toast } from "sonner";

export function StatementsView({ onOpenProfile }: { onOpenProfile?: () => void }) {
  const [columns, setColumns] = useState({
    hash: true,
    name: true,
    phone: true,
    unit: true,
    rentBf: true,
    utilityBf: true,
    totalBf: true,
    rent: true,
    utility: true,
    paidMtd: true,
    totalDue: true,
    status: true,
  });

  const toggleColumn = (key: keyof typeof columns) => {
    setColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("Statement report columns updated successfully");
  };

  const columnItems = [
    { key: "hash", label: "#" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "unit", label: "Unit" },
    { key: "rentBf", label: "Rent B/F" },
    { key: "utilityBf", label: "Utility B/F" },
    { key: "totalBf", label: "Total B/F" },
    { key: "rent", label: "Rent" },
    { key: "utility", label: "Utility" },
    { key: "paidMtd", label: "Paid MTD" },
    { key: "totalDue", label: "Total Due" },
    { key: "status", label: "Status" },
  ] as const;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-[26px] font-bold text-[#1A202C] tracking-tight leading-tight">Tenant Statement Columns</h2>
          <p className="text-[14px] text-slate-500 font-medium tracking-tight">
            Choose the columns shown on tenant statement reports.
          </p>
        </div>
        <Button
          onClick={onOpenProfile}
          className="bg-[#2D3748] hover:bg-[#1A202C] text-white px-4 h-10 rounded-lg gap-2 font-bold text-[12px] shadow-sm"
        >
          <Building className="h-4 w-4" />
          Business profile
        </Button>
      </div>

      <Card className="border-slate-100 shadow-none bg-white rounded-2xl p-8 border">
        <div className="space-y-8">
          <div className="space-y-1">
            <h3 className="text-[17px] font-bold text-[#1A202C] tracking-tight">Tenant Statement Report Columns</h3>
            <p className="text-[13px] text-slate-500 font-medium tracking-tight leading-relaxed">
              Choose which columns appear on the tenant statements list and its Excel export. The View action stays available on the report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columnItems.map((item) => (
              <div
                key={item.key}
                onClick={() => toggleColumn(item.key)}
                className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100/50 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <Checkbox
                  id={item.key}
                  checked={columns[item.key]}
                  onCheckedChange={() => toggleColumn(item.key)}
                  className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
                />
                <Label htmlFor={item.key} className="text-[14px] font-bold text-slate-700 cursor-pointer">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold h-11 px-10 rounded-xl text-[14px] shadow-sm"
            >
              Save report columns
            </Button>
          </div>
        </div>
      </Card>

      <div className="h-10" />
    </div>
  );
}
