"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { toast } from "sonner";

export function MonthlyInvoicesView({ onOpenProfile }: { onOpenProfile?: () => void }) {
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [autoClose, setAutoClose] = useState(true);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-[26px] font-bold text-[#1A202C] tracking-tight leading-tight">Monthly Invoices</h2>
          <p className="text-[14px] text-slate-500 font-medium tracking-tight">
            Generate, regenerate, and close rent invoices.
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

      <div className="space-y-6">
        {/* Generate Monthly Invoices Section */}
        <Card className="border-slate-100 shadow-none bg-white rounded-2xl p-8 border">
            <div className="space-y-6">
                <div className="space-y-1">
                    <h3 className="text-[17px] font-bold text-[#1A202C] tracking-tight">Generate Monthly Invoices</h3>
                    <p className="text-[13px] text-slate-500 font-medium tracking-tight">
                        Create rent invoices for a selected month. New invoices are generated without a balance brought forward line.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Checkbox
                        id="autoGenerate"
                        checked={autoGenerate}
                        onCheckedChange={(v) => setAutoGenerate(!!v)}
                        className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
                    />
                    <Label htmlFor="autoGenerate" className="text-[15px] font-bold text-[#1A202C] cursor-pointer flex items-center gap-2">
                        Auto-generate invoices (every 5 minutes)
                        <span className="text-slate-400 font-medium text-[13px] ml-1">Enabled (default)</span>
                    </Label>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="bg-[#2D3748] hover:bg-[#1A202C] text-white font-bold h-11 px-8 rounded-xl text-[14px]">
                        Generate Invoices
                    </Button>
                    <Button variant="outline" className="bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] border-none font-bold h-11 px-8 rounded-xl text-[14px]">
                        Regenerate Month
                    </Button>
                </div>

                <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                    Regenerate removes the selected month's rent invoices and rebuilds clean rent invoices for that month. Use it before payments, credit notes, deposit applications, or bad-debt write-offs are linked to that month.
                </p>
            </div>
        </Card>

        {/* Close Zero-Balance Invoices Section */}
        <Card className="border-slate-100 shadow-none bg-white rounded-2xl p-8 border">
            <div className="space-y-6">
                <div className="space-y-1">
                    <h3 className="text-[17px] font-bold text-[#1A202C] tracking-tight">Close Zero-Balance Invoices</h3>
                    <p className="text-[13px] text-slate-500 font-medium tracking-tight leading-relaxed">
                        Automatically close pending invoices when the tenant statement balance is zero or a credit, or when an individual invoice total due is zero.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Checkbox
                        id="autoClose"
                        checked={autoClose}
                        onCheckedChange={(v) => setAutoClose(!!v)}
                        className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
                    />
                    <Label htmlFor="autoClose" className="text-[15px] font-bold text-[#1A202C] cursor-pointer flex items-center gap-2">
                        Auto-close pending invoices
                        <span className="text-slate-400 font-medium text-[13px] ml-1">Enabled (default)</span>
                    </Label>
                </div>

                <Button className="bg-[#2D3748] hover:bg-[#1A202C] text-white font-bold h-11 px-8 rounded-xl text-[14px]">
                    Close Pending Invoices
                </Button>
            </div>
        </Card>
      </div>

      <div className="h-10" />
    </div>
  );
}
