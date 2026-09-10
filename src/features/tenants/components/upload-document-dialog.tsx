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
import { Upload, FileText, Calendar, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
}

export function UploadDocumentDialog({
  isOpen,
  onClose,
  tenant,
}: UploadDocumentDialogProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onClose();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-md border-none shadow-2xl bg-white">
        <div className="p-3">
          <DialogHeader className="space-y-0 mb-3 px-1">
            <DialogTitle className="text-[12px] font-black text-slate-950 tracking-tight">Upload new document</DialogTitle>
            <p className="text-[8px] text-slate-400 font-bold leading-none">
              Link files to the correct tenant record.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-2.5 px-1">
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
              {/* Link To */}
              <div className="space-y-0.5">
                <Label className="text-[6px] font-black uppercase text-slate-400 tracking-widest ml-0.5">Link to</Label>
                <Select defaultValue="tenant">
                  <SelectTrigger className="h-6 bg-slate-50/50 border-slate-100 rounded text-[8px] font-black text-slate-800 focus:ring-1 focus:ring-blue-500">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded shadow-xl border-slate-50">
                    <SelectItem value="tenant" className="text-[8px] font-bold">Tenant</SelectItem>
                    <SelectItem value="unit" className="text-[8px] font-bold">Unit</SelectItem>
                    <SelectItem value="property" className="text-[8px] font-bold">Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Record */}
              <div className="space-y-0.5">
                <Label className="text-[6px] font-black uppercase text-slate-400 tracking-widest ml-0.5">Record</Label>
                <div className="relative">
                  <Input
                    readOnly
                    value={`${tenant?.firstName} ${tenant?.lastName}`}
                    className="h-6 bg-slate-50 border-slate-100 rounded text-[8px] font-black text-slate-400 pl-6"
                  />
                  <FileText className="absolute left-1.5 top-1.5 h-2.5 w-2.5 text-slate-200" />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-0.5">
                <Label className="text-[6px] font-black uppercase text-slate-400 tracking-widest ml-0.5">Category</Label>
                <Select defaultValue="screening">
                  <SelectTrigger className="h-6 bg-slate-50/50 border-slate-100 rounded text-[8px] font-black text-slate-800 focus:ring-1 focus:ring-blue-500">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded shadow-xl border-slate-50">
                    <SelectItem value="screening" className="text-[8px] font-bold">Screening / ID</SelectItem>
                    <SelectItem value="lease" className="text-[8px] font-bold">Lease Agreement</SelectItem>
                    <SelectItem value="other" className="text-[8px] font-bold">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Files */}
              <div className="space-y-0.5">
                <Label className="text-[6px] font-black uppercase text-slate-400 tracking-widest ml-0.5">Files</Label>
                <div className="flex h-6 w-full rounded border border-slate-100 bg-emerald-50/5 px-1.5 py-0.5 text-[8px] items-center relative cursor-pointer hover:bg-emerald-50 transition-colors">
                   <Upload className="h-2.5 w-2.5 mr-1 text-emerald-500" />
                   <span className="font-black text-emerald-800 truncate">Choose Files</span>
                   <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
               {/* Notes */}
               <div className="space-y-0.5">
                  <Label className="text-[6px] font-black uppercase text-slate-400 tracking-widest ml-0.5">Notes</Label>
                  <Input
                    placeholder="Optional notes"
                    className="h-6 border-slate-100 rounded text-[8px] font-bold placeholder:text-slate-200 focus:ring-1 focus:ring-blue-500"
                  />
               </div>

               {/* Next Renewal Date */}
               <div className="space-y-0.5">
                  <Label className="text-[6px] font-black uppercase text-slate-400 tracking-widest ml-0.5">Renewal Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      className="h-6 border-slate-100 rounded text-[8px] font-bold focus:ring-1 focus:ring-blue-500 pl-6"
                    />
                    <Calendar className="absolute left-1.5 top-1.5 h-2.5 w-2.5 text-slate-200" />
                  </div>
               </div>
            </div>

            {/* Info Box - Atom Style */}
            <div className="bg-slate-50/30 rounded p-2 border border-slate-100">
               <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {[
                    "Max 50MB per file",
                    "PDF, PNG, JPG, CSV",
                    "Select type correctly",
                    "Notes for ID numbers",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-1 text-[7px] text-slate-400 font-black leading-tight">
                       <div className="h-0.5 w-0.5 rounded-full bg-slate-200 mt-1 shrink-0" />
                       {text}
                    </li>
                  ))}
               </ul>
            </div>

            <DialogFooter className="flex items-center gap-1 mt-1 border-t border-slate-50 pt-2.5">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-6 px-3 rounded text-[8px] font-black text-slate-400 hover:text-slate-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="h-6 px-4 rounded text-[8px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm border-none"
              >
                {isUploading ? "..." : "Upload Document"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
