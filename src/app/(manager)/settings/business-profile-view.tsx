"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, Save, Upload } from "lucide-react";

export function BusinessProfileView({ organization }: { organization: any }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of update
    setTimeout(() => {
      setLoading(false);
      toast.success("Business profile updated successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-[24px] font-bold text-slate-800 tracking-tight leading-tight">Business Profile</h2>
        <p className="text-[13px] text-slate-500 font-medium tracking-tight">
          Manage your company details, logo, and contact information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-100 shadow-none bg-white rounded-xl p-8 border">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="space-y-3">
                <Label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">BUSINESS LOGO</Label>
                <div className="h-32 w-32 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-bold">Upload Logo</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-bold text-slate-700">Display Name</Label>
                  <Input
                    defaultValue={organization?.name || ""}
                    placeholder="e.g. Acme Properties"
                    className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-bold text-slate-700">Trading Name</Label>
                  <Input
                    defaultValue={organization?.tradingName || ""}
                    placeholder="e.g. Acme Ltd"
                    className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-bold text-slate-700">Registration Number</Label>
                  <Input
                    defaultValue={organization?.regNumber || ""}
                    placeholder="e.g. CPR/2023/12345"
                    className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-bold text-slate-700">Tax Number (PIN)</Label>
                  <Input
                    defaultValue={organization?.taxNumber || ""}
                    placeholder="e.g. P051234567X"
                    className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-slate-50">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-slate-700">Contact Email</Label>
                <Input
                  defaultValue={organization?.contactEmail || ""}
                  placeholder="hello@acme.com"
                  className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-slate-700">Contact Phone</Label>
                <Input
                  defaultValue={organization?.contactPhone || ""}
                  placeholder="+254 700 000 000"
                  className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[12px] font-bold text-slate-700">Physical Address</Label>
                <Input
                  defaultValue={organization?.address || ""}
                  placeholder="e.g. Westlands, Nairobi"
                  className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold h-10 px-8 rounded-lg text-[13px] shadow-sm flex items-center gap-2"
              >
                {loading ? "Saving..." : <><Save className="h-4 w-4" /> Save profile details</>}
              </Button>
            </div>
          </div>
        </Card>
      </form>

      <div className="h-10" />
    </div>
  );
}
