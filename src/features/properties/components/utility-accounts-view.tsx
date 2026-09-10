"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Upload, FileDown, Search, MoreHorizontal, Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddUtilityAccountDialog } from "./add-utility-account-dialog";

interface UtilityAccountsViewProps {
  properties: any[];
  utilityTypes: any[];
  initialMeters: any[];
}

export function UtilityAccountsView({ properties, utilityTypes, initialMeters }: UtilityAccountsViewProps) {
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="p-3 lg:p-6 space-y-4 bg-[#F5F7FA] min-h-screen font-sans animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-[#EBF5FF]/30 rounded-2xl p-6 border border-blue-50/50 flex flex-col lg:flex-row justify-between items-start gap-6 shadow-sm">
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#3B82F6]">PORTFOLIO UTILITIES</p>
          <h1 className="text-3xl font-black text-[#1F2937] tracking-tight">Utility Accounts</h1>
          <p className="text-[11px] font-medium text-[#667085] max-w-lg leading-relaxed">
            Catalogue every electricity and water account by property, track meters, and know which accounts are active at a glance.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-3">
             <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="h-8 px-5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[10px] font-black rounded-lg gap-2 shadow-sm border-none cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add account
                  </Button>
                </DialogTrigger>
                <AddUtilityAccountDialog properties={properties} />
             </Dialog>
             <Button className="h-8 px-5 bg-[#1e293b] hover:bg-[#0f172a] text-white text-[10px] font-black rounded-lg gap-2 shadow-sm border-none">
                <Upload className="h-3.5 w-3.5" />
                Import accounts
             </Button>
             <Button className="h-8 px-5 bg-[#1e293b] hover:bg-[#0f172a] text-white text-[10px] font-black rounded-lg gap-2 shadow-sm border-none">
                <FileDown className="h-3.5 w-3.5" />
                Download Excel
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
           {[
             { label: "ELECTRICITY", value: "0" },
             { label: "WATER", value: "0" },
             { label: "OTHER", value: "0" },
             { label: "IN USE", value: "0" },
             { label: "NOT IN USE", value: "0" },
             { label: "TERMINATED", value: "0" }
           ].map((stat, i) => (
             <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 px-4 min-w-[140px] shadow-sm flex flex-col justify-between h-[65px]">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#DCE3EA] p-3 shadow-sm flex flex-wrap items-end gap-3 px-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase ml-0.5">Property</label>
          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-44 bg-white border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
              <SelectValue placeholder="All properties" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-2xl border-slate-100">
              <SelectItem value="all" className="text-[10px] font-bold">All properties</SelectItem>
              {properties.map(p => (
                <SelectItem key={p.id} value={p.id} className="text-[10px] font-bold">{p.propertyName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase ml-0.5">Service</label>
          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-40 bg-white border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
              <SelectValue placeholder="All services" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-2xl border-slate-100">
              <SelectItem value="all" className="text-[10px] font-bold">All services</SelectItem>
              <SelectItem value="WATER" className="text-[10px] font-bold">Water</SelectItem>
              <SelectItem value="ELECTRICITY" className="text-[10px] font-bold">Electricity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase ml-0.5">Status</label>
          <Select defaultValue="in-use">
            <SelectTrigger className="h-8 w-40 bg-white border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
              <SelectValue placeholder="In use" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-2xl border-slate-100">
              <SelectItem value="in-use" className="text-[10px] font-bold">In use</SelectItem>
              <SelectItem value="not-in-use" className="text-[10px] font-bold">Not in use</SelectItem>
              <SelectItem value="terminated" className="text-[10px] font-bold">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-[9px] font-black text-slate-500 uppercase ml-0.5">Account, paybill, or meter</label>
          <Input
            placeholder="Search account, paybill, or meter"
            className="h-8 bg-white border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 placeholder:text-slate-300"
          />
        </div>

        <div className="flex gap-1.5">
           <Button className="h-8 px-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[10px] font-black rounded-lg gap-2 shadow-md border-none">
              Filter
           </Button>
           <Button variant="outline" className="h-8 px-6 bg-[#1e293b] hover:bg-[#0f172a] text-white text-[10px] font-black rounded-lg border-none">
              Clear
           </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-[#DCE3EA] shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-[#DCE3EA] h-10">
              <TableHead className="text-[9px] font-black text-[#98A2B3] uppercase px-4 w-12">#</TableHead>
              <TableHead className="text-[9px] font-black text-[#98A2B3] uppercase px-4">Service</TableHead>
              <TableHead className="text-[9px] font-black text-[#98A2B3] uppercase px-4">Account Number</TableHead>
              <TableHead className="text-[9px] font-black text-[#98A2B3] uppercase px-4">Property</TableHead>
              <TableHead className="text-[9px] font-black text-[#98A2B3] uppercase px-4">Status</TableHead>
              <TableHead className="text-[9px] font-black text-[#98A2B3] uppercase px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialMeters.length === 0 ? (
              <TableRow className="h-20 border-none">
                <TableCell colSpan={6} className="px-4 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No accounts configured yet</p>
                    <p className="text-[9px] font-medium text-slate-400 italic">Click + Add account to start cataloguing your meters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              initialMeters.map((m, index) => (
                <TableRow key={m.id} className="border-slate-100 h-10 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="px-4 text-[10px] font-bold text-slate-400">{index + 1}</TableCell>
                  <TableCell className="px-4 text-[10px] font-black text-slate-800">{m.utilityType?.name}</TableCell>
                  <TableCell className="px-4 text-[10px] font-black text-blue-600">{m.meterNumber}</TableCell>
                  <TableCell className="px-4 text-[10px] font-bold text-slate-700">{m.property?.propertyName}</TableCell>
                  <TableCell className="px-4">
                    <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                      Active
                    </span>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
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
