"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, Search, Zap, Scale, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { deleteUnitAction } from "@/features/units/actions";
import { useRouter } from "next/navigation";

interface UnitInventoryTableProps {
  units: any[];
}

export function UnitInventoryTable({ units }: UnitInventoryTableProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredUnits = units.filter(unit =>
    unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (unit.floor && unit.floor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSelectAll = () => {
    if (selectedUnits.length === filteredUnits.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(filteredUnits.map(u => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedUnits(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this unit?")) {
      return;
    }

    try {
      const result = await deleteUnitAction(id);
      if (result.success) {
        toast.success("Unit deleted successfully");
        window.dispatchEvent(new CustomEvent("refresh-sidebar-stats"));
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete unit");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  if (!isMounted) {
    return <div className="h-64 flex items-center justify-center text-slate-400 font-medium">Loading units...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 px-6 border-b border-[#DCE3EA]">
        <div className="space-y-1 mb-4">
           <h2 className="text-base font-bold text-[#1F2937]">Units</h2>
           <p className="text-[11px] font-medium text-[#64748B]">
             {units.length} unit in this property • 0 with meter/account links
           </p>
           <p className="text-[11px] text-[#64748B]">
             Select rows to bulk edit rent, deposit, status, floor, type, availability, and public listing visibility.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
           <Button variant="outline" className="h-8 px-4 rounded-lg border-[#DCE3EA] font-bold text-[10px] gap-2 shadow-sm uppercase">
             <Zap className="h-3.5 w-3.5" /> Meter/account links
           </Button>
           <Button variant="outline" className="h-8 px-4 rounded-lg border-[#DCE3EA] font-bold text-[10px] gap-2 shadow-sm uppercase text-[#1D6AE5] border-[#DCE3EA]">
             <Scale className="h-3.5 w-3.5" /> Adjust rent
           </Button>
           <Button disabled variant="outline" className="h-8 px-4 rounded-lg border-[#DCE3EA] font-bold text-[10px] gap-2 shadow-sm uppercase bg-[#F1F5F9] text-[#94A3B8]">
             <Lock className="h-3.5 w-3.5" /> Save selected
           </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
          <Input
            placeholder="Search by unit or floor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 rounded-lg border-[#E2E8F0] bg-[#F9FAFB] text-[11px] placeholder:text-[11px]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow className="border-[#DCE3EA] h-10">
              <TableHead className="w-12 px-4"><Checkbox checked={selectedUnits.length === filteredUnits.length && filteredUnits.length > 0} onCheckedChange={toggleSelectAll} className="h-4 w-4" /></TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-8">#</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-20">UNIT</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-24">FLOOR</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-32">TYPE</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-32">AMOUNT</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-32">DEPOSIT</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-28">STATUS</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-20">PUBLIC</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-[#98A2B3] px-4 w-12 text-center">METERS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-xs font-medium text-slate-400 uppercase italic">
                  No units found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((unit, index) => (
                <TableRow key={unit.id} className="border-[#DCE3EA] h-14 group hover:bg-[#F8FAFC]">
                  <TableCell className="px-4"><Checkbox checked={selectedUnits.includes(unit.id)} onCheckedChange={() => toggleSelect(unit.id)} className="h-4 w-4" /></TableCell>
                  <TableCell className="text-[11px] font-bold text-slate-400 px-4">{index + 1}</TableCell>
                  <TableCell className="px-4">
                     <span className="text-[11px] font-black text-[#1F2937]">{unit.unitNumber}</span>
                  </TableCell>
                  <TableCell className="px-4">
                     <div className="bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-[11px] font-medium text-[#1F2937]">
                        {unit.floor || "Floor 1"}
                     </div>
                  </TableCell>
                  <TableCell className="px-4">
                     <div className="bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-[11px] font-medium text-[#1F2937] uppercase">
                        {unit.unitType || "Unset"}
                     </div>
                  </TableCell>
                  <TableCell className="px-4">
                     <div className="bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-[11px] font-medium text-[#1F2937] text-right">
                        {Number(unit.monthlyRent).toFixed(2)}
                     </div>
                  </TableCell>
                  <TableCell className="px-4">
                     <div className="bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-[11px] font-medium text-[#1F2937] text-right">
                        {Number(unit.securityDeposit).toFixed(2)}
                     </div>
                  </TableCell>
                  <TableCell className="px-4">
                     <div className="bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-[11px] font-medium text-[#1F2937]">
                        {unit.occupancyStatus === "VACANT" ? "Vacant" : "Occupied"}
                     </div>
                  </TableCell>
                  <TableCell className="px-4">
                     <div className="flex items-center gap-1.5">
                        <Checkbox checked={true} readOnly className="h-4 w-4 rounded-md border-[#E2E8F0]" />
                        <span className="text-[10px] font-bold text-[#64748B]">Listed</span>
                     </div>
                  </TableCell>
                  <TableCell className="px-4 text-center">
                     <span className="text-[11px] font-medium text-[#64748B]">0</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
