"use client"

import React from "react"
import {
  Zap,
  Plus,
  FileUp,
  FileDown,
  FileText,
  Filter,
  Calendar,
  ChevronDown,
  LayoutGrid,
  Settings2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UtilityReadingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 lg:p-6 bg-[#F8FAFC]">
      {/* Page Header Container */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#56A600]">Utilities</h3>
            <h1 className="text-xl font-black tracking-tight text-[#1F2937] mt-0.5">Utility Readings</h1>
            <p className="text-[11px] font-medium text-[#667085] mt-0.5">
              Browse and record readings with account-aware helpers and clean imports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button size="sm" className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-8 px-3 rounded-lg flex items-center gap-1.5 shadow-sm border-none text-[11px]">
              <Plus className="h-3.5 w-3.5" />
              Add Reading
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-[#D0D5DD] text-[#344054] font-bold h-8 px-3 rounded-lg flex items-center gap-1.5 shadow-sm text-[11px]">
              <FileUp className="h-3.5 w-3.5" />
              Import Excel
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-[#D0D5DD] text-[#344054] font-bold h-8 px-3 rounded-lg flex items-center gap-1.5 shadow-sm text-[11px]">
              <FileDown className="h-3.5 w-3.5" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-[#D0D5DD] text-[#344054] font-bold h-8 px-3 rounded-lg flex items-center gap-1.5 shadow-sm text-[11px]">
              <FileUp className="h-3.5 w-3.5" />
              Import Payments
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-bold h-8 px-3 rounded-lg flex items-center gap-1.5 shadow-sm text-[11px]">
              <FileText className="h-3.5 w-3.5" />
              Generate Invoices
            </Button>
            <Badge variant="secondary" className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] font-bold py-1 px-2.5 rounded-md border-none text-[10px]">
              Total 0
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Service Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0] rounded-sm overflow-hidden shadow-sm">
        {/* ALL SERVICES */}
        <div className="bg-white p-4 flex items-center justify-between">
          <div className="space-y-0">
            <p className="text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider">ALL SERVICES</p>
            <h2 className="text-2xl font-bold text-[#1E293B]">0</h2>
            <p className="text-[10px] text-[#94A3B8]">Recorded entries.</p>
          </div>
          <Badge className="bg-[#3B82F6] hover:bg-[#3B82F6] text-white text-[9px] px-2 py-0.5 rounded-md font-bold border-none">Active</Badge>
        </div>

        {/* ELECTRICITY */}
        <div className="bg-white p-4 flex items-center justify-between">
          <div className="space-y-0">
            <p className="text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider">ELECTRICITY</p>
            <h2 className="text-2xl font-bold text-[#1E293B]">0</h2>
            <p className="text-[10px] text-[#94A3B8]">Recorded entries.</p>
          </div>
          <Button size="sm" className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[9px] h-6 px-3 rounded-md font-bold border-none shadow-none">View</Button>
        </div>

        {/* WATER */}
        <div className="bg-white p-4 flex items-center justify-between">
          <div className="space-y-0">
            <p className="text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider">WATER</p>
            <h2 className="text-2xl font-bold text-[#1E293B]">0</h2>
            <p className="text-[10px] text-[#94A3B8]">Recorded entries.</p>
          </div>
          <Button size="sm" className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[9px] h-6 px-3 rounded-md font-bold border-none shadow-none">View</Button>
        </div>

        {/* OTHER */}
        <div className="bg-white p-4 flex items-center justify-between">
          <div className="space-y-0">
            <p className="text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider">OTHER</p>
            <h2 className="text-2xl font-bold text-[#1E293B]">0</h2>
            <p className="text-[10px] text-[#94A3B8]">Recorded entries.</p>
          </div>
          <Button size="sm" className="bg-[#1E293B] hover:bg-[#0F172A] text-white text-[9px] h-6 px-3 rounded-md font-bold border-none shadow-none">View</Button>
        </div>
      </div>

      {/* Meter Workbook Mode Card */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">METER WORKBOOK MODE</p>
              <h2 className="text-lg font-black text-[#1E293B] mt-0.5">Utility readings workbook</h2>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Review the same reading, consumption, rate, amount, and invoice status columns users check in meter workbooks.
              </p>
            </div>
            <div className="flex gap-1.5">
               <Button variant="outline" className="border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50 font-bold rounded-full text-[10px] h-8 px-4 shadow-none">Utility payments</Button>
               <Button variant="outline" className="border-[#F97316] text-[#F97316] hover:bg-orange-50 font-bold rounded-full text-[10px] h-8 px-4 shadow-none">Utility bills</Button>
            </div>
          </div>

          {/* Workbook Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
              <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">FILTERED ROWS</p>
              <h3 className="text-base font-bold text-[#1E293B] mt-0.5">0</h3>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
              <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">PAGE CONSUMPTION</p>
              <h3 className="text-base font-bold text-[#1E293B] mt-0.5">0.00</h3>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
              <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">PAGE AMOUNT</p>
              <h3 className="text-base font-bold text-[#22C55E] mt-0.5">KES 0.00</h3>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
              <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">PAGE INVOICED</p>
              <h3 className="text-base font-bold text-[#1E293B] mt-0.5">0 / 0</h3>
            </div>
          </div>

          {/* Card Footer - Helpers */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mt-6 pt-1">
             <div className="space-y-1.5">
                <p className="text-[9px] font-bold text-[#475569] uppercase tracking-wider">ACTIVE FILTERS</p>
                <Badge className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-0.5 px-2.5 rounded-full text-[9px] border-none">
                  All visible records
                </Badge>
             </div>
             <div className="max-w-[250px] space-y-1">
                <p className="text-[9px] font-bold text-[#475569] uppercase tracking-wider">WORKBOOK CHECK</p>
                <p className="text-[9px] leading-relaxed text-[#64748B]">
                  Consumption = current reading - previous reading. Amount = consumption x rate unless the imported workbook provides an amount.
                </p>
             </div>
             <div className="max-w-[300px] space-y-1">
                <p className="text-[9px] font-bold text-[#475569] uppercase tracking-wider">RECONCILE BEFORE EXPORT</p>
                <p className="text-[9px] leading-relaxed text-[#64748B]">
                  Use account number or meter number when matching imported Electricity workbooks. Open uninvoiced rows before generating bills for the month.
                </p>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Container */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">TENANT</label>
              <Input placeholder="Search tenant" className="h-8 text-[11px] border-[#E2E8F0] rounded-xl placeholder:text-[#94A3B8]" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">UNIT (EXACT)</label>
              <Input placeholder="Exact unit name" className="h-8 text-[11px] border-[#E2E8F0] rounded-xl placeholder:text-[#94A3B8]" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">SERVICE</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-xl text-[#1E293B]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">PROPERTY</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-xl text-[#1E293B]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">UTILITY ACCOUNT</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-xl text-[#1E293B]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">BILL MONTH</label>
              <div className="relative">
                <Input type="text" placeholder="---------- ----" className="h-8 text-[11px] border-[#E2E8F0] rounded-xl pr-8 text-[#1E293B]" />
                <Calendar className="absolute right-2.5 top-2 h-3.5 w-3.5 text-[#475569]" />
              </div>
            </div>
            <div className="flex items-end">
              <Button size="sm" className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-8 px-6 rounded-full flex items-center gap-1.5 shadow-sm text-[11px]">
                <Filter className="h-3 w-3 fill-white" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table Container */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto relative">
            <div className="min-w-[1400px]">
              <Table>
                <TableHeader className="bg-[#F9FAFB]">
                  <TableRow className="border-[#F2F4F7] hover:bg-[#F9FAFB]">
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 w-[40px] pl-4">#</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Date</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Tenant</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Unit</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Unit name</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Service</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 text-right">Prev</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 text-right">Current</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 text-right">Consumption</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Account</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 text-right">Rate</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 text-right">Amount</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Note</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 text-right pr-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-none">
                    <TableCell colSpan={14} className="h-24 text-center text-[11px] font-medium text-[#667085] italic">
                      No utility readings found.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Custom Horizontal Scroll Bar Mockup */}
            <div className="px-4 py-1.5 border-t border-[#F2F4F7] bg-white flex items-center justify-between">
               <ChevronLeft className="h-3 w-3 text-[#94A3B8]" />
               <div className="flex-1 mx-4 h-1.5 bg-[#F1F5F9] rounded-full relative">
                  <div className="absolute left-[20%] top-0 h-full w-[60%] bg-[#94A3B8] rounded-full"></div>
               </div>
               <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacer for bottom */}
      <div className="h-4"></div>
    </div>
  )
}
