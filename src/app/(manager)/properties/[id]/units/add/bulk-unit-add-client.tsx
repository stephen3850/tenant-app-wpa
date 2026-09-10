"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileSpreadsheet,
  Save,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { bulkCreateUnitsAction } from "@/features/units/actions/unit-actions";
import Link from "next/link";

interface Property {
  id: string;
  name: string;
  numberOfFloors: number;
}

interface UnitRow {
  id: string;
  unitNumber: string;
  floor: string;
  unitType: string;
  monthlyRent: number;
  securityDeposit: number;
  isPublic: boolean;
}

export function BulkUnitAddClient({ property }: { property: Property }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [defaultFloor, setDefaultFloor] = useState("Floor 1");
  const [rows, setRows] = useState<UnitRow[]>([
    {
      id: Math.random().toString(36).substr(2, 9),
      unitNumber: "",
      floor: "Floor 1",
      unitType: "",
      monthlyRent: 0,
      securityDeposit: 0,
      isPublic: true,
    }
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Math.random().toString(36).substr(2, 9),
        unitNumber: "",
        floor: defaultFloor,
        unitType: "",
        monthlyRent: 0,
        securityDeposit: 0,
        isPublic: true,
      }
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) return;
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, updates: Partial<UnitRow>) => {
    setRows(rows.map(row => row.id === id ? { ...row, ...updates } : row));
  };

  const handleSave = async () => {
    const invalidRows = rows.filter(r => !r.unitNumber || !r.unitType || r.monthlyRent <= 0);
    if (invalidRows.length > 0) {
      toast.error("Please fill in all required fields (Unit Number, Type, and Rent) for all rows.");
      return;
    }

    setIsLoading(true);
    try {
      const unitsToCreate = rows.map(r => ({
        unitNumber: r.unitNumber,
        unitType: r.unitType,
        floor: r.floor,
        monthlyRent: r.monthlyRent,
        securityDeposit: r.securityDeposit,
      }));

      const result = await bulkCreateUnitsAction(property.id, unitsToCreate);

      if (result.success) {
        toast.success(`Successfully added ${result.count} units`);
        router.push(`/properties/${property.id}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add units");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsLoading(false);
    }
  };

  const floors = Array.from({ length: Math.max(property.numberOfFloors, 1) }, (_, i) => `Floor ${i + 1}`);
  if (!floors.includes("Grd Floor")) floors.unshift("Grd Floor");

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-700 bg-[#F5F7FA] min-h-screen">
      {/* Header */}
      <Card className="border-[#DCE3EA] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#56A600]">PROPERTIES</p>
            <h1 className="text-3xl font-black text-[#1F2937] tracking-tight">{property.name}</h1>
            <p className="text-sm font-medium text-[#667085]">Add multiple units at once.</p>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild className="h-10 rounded-xl border-[#DCE3EA] bg-white text-[#1F2937] font-bold text-xs gap-2 px-6">
          <Link href={`/properties/${property.id}`}>
            <ArrowLeft className="h-4 w-4" /> Back to property
          </Link>
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" className="h-10 rounded-xl border-[#DCE3EA] bg-white text-[#56A600] font-bold text-xs gap-2 px-6">
            <FileSpreadsheet className="h-4 w-4" /> Import spreadsheet
          </Button>
          <Button onClick={addRow} className="h-10 rounded-xl bg-white border-[#DCE3EA] text-[#1F2937] hover:bg-slate-50 font-bold text-xs gap-2 px-6">
            <Plus className="h-4 w-4" /> Add row
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-[#DCE3EA] shadow-sm rounded-2xl bg-white overflow-visible">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#1F2937]">Use multiple rows to add units in one submission.</h2>
            <div className="flex items-center gap-4 mt-6">
                <div className="space-y-1.5 w-64">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568] ml-1">Default floor for new rows</label>
                    <Select value={defaultFloor} onValueChange={setDefaultFloor}>
                        <SelectTrigger className="h-12 rounded-xl border-[#E2E8F0] bg-white text-sm font-medium">
                            <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                        <SelectContent>
                            {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-[11px] font-medium text-[#94A3B8] mt-6">
                    New rows will start on the selected floor, and you can still override any row individually.
                </p>
            </div>
          </div>

          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[1000px] space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-[200px,120px,180px,140px,140px,80px,50px] gap-4 px-4 py-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Unit name</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Floor</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Type</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Amount (KES)</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Deposit</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] text-center">Public</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] text-center">Remove</span>
                </div>

                {/* Table Rows */}
                <div className="space-y-3">
                    {rows.map((row, index) => (
                        <div key={row.id} className="grid grid-cols-[200px,120px,180px,140px,140px,80px,50px] gap-4 px-2 items-center group">
                            <div className="w-full relative z-10">
                                <input
                                    placeholder="e.g. A101"
                                    className="flex h-12 w-full min-w-[150px] rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6AE5]/30 font-bold transition-all placeholder:text-slate-300 text-slate-900 pointer-events-auto"
                                    value={row.unitNumber}
                                    onChange={(e) => updateRow(row.id, { unitNumber: e.target.value })}
                                    autoFocus={index === 0}
                                    autoComplete="off"
                                />
                            </div>
                            <Select value={row.floor} onValueChange={(v) => updateRow(row.id, { floor: v })}>
                                <SelectTrigger className="h-12 rounded-xl border-[#E2E8F0] text-sm font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={row.unitType} onValueChange={(v) => updateRow(row.id, { unitType: v })}>
                                <SelectTrigger className="h-12 rounded-xl border-[#E2E8F0] text-sm font-medium">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                    <SelectItem value="1BR Apartment">1BR Apartment</SelectItem>
                                    <SelectItem value="2BR Apartment">2BR Apartment</SelectItem>
                                    <SelectItem value="3BR Apartment">3BR Apartment</SelectItem>
                                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                                    <SelectItem value="Shop">Shop</SelectItem>
                                    <SelectItem value="Office">Office</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="number"
                                placeholder="0"
                                className="h-12 rounded-xl border-[#E2E8F0] text-sm font-medium"
                                value={row.monthlyRent || ""}
                                onChange={(e) => updateRow(row.id, { monthlyRent: Number(e.target.value) })}
                            />
                            <Input
                                type="number"
                                placeholder="0"
                                className="h-12 rounded-xl border-[#E2E8F0] text-sm font-medium"
                                value={row.securityDeposit || ""}
                                onChange={(e) => updateRow(row.id, { securityDeposit: Number(e.target.value) })}
                            />
                            <div className="flex flex-col items-center justify-center gap-1">
                                <Checkbox
                                    checked={row.isPublic}
                                    onCheckedChange={(checked) => updateRow(row.id, { isPublic: !!checked })}
                                    className="h-5 w-5 rounded-md border-[#E2E8F0]"
                                />
                                <span className="text-[9px] font-bold text-[#94A3B8] uppercase">Listed</span>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => removeRow(row.id)}
                                    disabled={rows.length === 1}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl text-[#94A3B8] hover:text-[#D92D20] hover:bg-red-50 transition-colors disabled:opacity-30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2E8F0] flex flex-col gap-4">
              <p className="text-[10px] font-medium text-[#94A3B8]">
                Amounts set the default lease amount; deposit defaults to 0.
              </p>
              <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="h-12 px-10 rounded-xl bg-[#1D6AE5] hover:bg-[#1656B9] text-white font-black text-sm shadow-lg shadow-[#1D6AE5]/20 flex gap-2"
                >
                    {isLoading ? (
                        <>Saving units...</>
                    ) : (
                        <>Save units <Check className="h-4 w-4" /></>
                    )}
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
