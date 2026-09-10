"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from "lucide-react";
import { toast } from "sonner";

export function DepositSetupView({ onOpenProfile }: { onOpenProfile?: () => void }) {
  const [autoInvoice, setAutoInvoice] = useState(false);
  const [invoiceTitle, setInvoiceTitle] = useState("Move-in Deposit Invoice");
  const [dueDateType, setDueDateType] = useState("Lease start date");
  const [daysAfterStart, setDaysAfterStart] = useState("0");

  const [securityDepositSource, setSecurityDepositSource] = useState("Use lease deposit field");
  const [securityFixedAmount, setSecurityFixedAmount] = useState("0");

  const [waterDepositSource, setWaterDepositSource] = useState("Use lease deposit field");
  const [waterFixedAmount, setWaterFixedAmount] = useState("0");

  const [electricityDepositSource, setElectricityDepositSource] = useState("Use lease deposit field");
  const [electricityFixedAmount, setElectricityFixedAmount] = useState("0");

  const [serviceChargeDepositSource, setServiceChargeDepositSource] = useState("Use lease deposit field");
  const [serviceChargeFixedAmount, setServiceChargeFixedAmount] = useState("0");

  const handleSave = () => {
    toast.success("Deposit setup saved successfully");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <h2 className="text-[20px] font-bold text-[#1A202C] tracking-tight leading-tight">Deposit Invoice Setup</h2>
          <p className="text-[12px] text-slate-500 font-medium tracking-tight">
            Set how new lease deposits are invoiced and posted.
          </p>
        </div>
        <Button
          onClick={onOpenProfile}
          className="bg-[#2D3748] hover:bg-[#1A202C] text-white px-3 h-8 rounded-md gap-1.5 font-bold text-[10px] shadow-sm"
        >
          <Building className="h-3 w-3" />
          Business profile
        </Button>
      </div>

      <Card className="border-slate-100 shadow-none bg-white rounded-xl p-6 border">
        <div className="space-y-6">
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-[#1A202C] tracking-tight">Deposit invoice setup</h3>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight leading-relaxed">
              Generate a separate deposit invoice when a tenant lease is created. Deposit invoices use the Deposit service account, not Rent.
            </p>
          </div>

          <div className="bg-[#F1F5F9] text-[#475569] px-2.5 py-1 rounded-md inline-flex items-center text-[11px] font-bold">
            Disabled
          </div>

          <div className="flex items-center gap-2.5">
            <Checkbox
              id="autoInvoice"
              checked={autoInvoice}
              onCheckedChange={(v) => setAutoInvoice(!!v)}
              className="h-4 w-4 border-slate-300 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
            />
            <Label htmlFor="autoInvoice" className="text-[12px] font-bold text-[#475569] cursor-pointer">
              Automatically invoice expected deposits when a lease is added
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Invoice title</Label>
              <Input
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
                className="h-9 text-[12px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-md"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due date</Label>
              <Input
                value={dueDateType}
                readOnly
                className="h-9 text-[12px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-md bg-slate-50/30"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Days after start</Label>
              <Input
                value={daysAfterStart}
                onChange={(e) => setDaysAfterStart(e.target.value)}
                className="h-9 text-[12px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <DepositSection
                title="Security deposit"
                source={securityDepositSource}
                amount={securityFixedAmount}
                onSourceChange={setSecurityDepositSource}
                onAmountChange={setSecurityFixedAmount}
            />
            <DepositSection
                title="Water deposit"
                source={waterDepositSource}
                amount={waterFixedAmount}
                onSourceChange={setWaterDepositSource}
                onAmountChange={setWaterFixedAmount}
            />
            <DepositSection
                title="Electricity deposit"
                source={electricityDepositSource}
                amount={electricityFixedAmount}
                onSourceChange={setElectricityDepositSource}
                onAmountChange={setElectricityFixedAmount}
            />
            <DepositSection
                title="Service charge deposit"
                source={serviceChargeDepositSource}
                amount={serviceChargeFixedAmount}
                onSourceChange={setServiceChargeDepositSource}
                onAmountChange={setServiceChargeFixedAmount}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 font-medium italic">
                New invoices are created once per lease and marked as Deposit so payments report under deposit balances.
            </p>
            <Button
                onClick={handleSave}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold h-9 px-6 rounded-lg text-[12px] shadow-sm"
            >
                Save deposit setup
            </Button>
          </div>
        </div>
      </Card>

      <div className="h-6" />
    </div>
  );
}

function DepositSection({ title, source, amount, onSourceChange, onAmountChange }: any) {
    return (
        <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-4 space-y-4">
            <h4 className="text-[14px] font-bold text-[#1A202C] tracking-tight">{title}</h4>
            <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount source</Label>
                <Input
                    value={source}
                    readOnly
                    className="h-8 text-[12px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-md bg-white"
                />
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fixed amount</Label>
                <Input
                    value={amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    className="h-8 text-[12px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-md bg-white"
                />
            </div>
        </div>
    )
}
