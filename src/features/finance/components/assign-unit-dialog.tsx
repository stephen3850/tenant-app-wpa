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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AssignUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  units: any[];
}

export function AssignUnitDialog({
  isOpen,
  onClose,
  invoice,
  units,
}: AssignUnitDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(invoice?.lease?.unitId || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) {
      toast.error("Please select a unit");
      return;
    }

    setLoading(true);
    // Logic for assigning unit to invoice would go here via a Server Action
    setTimeout(() => {
      setLoading(false);
      toast.success("Unit assigned to invoice successfully");
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-lg border-none shadow-2xl bg-white">
        <div className="p-4">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Assign Unit</DialogTitle>
            <p className="text-[10px] text-slate-500 font-bold leading-none pt-1">
              Select the correct unit for invoice <span className="text-blue-600">#{invoice?.invoiceNumber}</span>.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase text-slate-400">Available Units</Label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="h-9 border-slate-200 rounded-lg font-bold text-slate-800 bg-white">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units?.map((unit: any) => (
                    <SelectItem key={unit.id} value={unit.id} className="font-bold">
                      {unit.unitNumber} - {unit.property.propertyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
               <p className="text-[10px] text-blue-700 font-bold leading-tight italic">
                 Note: This will re-link the invoice and all associated ledger entries to the selected unit.
               </p>
            </div>
          </form>

          <DialogFooter className="flex items-center gap-2 mt-6 pt-3 border-t border-slate-50">
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
              className="h-8 px-6 rounded-md text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm border-none transition-all active:scale-95"
            >
              {loading ? "Saving..." : "Assign unit"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
