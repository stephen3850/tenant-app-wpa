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
  Settings2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UtilityReadingsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#56A600]">Utilities</h3>
          <h1 className="text-2xl font-black tracking-tight text-[#1F2937] mt-1">Utility Readings</h1>
          <p className="text-sm font-medium text-[#667085] mt-1">
            Browse and record readings with account-aware helpers and clean imports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-10 px-4 rounded-lg flex items-center gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Add Reading
          </Button>
          <Button variant="outline" className="bg-white border-[#D0D5DD] text-[#344054] font-bold h-10 px-4 rounded-lg flex items-center gap-2 shadow-sm">
            <FileUp className="h-4 w-4" />
            Import Excel
          </Button>
          <Button variant="outline" className="bg-white border-[#D0D5DD] text-[#344054] font-bold h-10 px-4 rounded-lg flex items-center gap-2 shadow-sm">
            <FileDown className="h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="bg-white border-[#D0D5DD] text-[#344054] font-bold h-10 px-4 rounded-lg flex items-center gap-2 shadow-sm">
            <FileUp className="h-4 w-4" />
            Import Payments
          </Button>
          <Button variant="outline" className="bg-white border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-bold h-10 px-4 rounded-lg flex items-center gap-2 shadow-sm">
            <FileText className="h-4 w-4 text-[#2563EB]" />
            Generate Invoices
          </Button>
          <Badge variant="secondary" className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] font-bold py-1.5 px-3 rounded-md border-none">
            Total 0
          </Badge>
        </div>
      </div>

      {/* Service Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4 flex flex-col justify-between h-[120px]">
            <div>
              <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest">ALL SERVICES</p>
              <h2 className="text-3xl font-black text-[#1F2937] mt-1">0</h2>
              <p className="text-[11px] font-medium text-[#667085] mt-1">Recorded entries.</p>
            </div>
            <div className="flex justify-end">
              <Badge className="bg-[#2D60FF] hover:bg-[#2D60FF] text-white font-bold px-3 py-1 rounded text-[10px] uppercase">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4 flex flex-col justify-between h-[120px]">
            <div>
              <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest">ELECTRICITY</p>
              <h2 className="text-3xl font-black text-[#1F2937] mt-1">0</h2>
              <p className="text-[11px] font-medium text-[#667085] mt-1">Recorded entries.</p>
            </div>
            <div className="flex justify-end">
              <Button size="sm" className="h-7 text-[10px] font-bold text-white bg-[#F97316] hover:bg-[#EA580C] px-4 rounded shadow-sm border-none">View</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4 flex flex-col justify-between h-[120px]">
            <div>
              <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest">WATER</p>
              <h2 className="text-3xl font-black text-[#1F2937] mt-1">0</h2>
              <p className="text-[11px] font-medium text-[#667085] mt-1">Recorded entries.</p>
            </div>
            <div className="flex justify-end">
              <Button size="sm" className="h-7 text-[10px] font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] px-4 rounded shadow-sm border-none">View</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4 flex flex-col justify-between h-[120px]">
            <div>
              <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest">OTHER</p>
              <h2 className="text-3xl font-black text-[#1F2937] mt-1">0</h2>
              <p className="text-[11px] font-medium text-[#667085] mt-1">Recorded entries.</p>
            </div>
            <div className="flex justify-end">
              <Button size="sm" className="h-7 text-[10px] font-bold text-white bg-[#344054] hover:bg-[#1D2939] px-4 rounded shadow-sm border-none">View</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meter Workbook Mode Section */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-[#F2F4F7]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest">METER WORKBOOK MODE</p>
                <h2 className="text-xl font-black text-[#1F2937] mt-1">Utility readings workbook</h2>
                <p className="text-xs font-medium text-[#667085] mt-1">
                  Review the same reading, consumption, rate, amount, and invoice status columns users check in meter workbooks.
                </p>
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-bold rounded-full text-xs h-9 px-5 shadow-sm">Utility payments</Button>
                 <Button variant="outline" className="border-[#F97316] text-[#F97316] hover:bg-orange-50 font-bold rounded-full text-xs h-9 px-5 shadow-sm">Utility bills</Button>
              </div>
            </div>

            {/* Workbook Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-[#F9FAFB] p-5 rounded-xl border border-[#F2F4F7]">
                <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-[0.1em]">FILTERED ROWS</p>
                <h3 className="text-xl font-black text-[#1F2937] mt-1">0</h3>
              </div>
              <div className="bg-[#F9FAFB] p-5 rounded-xl border border-[#F2F4F7]">
                <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-[0.1em]">PAGE CONSUMPTION</p>
                <h3 className="text-xl font-black text-[#1F2937] mt-1">0.00</h3>
              </div>
              <div className="bg-[#F9FAFB] p-5 rounded-xl border border-[#F2F4F7]">
                <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-[0.1em]">PAGE AMOUNT</p>
                <h3 className="text-xl font-black text-[#56A600] mt-1">KES 0.00</h3>
              </div>
              <div className="bg-[#F9FAFB] p-5 rounded-xl border border-[#F2F4F7]">
                <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-[0.1em]">PAGE INVOICED</p>
                <h3 className="text-xl font-black text-[#1F2937] mt-1">0 / 0</h3>
              </div>
            </div>

            {/* Helpers Section */}
            <div className="flex flex-wrap gap-12 mt-8">
               <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[#1F2937] uppercase tracking-widest">ACTIVE FILTERS</p>
                  <Badge className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-1.5 px-4 rounded-full text-[11px] border-none shadow-sm">
                    All visible records
                  </Badge>
               </div>
               <div className="max-w-[280px]">
                  <p className="text-[10px] font-bold text-[#1F2937] uppercase tracking-widest mb-1.5">WORKBOOK CHECK</p>
                  <p className="text-[10px] font-medium leading-relaxed text-[#667085]">
                    Consumption = current reading - previous reading. Amount = consumption x rate unless the imported workbook provides an amount.
                  </p>
               </div>
               <div className="max-w-[340px]">
                  <p className="text-[10px] font-bold text-[#1F2937] uppercase tracking-widest mb-1.5">RECONCILE BEFORE EXPORT</p>
                  <p className="text-[10px] font-medium leading-relaxed text-[#667085]">
                    Use account number or meter number when matching imported Electricity workbooks. Open uninvoiced rows before generating bills for the month.
                  </p>
               </div>
            </div>
          </div>

          {/* Filters Form */}
          <div className="p-6 bg-white border-b border-[#F2F4F7]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#344054] uppercase tracking-wider">TENANT</label>
                <Input placeholder="Search tenant" className="h-10 text-xs border-[#D0D5DD] focus:ring-[#56A600]/20 rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#344054] uppercase tracking-wider">UNIT (EXACT)</label>
                <Input placeholder="Exact unit name" className="h-10 text-xs border-[#D0D5DD] focus:ring-[#56A600]/20 rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#344054] uppercase tracking-wider">SERVICE</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 text-xs border-[#D0D5DD] rounded-lg">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#344054] uppercase tracking-wider">PROPERTY</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 text-xs border-[#D0D5DD] rounded-lg">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#344054] uppercase tracking-wider">UTILITY ACCOUNT</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 text-xs border-[#D0D5DD] rounded-lg">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#344054] uppercase tracking-wider">BILL MONTH</label>
                <div className="relative">
                  <Input type="month" className="h-10 text-xs border-[#D0D5DD] rounded-lg pr-10" />
                  <Calendar className="absolute right-3 top-2.5 h-4.5 w-4.5 text-[#98A2B3]" />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-10 px-8 rounded-lg flex items-center gap-2 shadow-sm w-full sm:w-auto">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto relative">
            <Table>
              <TableHeader className="bg-[#F9FAFB]">
                <TableRow className="border-[#F2F4F7] hover:bg-[#F9FAFB]">
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10 w-[50px] pl-6">#</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10">Date</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10">Tenant</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10">Unit</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10">Unit name</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10">Service</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10 text-right">Prev</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10 text-right">Current</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10 text-right">Consumption</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10">Account</TableHead>
                  <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10 text-right pr-6">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-none">
                  <TableCell colSpan={11} className="h-32 text-center text-xs font-medium text-[#667085] italic">
                    No utility readings found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Horizontal Scroll Bar Mockup */}
            <div className="px-6 py-2 border-t border-[#F2F4F7] bg-[#F9FAFB]">
               <div className="h-1.5 w-full bg-[#EAECF0] rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-1/3 bg-[#98A2B3] rounded-full"></div>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
