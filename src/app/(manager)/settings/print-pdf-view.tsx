"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { toast } from "sonner";

export function PrintPdfView({ onOpenProfile }: { onOpenProfile?: () => void }) {
  const [hideBalanceBf, setHideBalanceBf] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-[26px] font-bold text-[#1A202C] tracking-tight leading-tight">Invoice Print & PDF</h2>
          <p className="text-[14px] text-slate-500 font-medium tracking-tight">
            Control invoice print and PDF presentation.
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
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-[17px] font-bold text-[#1A202C] tracking-tight">Invoice Print & PDF</h3>
            <p className="text-[13px] text-slate-500 font-medium tracking-tight leading-relaxed">
              Control whether "Balance brought forward" appears on printed and PDF invoices.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Checkbox
              id="hideBalanceBf"
              checked={hideBalanceBf}
              onCheckedChange={(v) => {
                  setHideBalanceBf(!!v);
                  toast.success(v ? "Balance B/F hidden on invoices" : "Balance B/F visible on invoices");
              }}
              className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
            />
            <Label htmlFor="hideBalanceBf" className="text-[15px] font-bold text-[#1A202C] cursor-pointer flex items-center gap-2">
              Hide balance brought forward on print/PDF
              <span className="text-[#3B82F6] font-bold ml-2">
                  {hideBalanceBf ? "Hidden" : "Visible"}
              </span>
            </Label>
          </div>
        </div>
      </Card>

      <div className="h-10" />
    </div>
  );
}
