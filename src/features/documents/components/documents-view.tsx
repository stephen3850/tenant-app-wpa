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
import { MoreHorizontal, Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { UploadDocumentDialog } from "@/features/tenants/components/upload-document-dialog";

interface DocumentsViewProps {
  initialDocs: any[];
}

export function DocumentsView({ initialDocs }: DocumentsViewProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Mini Header */}
      <div className="flex justify-between items-end px-1">
        <div className="space-y-0.5">
          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">REPOSITORY</p>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Documents</h1>
          <p className="text-[9px] text-slate-500 font-bold italic pt-0.5">Manage all uploaded records.</p>
        </div>
        <div className="text-right">
          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">TOTAL RECORDS</p>
          <p className="text-3xl font-black text-slate-900 leading-none">{initialDocs.length}</p>
        </div>
      </div>

      {/* Renewal Alert - Micro */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-2 border-b border-slate-50 bg-slate-50/20">
           <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">DOCUMENTS - SINGLE VIEW</p>
           <h2 className="text-[10px] font-black text-slate-800">Lease Renewal Dates</h2>
        </div>
        <div className="p-2">
           <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-md p-2 flex justify-between items-center shadow-sm">
              <span className="text-[9px] font-black text-[#92400E] uppercase">Missing Renewal Dates</span>
              <span className="text-lg font-black text-[#92400E]">0</span>
           </div>
        </div>
      </div>

      {/* Filter Row - High Density */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
        <div className="space-y-0.5">
          <label className="text-[7px] font-black text-slate-400 uppercase ml-0.5">Category</label>
          <Select defaultValue="all">
            <SelectTrigger className="h-6 rounded border-slate-100 text-[8px] font-bold">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-[8px] font-bold">All</SelectItem>
              <SelectItem value="LEASE" className="text-[8px] font-bold">Lease</SelectItem>
              <SelectItem value="RECEIPT" className="text-[8px] font-bold">Receipt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-0.5">
          <label className="text-[7px] font-black text-slate-400 uppercase ml-0.5">Linked To</label>
          <Select defaultValue="any">
            <SelectTrigger className="h-6 rounded border-slate-100 text-[8px] font-bold">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any" className="text-[8px] font-bold">Any</SelectItem>
              <SelectItem value="tenant" className="text-[8px] font-bold">Tenant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-0.5">
          <label className="text-[7px] font-black text-slate-400 uppercase ml-0.5">Record</label>
          <Input placeholder="Record..." className="h-6 rounded border-slate-100 text-[8px] font-bold" />
        </div>
        <div className="space-y-0.5">
          <label className="text-[7px] font-black text-slate-400 uppercase ml-0.5">Search</label>
          <Input placeholder="Search file..." className="h-6 rounded border-slate-100 text-[8px] font-bold" />
        </div>
        <div className="flex gap-1 col-span-2">
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black h-6 text-[8px] uppercase">
            Apply Filters
          </Button>
          <Button variant="outline" size="sm" className="bg-slate-800 hover:bg-slate-900 text-white border-none h-6 px-3 text-[8px] font-black uppercase">
            Reset
          </Button>
        </div>
      </div>

      {/* Action Micro Row */}
      <div className="flex justify-end px-1">
        <Button
          onClick={() => setIsUploadOpen(true)}
          size="sm"
          className="bg-[#4175FF] hover:bg-[#3562D9] text-white font-black h-6 px-3 rounded text-[8px] uppercase gap-1 shadow-md shadow-blue-100"
        >
          <Plus className="h-2.5 w-2.5" />
          Upload
        </Button>
      </div>

      {/* Main Table - Nano Rows */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#0F172A]">
              <TableRow className="hover:bg-transparent border-none h-8">
                <TableHead className="text-white font-black text-[7px] uppercase px-4 whitespace-nowrap">Category</TableHead>
                <TableHead className="text-white font-black text-[7px] uppercase px-4 whitespace-nowrap">File Name</TableHead>
                <TableHead className="text-white font-black text-[7px] uppercase px-4 whitespace-nowrap">ID Num</TableHead>
                <TableHead className="text-white font-black text-[7px] uppercase px-4 whitespace-nowrap">Linked To</TableHead>
                <TableHead className="text-white font-black text-[7px] uppercase px-4 whitespace-nowrap">Property</TableHead>
                <TableHead className="text-white font-black text-[7px] uppercase px-4 whitespace-nowrap">Next Review</TableHead>
                <TableHead className="text-white font-black text-[7px] uppercase px-4 whitespace-nowrap">Uploaded</TableHead>
                <TableHead className="text-white font-black text-[7px] uppercase px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Empty Repository</p>
                  </TableCell>
                </TableRow>
              ) : (
                initialDocs.map((doc: any) => (
                  <TableRow key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors h-8">
                    <TableCell className="px-4">
                      <span className="text-[7px] font-black text-slate-500 px-1.5 py-0.5 bg-slate-100 rounded uppercase">
                        {doc.category}
                      </span>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-2.5 w-2.5 text-blue-400" />
                        <span className="text-[9px] font-black text-slate-900 truncate max-w-[120px] hover:underline cursor-pointer">
                          {doc.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 text-[8px] font-bold text-slate-400">
                      {doc.idNumber}
                    </TableCell>
                    <TableCell className="px-4 text-[9px] font-black text-slate-700">
                      {doc.linkedTo}
                    </TableCell>
                    <TableCell className="px-4 text-[8px] font-bold text-slate-400">
                      {doc.property}
                    </TableCell>
                    <TableCell className="px-4 text-[8px] font-bold text-slate-400">
                      {doc.nextReview ? format(new Date(doc.nextReview), "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell className="px-4 text-[8px] font-bold text-slate-400">
                      {format(new Date(doc.uploaded), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-300 hover:text-slate-600">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <UploadDocumentDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        tenant={null}
      />
    </div>
  );
}
