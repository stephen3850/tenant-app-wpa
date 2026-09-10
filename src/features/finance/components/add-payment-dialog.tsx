"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface AddPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
  outstandingBalance: number;
}

export function AddPaymentDialog({
  isOpen,
  onClose,
  tenant,
  outstandingBalance,
}: AddPaymentDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Logic for saving payment
    setTimeout(() => {
      setLoading(false);
      toast.success("Payment recorded successfully");
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-lg border-none shadow-2xl bg-white">
        <div className="p-3">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-2 mb-3">
            <DialogTitle className="text-[14px] font-black text-slate-900">Add Payment</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
            {/* Date */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Date</Label>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="h-8 border-slate-200 rounded text-[11px] font-bold"
              />
            </div>

            {/* Service */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Service</Label>
              <Select defaultValue="none">
                <SelectTrigger className="h-8 border-slate-200 rounded text-[11px] font-bold">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-[11px] font-bold">None</SelectItem>
                  <SelectItem value="rent" className="text-[11px] font-bold">Rent</SelectItem>
                  <SelectItem value="water" className="text-[11px] font-bold">Water</SelectItem>
                  <SelectItem value="electricity" className="text-[11px] font-bold">Electricity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Type */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Payment type</Label>
              <Input
                defaultValue="Rent"
                className="h-8 border-slate-200 rounded text-[11px] font-bold"
              />
              <p className="text-[8px] text-slate-400 font-bold">Auto-detected from service; defaults to rent.</p>
            </div>

            {/* Unit */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Unit (optional)</Label>
              <Select defaultValue="none">
                <SelectTrigger className="h-8 border-slate-200 rounded text-[11px] font-bold">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-[11px] font-bold">Don't link to a unit</SelectItem>
                  {tenant?.leases?.map((l: any) => (
                    <SelectItem key={l.unit.id} value={l.unit.id} className="text-[11px] font-bold">
                      {l.unit.unitNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[8px] text-slate-400 font-bold">Link for multi-unit tenants if needed.</p>
            </div>

            {/* Outstanding Balance */}
            <div className="py-1">
              <p className="text-[10px] font-black text-[#d97706]">
                Outstanding balance: {formatCurrency(outstandingBalance)}
              </p>
            </div>

            {/* Amount */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                className="h-8 border-slate-200 rounded text-[11px] font-bold"
              />
            </div>

            {/* Bank */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Bank</Label>
              <Select>
                <SelectTrigger className="h-8 border-slate-200 rounded text-[11px] font-bold">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpesa" className="text-[11px] font-bold">M-Pesa</SelectItem>
                  <SelectItem value="equity" className="text-[11px] font-bold">Equity Bank</SelectItem>
                  <SelectItem value="kcb" className="text-[11px] font-bold">KCB Bank</SelectItem>
                  <SelectItem value="coop" className="text-[11px] font-bold">Co-op Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Narration */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Narration</Label>
              <Input
                placeholder="Optional note"
                className="h-8 border-slate-200 rounded text-[11px] font-bold"
              />
            </div>

            {/* Confirmation code */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Confirmation code</Label>
              <Input
                placeholder="Ref #"
                className="h-8 border-slate-200 rounded text-[11px] font-bold"
              />
            </div>
          </form>

          <DialogFooter className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 px-5 rounded-md text-[10px] font-black border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="h-8 px-6 rounded-md text-[10px] font-black bg-[#4c9e00] hover:bg-[#3d7d00] text-white shadow-sm border-none transition-all active:scale-95"
            >
              {loading ? "..." : "Save"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
