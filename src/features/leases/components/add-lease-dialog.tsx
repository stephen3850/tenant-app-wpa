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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface AddLeaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
}

export function AddLeaseDialog({
  isOpen,
  onClose,
  tenant,
}: AddLeaseDialogProps) {
  const [loading, setLoading] = useState(false);
  const [enablePenalty, setEnablePenalty] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Logic for saving lease
    setTimeout(() => {
      setLoading(false);
      toast.success("Lease created successfully");
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-lg border-none shadow-2xl bg-white">
        <div className="p-4">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Add Lease</DialogTitle>
            <p className="text-[10px] text-slate-500 font-bold leading-none pt-1">
              Assign a vacant unit and capture billing details for this tenant.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
            {/* Unit & Billing Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Available unit</Label>
                <Select defaultValue="none">
                  <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-[9px] font-bold">No vacant units available</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[7px] text-slate-300 font-bold italic">Create a vacant unit first to attach a lease.</p>
              </div>

              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Lease billing</Label>
                <Select defaultValue="separate">
                  <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold">
                    <SelectValue placeholder="Billing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="separate" className="text-[9px] font-bold">Create separate lease and invoice</SelectItem>
                    <SelectItem value="combined" className="text-[9px] font-bold">Combined lease invoice</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[7px] text-slate-300 font-bold italic">Useful for combined multi-unit billing.</p>
              </div>
            </div>

            {/* Frequency & Format Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Frequency</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly" className="text-[9px] font-bold">Monthly</SelectItem>
                    <SelectItem value="quarterly" className="text-[9px] font-bold">Quarterly</SelectItem>
                    <SelectItem value="yearly" className="text-[9px] font-bold">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Pay account format</Label>
                <Select defaultValue="prefix">
                  <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefix" className="text-[9px] font-bold">Property Prefix # Unit Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount & Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Amount</Label>
                <Input placeholder="0.00" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Start date (optional)</Label>
                <Input type="date" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
              </div>
            </div>

            {/* End Date & Next Due */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">End date (optional)</Label>
                <Input type="date" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Next due date (optional)</Label>
                <Input type="date" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
              </div>
            </div>

            {/* Deposits Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3">
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Lease Deposit</Label>
                <Input placeholder="Uses unit deposit by default" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Water Deposit</Label>
                <Input placeholder="Optional" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Electricity Deposit</Label>
                <Input placeholder="Optional" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
              </div>
              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase text-slate-400">Grace period (days)</Label>
                <Input placeholder="Uses property default" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
              </div>
            </div>

            {/* Penalty Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Checkbox id="penalty" checked={enablePenalty} onCheckedChange={(v) => setEnablePenalty(!!v)} />
                <div className="space-y-0.5">
                  <Label htmlFor="penalty" className="text-[10px] font-black text-slate-900 leading-none">Enable lease penalty</Label>
                  <p className="text-[8px] text-slate-400 font-bold leading-none">Overrides property late-fee terms for this lease.</p>
                </div>
              </div>

              {enablePenalty && (
                <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-1 duration-200">
                  <div className="space-y-1">
                    <Label className="text-[8px] font-black uppercase text-slate-400">Penalty rate (%)</Label>
                    <Input placeholder="e.g. 5" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[8px] font-black uppercase text-slate-400">Penalty cap (%)</Label>
                    <Input placeholder="Optional cap" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
               <p className="text-[8px] text-slate-400 font-bold italic">Lease status defaults to <strong>Active</strong>.</p>
            </div>
          </form>

          <DialogFooter className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-7 px-5 rounded text-[9px] font-black border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="h-7 px-6 rounded text-[9px] font-black bg-[#a3cf75] hover:bg-[#8eb860] text-white shadow-sm border-none transition-all active:scale-95"
            >
              {loading ? "..." : "Save lease"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
