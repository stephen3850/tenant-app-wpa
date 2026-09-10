"use client";

import React, { useState } from "react";
import {
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddUtilityAccountDialogProps {
  properties: any[];
}

export function AddUtilityAccountDialog({
  properties,
}: AddUtilityAccountDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Logic for saving utility account would go here
    setTimeout(() => {
      setLoading(false);
      toast.success("Utility account added successfully");
      // Close would be handled by Dialog internal state or parent
    }, 1000);
  };

  return (
    <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-lg border-none shadow-2xl bg-white">
      <div className="p-4">
        <DialogHeader className="mb-4 border-b pb-2">
          <DialogTitle className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Add Utility Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
          {/* Property & Service */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Property</Label>
              <Select>
                <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id} className="text-[9px] font-bold">{p.propertyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Service</Label>
              <Select defaultValue="ELECTRICITY">
                <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold">
                  <SelectValue placeholder="Electricity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRICITY" className="text-[9px] font-bold">Electricity</SelectItem>
                  <SelectItem value="WATER" className="text-[9px] font-bold">Water</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Parent Account & Account Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Parent account (optional)</Label>
              <Select defaultValue="none">
                <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold ring-1 ring-emerald-100/50">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-[9px] font-bold">None</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[7px] text-slate-400 font-bold italic">Filtered by the selected property + service.</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Account name</Label>
              <Input placeholder="e.g. Citadel Real Estate" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
            </div>
          </div>

          {/* Account Number & PayBill */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Account number</Label>
              <Input placeholder="e.g. 166755868" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
            </div>
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">PayBill number</Label>
              <Input placeholder="e.g. 888888" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
            </div>
          </div>

          {/* Meter Number & Default Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Meter number</Label>
              <Input placeholder="e.g. 57100045178" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
            </div>
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Default rate</Label>
              <Input placeholder="e.g. 15.50" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
            </div>
          </div>

          {/* Due Date Rule & Days After Reading */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Due date rule</Label>
              <Select defaultValue="default">
                <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold">
                  <SelectValue placeholder="Use property default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default" className="text-[9px] font-bold">Use property default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Days after reading</Label>
              <Input placeholder="e.g. 7" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
            </div>
          </div>

          {/* Next-month day & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Next-month day</Label>
              <Input placeholder="e.g. 5" className="h-7 border-slate-100 rounded text-[9px] font-bold" />
            </div>
            <div className="space-y-1">
              <Label className="text-[8px] font-black uppercase text-slate-400">Status</Label>
              <Select defaultValue="IN_USE">
                <SelectTrigger className="h-7 border-slate-100 rounded text-[9px] font-bold">
                  <SelectValue placeholder="In use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_USE" className="text-[9px] font-bold">In use</SelectItem>
                  <SelectItem value="NOT_IN_USE" className="text-[9px] font-bold">Not in use</SelectItem>
                  <SelectItem value="TERMINATED" className="text-[9px] font-bold">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label className="text-[8px] font-black uppercase text-slate-400">Notes</Label>
            <Textarea
              placeholder="Optional notes (e.g. feeder, panel, etc.)"
              className="min-h-[60px] border-slate-100 rounded text-[9px] font-bold"
            />
          </div>
        </form>

        <DialogFooter className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
          <Button
            type="button"
            variant="outline"
            className="h-7 px-5 rounded text-[9px] font-black border-slate-200 text-slate-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="h-7 px-6 rounded text-[9px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm border-none transition-all active:scale-95"
          >
            {loading ? "..." : "Save"}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
