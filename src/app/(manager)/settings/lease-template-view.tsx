"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Building, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_TEMPLATE = `TENANCY AGREEMENT

AN AGREEMENT made on {agreement_date} between {landlord_name} of {landlord_address} (hereinafter called "the Landlord") of the one part and {tenant_name} of ID No. {tenant_id_number} (hereinafter called "the Tenant") of the other part.

WHEREAS IT IS AGREED AS FOLLOWS:

1. {landlord_name} is the Landlord/Agent for {property_name} and all rent and payments shall be made to them.

2. The Landlord agrees to let and the Tenant agrees to take the premises known as {property_location}, Unit/Flat {unit_name} (hereinafter called "the demised premises") for a term of {lease_term} commencing on {lease_start_date} and terminating on {lease_end_date} at the monthly rental of {rent_amount}, payable monthly in advance without deduction.

3. On or before the date of commencement, the Tenant shall pay the first rent and one month rent deposit of {deposit_amount}, together with electricity deposit of {electricity_deposit_amount}, water deposit of {water_deposit_amount}, service charge deposit of {service_charge_deposit_amount}, and lease agreement fee of {agreement_fee}. All payments shall be made to {landlord_name} only.

4. Thereafter the rent for the second and every succeeding month of the tenancy shall be paid in advance on the first day of each month. Payments received after the agreed due date shall attract the following penalty terms: {penalty_terms}.

5. The Tenant agrees:
i. To pay rent on the days and in the manner aforesaid, clear of all deductions whatsoever.
ii. To pay electricity, water, conservancy, service charge, and other utility charges raised in respect of the demised premises during the tenancy.`;

export function LeaseTemplateView({ onOpenProfile }: { onOpenProfile?: () => void }) {
  const [templateText, setTemplateText] = useState(DEFAULT_TEMPLATE);

  const placeholders = [
    "{agreement_date}", "{landlord_name}",
    "{landlord_address}", "{tenant_name}",
    "{tenant_id_number}", "{property_name}",
    "{property_location}", "{unit_name}",
    "{lease_start_date}", "{lease_end_date}",
    "{lease_term}", "{rent_amount}",
    "{deposit_amount}", "{water_deposit_amount}",
    "{electricity_deposit_amount}", "{service_charge_deposit_amount}",
    "{agreement_fee}", "{penalty_terms}"
  ];

  const handleSave = () => {
    toast.success("Lease agreement template saved successfully");
  };

  const handleClear = () => {
    setTemplateText("");
    toast.info("Custom template cleared");
  };

  const handleUseStarter = () => {
    setTemplateText(DEFAULT_TEMPLATE);
    toast.info("Starter template loaded");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-[26px] font-bold text-[#1A202C] tracking-tight leading-tight">Lease Agreement Template</h2>
          <p className="text-[14px] text-slate-500 font-medium tracking-tight">
            Customize lease agreement text for PDF previews and shared signing.
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
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-[17px] font-bold text-[#1A202C] tracking-tight">Lease agreement template</h3>
              <p className="text-[13px] text-slate-500 font-medium tracking-tight leading-relaxed">
                Customize the agreement text used by lease PDF previews, downloads, shared links, and signed PDFs.
              </p>
            </div>
            <div className="bg-[#EDF2F7] text-[#4A5568] px-3 py-1.5 rounded-lg flex items-center gap-2 text-[11px] font-bold">
              Built-in template active
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">TEMPLATE TEXT</p>
              <Textarea
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                placeholder="Enter tenancy agreement text here..."
                className="min-h-[400px] bg-white border-slate-200 text-[13px] font-mono leading-relaxed focus-visible:ring-[#3B82F6] rounded-xl p-6 shadow-inner resize-none custom-scrollbar"
              />
            </div>

            <div className="space-y-4">
              <p className="text-[14px] font-bold text-[#1A202C] tracking-tight">Placeholders</p>
              <div className="flex flex-wrap gap-2">
                {placeholders.map((placeholder) => (
                  <button
                    key={placeholder}
                    onClick={() => setTemplateText(prev => prev + " " + placeholder)}
                    className="bg-white border border-[#FEE2E2] text-[#E11D48] px-3 py-1.5 rounded-lg text-[12px] font-mono hover:bg-[#FFF1F2] transition-colors"
                  >
                    {placeholder}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-50">
            <div className="space-y-1">
              <p className="text-[12px] text-slate-500 font-medium">Leave blank and save to use the built-in RentalDesk agreement.</p>
              <p className="text-[12px] text-slate-500 font-medium">Use starter to load a Palm Court-style clause template.</p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClear}
                className="bg-[#2D3748] hover:bg-[#1A202C] text-white border-none font-bold h-11 px-8 rounded-xl text-[13px]"
              >
                Clear custom
              </Button>
              <Button
                variant="outline"
                onClick={handleUseStarter}
                className="bg-[#2D3748] hover:bg-[#1A202C] text-white border-none font-bold h-11 px-8 rounded-xl text-[13px]"
              >
                Use starter template
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold h-11 px-8 rounded-xl text-[14px] shadow-sm"
              >
                Save lease template
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="h-10" />
    </div>
  );
}
