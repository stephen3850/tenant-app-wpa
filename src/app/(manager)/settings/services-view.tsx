"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Settings as SettingsIcon,
  Loader2,
  Edit2,
  Trash2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ServicesViewProps {
  onBack: () => void;
}

export function ServicesView({ onBack }: ServicesViewProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [paymentType, setPaymentType] = useState("Deposit");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("Monthly");
  const [amount, setAmount] = useState("0.00");

  const [services, setServices] = useState([
    { id: "1", name: "Arrears", type: "Arrears", recurring: false },
    { id: "2", name: "Bad Debt Recovery", type: "Recovery of Bad Debt", recurring: false },
    { id: "3", name: "Construction", type: "Construction", recurring: false },
    { id: "4", name: "Deposit", type: "Deposit", recurring: false },
    { id: "5", name: "Electricity", type: "Electricity", recurring: false },
    { id: "6", name: "Garbage", type: "Garbage", recurring: false },
    { id: "7", name: "Internet", type: "Internet", recurring: false },
    { id: "8", name: "Other", type: "Other", recurring: false },
    { id: "9", name: "Parking", type: "Parking", recurring: false },
    { id: "10", name: "Penalty", type: "Penalty", recurring: false },
    { id: "11", name: "Rent", type: "Rent", recurring: false },
    { id: "12", name: "Rent To Own Installment", type: "Rent to own", recurring: false },
    { id: "13", name: "Repairs", type: "Repairs", recurring: false },
    { id: "14", name: "Service Charge", type: "Service Charge", recurring: false },
    { id: "15", name: "VAT", type: "Vat", recurring: false },
    { id: "16", name: "Water", type: "Water", recurring: false },
  ]);

  const handleAdd = () => {
    if (!name) return;
    const newService = {
      id: Math.random().toString(),
      name,
      type: paymentType,
      recurring: isRecurring
    };
    setServices([...services, newService]);
    setName("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Section */}
      <Card className="border-slate-100 shadow-none bg-white rounded-xl p-5 border flex items-center justify-between">
        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px] font-bold text-[#12B76A] border-[#12B76A]/20 bg-[#12B76A]/5 px-2 py-0.5 uppercase tracking-wider">
            BILLING SETUP
          </Badge>
          <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Services</h2>
          <p className="text-[13px] text-slate-500 font-medium tracking-tight">
            Define invoice service lines and recurring add-on charges.
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="bg-slate-50 text-slate-600 border-slate-100 px-2.5 py-1 text-[11px] font-medium">
              Services: {services.length}
            </Badge>
            <Badge variant="secondary" className="bg-[#12B76A]/10 text-[#12B76A] border-none px-2.5 py-1 text-[11px] font-medium">
              Recurring: {services.filter(s => s.recurring).length}
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="h-9 px-4 rounded-lg border-slate-200 text-[12px] font-bold text-slate-600 gap-2 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Settings
        </Button>
      </Card>

      {/* Create Section */}
      <Card className="border-slate-100 shadow-none bg-white rounded-xl p-6 border">
        <div className="space-y-4">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CREATE</p>
            <h3 className="text-[16px] font-bold text-slate-800">Add New Service</h3>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 ml-0.5">Service Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Service name"
                className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#12B76A] rounded-lg"
              />
            </div>

            <div className="w-[180px] space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 ml-0.5">Payment Type</label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger className="h-10 text-[13px] border-slate-200 rounded-lg">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deposit">Deposit</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 h-10 mb-0.5 px-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(v) => setIsRecurring(!!v)}
                className="h-4 w-4 border-slate-300 data-[state=checked]:bg-[#12B76A] data-[state=checked]:border-[#12B76A]"
              />
              <label htmlFor="recurring" className="text-[13px] font-medium text-slate-600 cursor-pointer">Recurring</label>
            </div>

            <div className="w-[140px] space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 ml-0.5">Frequency</label>
              <Select value={frequency} onValueChange={setFrequency} disabled={!isRecurring}>
                <SelectTrigger className="h-10 text-[13px] border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-400">
                  <SelectValue placeholder="Monthly" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[120px] space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 ml-0.5">Amount</label>
              <Input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-10 text-[13px] border-slate-200 focus-visible:ring-[#12B76A] rounded-lg"
              />
            </div>

            <Button
              onClick={handleAdd}
              className="bg-[#65B700] hover:bg-[#58A000] text-white font-bold h-10 px-6 rounded-lg text-[13px] gap-2 mb-0"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="border-slate-100 shadow-none bg-white rounded-xl overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100">
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Payment Type</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Recurring</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-[14px] font-bold text-slate-700">{service.name}</td>
                <td className="px-6 py-4 text-center">
                  <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-medium px-3 py-0.5 rounded-full text-[11px]">
                    {service.type}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                   <span className="text-[12px] font-medium text-slate-500">
                     {service.recurring ? "Yes" : "No"}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" className="h-8 px-3 rounded-lg border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-white shadow-none">
                      Edit
                    </Button>
                    <Button variant="outline" className="h-8 px-3 rounded-lg border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-white shadow-none">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Bottom spacing */}
      <div className="h-10" />
    </div>
  );
}
