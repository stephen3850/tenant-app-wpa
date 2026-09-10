"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewInvoiceFormProps {
  tenant?: any;
}

export function NewInvoiceForm({ tenant }: NewInvoiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    { service: "none", description: "", qty: 1, amount: 0.00 },
  ]);

  const handleAddItem = () => {
    setItems([...items, { service: "none", description: "", qty: 1, amount: 0.00 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Invoice created successfully");
      router.back();
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        {/* Header Area */}
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">New Invoice</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="bg-[#1e293b] text-white hover:bg-[#0f172a] border-none font-black px-6 h-8 rounded-lg shadow-sm"
          >
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Tenant</Label>
              <Select defaultValue={tenant?.id || "none"}>
                <SelectTrigger className="h-10 border-slate-200 rounded-xl font-bold text-slate-800 bg-white">
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={tenant?.id || "none"} className="font-bold">
                    {tenant ? `${tenant.firstName} ${tenant.lastName} (${tenant.tenantCode || "AD"})` : "Select tenant"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Date</Label>
              <Input type="date" className="h-10 border-slate-200 rounded-xl font-bold bg-white" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Due date</Label>
              <Input type="date" className="h-10 border-slate-200 rounded-xl font-bold bg-white" />
              <p className="text-[9px] text-slate-400 font-bold leading-tight pt-1">Used by Collections reminders and overdue tracking.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Title</Label>
              <Input placeholder="Invoice title" className="h-10 border-slate-200 rounded-xl font-bold bg-white" />
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Notes</Label>
            <Input placeholder="Internal notes..." className="h-10 border-slate-200 rounded-xl font-bold bg-white" />
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-none">Items</h3>
              <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-tighter">Add services enabled for tenants. Leave blank rows unused.</p>
            </div>

            <div className="space-y-2.5">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end group">
                  <div className="md:col-span-3 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Service</Label>
                    <Select defaultValue={item.service}>
                      <SelectTrigger className="h-9 border-slate-200 rounded-xl font-bold text-[11px] bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent" className="text-[11px] font-bold">RENT - Monthly / periodic rent</SelectItem>
                        <SelectItem value="none" className="text-[11px] font-bold">None</SelectItem>
                        <SelectItem value="water" className="text-[11px] font-bold">Water</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-5 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Description</Label>
                    <Input
                      defaultValue={item.description}
                      placeholder="Optional description"
                      className="h-9 border-slate-200 rounded-xl font-bold text-[11px] bg-white"
                    />
                  </div>
                  <div className="md:col-span-1 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5 text-center">Qty</Label>
                    <Input
                      type="number"
                      defaultValue={item.qty}
                      className="h-9 border-slate-200 rounded-xl font-bold text-[11px] text-center bg-white"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Amount</Label>
                    <Input
                      type="number"
                      defaultValue={item.amount}
                      className="h-9 border-slate-200 rounded-xl font-bold text-[11px] bg-white"
                    />
                  </div>
                  <div className="md:col-span-1 pb-1">
                     <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="h-9 w-9 text-slate-200 hover:text-red-500 transition-colors"
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="text-[9px] font-black uppercase h-7 px-4 border-slate-200 rounded-lg gap-2 text-slate-500 hover:bg-slate-50"
            >
              <Plus className="h-3 w-3" /> Add Row
            </Button>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex items-center gap-3 border-t border-slate-50">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#4285f4] hover:bg-[#3574e2] text-white font-black px-10 rounded-lg h-10 shadow-lg shadow-blue-100 transition-all active:scale-95 border-none"
            >
              {loading ? "Saving..." : "Save Invoice"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-[#1e293b] text-white hover:bg-[#0f172a] border-none font-black px-8 h-10 rounded-lg shadow-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
