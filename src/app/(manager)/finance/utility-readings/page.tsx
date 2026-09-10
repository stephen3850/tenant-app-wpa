"use client"

import React from "react"
import {
  Zap,
  Droplets,
  Layers,
  Plus,
  FileUp,
  FileDown,
  FileText,
  Filter,
  Search,
  ChevronRight,
  Calculator,
  Calendar,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UtilityReadingsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#56A600]">Utilities</h3>
          <h1 className="text-2xl font-black text-[#1F2937]">Utility Readings</h1>
          <p className="text-sm text-[#667085]">Browse and record readings with account-aware helpers and clean imports.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-10 px-4 rounded-lg flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Reading
          </Button>
          <Button variant="outline" className="border-[#DCE3EA] text-[#1F2937] font-bold h-10 px-4 rounded-lg flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Import Excel
          </Button>
          <Button variant="outline" className="border-[#DCE3EA] text-[#1F2937] font-bold h-10 px-4 rounded-lg flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="border-[#DCE3EA] text-[#1F2937] font-bold h-10 px-4 rounded-lg flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Import Payments
          </Button>
          <Button variant="outline" className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-bold h-10 px-4 rounded-lg flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Invoices
          </Button>
          <Badge className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] font-bold py-1 px-3">
            Total 0
          </Badge>
        </div>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">ALL SERVICES</p>
              <h2 className="text-2xl font-black text-[#1F2937] mt-1">0</h2>
              <p className="text-[10px] text-[#667085] mt-1">Recorded entries.</p>
            </div>
            <div className="mt-4">
              <Badge className="bg-[#3B82F6] hover:bg-[#3B82F6] text-white font-bold px-3 py-0.5 rounded text-[10px]">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">ELECTRICITY</p>
              <h2 className="text-2xl font-black text-[#1F2937] mt-1">0</h2>
              <p className="text-[10px] text-[#667085] mt-1">Recorded entries.</p>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="h-6 text-[10px] font-bold text-white bg-[#F97316] border-[#F97316] hover:bg-[#EA580C] px-3">View</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">WATER</p>
              <h2 className="text-2xl font-black text-[#1F2937] mt-1">0</h2>
              <p className="text-[10px] text-[#667085] mt-1">Recorded entries.</p>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="h-6 text-[10px] font-bold text-white bg-[#0EA5E9] border-[#0EA5E9] hover:bg-[#0284C7] px-3">View</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">OTHER</p>
              <h2 className="text-2xl font-black text-[#1F2937] mt-1">0</h2>
              <p className="text-[10px] text-[#667085] mt-1">Recorded entries.</p>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="h-6 text-[10px] font-bold text-white bg-[#334155] border-[#334155] hover:bg-[#1E293B] px-3">View</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workbook Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F1F5F9]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">METER WORKBOOK MODE</p>
              <h2 className="text-xl font-black text-[#1F2937]">Utility readings workbook</h2>
              <p className="text-xs text-[#667085] mt-1">Review the same reading, consumption, rate, amount, and invoice status columns users check in meter workbooks.</p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-bold rounded-full text-xs px-5">Utility payments</Button>
               <Button variant="outline" className="border-[#F97316] text-[#F97316] hover:bg-orange-50 font-bold rounded-full text-xs px-5">Utility bills</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#F1F5F9]">
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">FILTERED ROWS</p>
              <h3 className="text-lg font-black text-[#1F2937] mt-1">0</h3>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#F1F5F9]">
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">PAGE CONSUMPTION</p>
              <h3 className="text-lg font-black text-[#1F2937] mt-1">0.00</h3>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#F1F5F9]">
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">PAGE AMOUNT</p>
              <h3 className="text-lg font-black text-[#56A600] mt-1">KES 0.00</h3>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#F1F5F9]">
              <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">PAGE INVOICED</p>
              <h3 className="text-lg font-black text-[#1F2937] mt-1">0 / 0</h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-12 mt-8">
             <div>
                <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-2">ACTIVE FILTERS</p>
                <Badge className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-1 px-4 rounded-full text-[10px]">All visible records</Badge>
             </div>
             <div>
                <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1">WORKBOOK CHECK</p>
                <p className="text-[10px] text-[#667085] max-w-[300px]">Consumption = current reading - previous reading. Amount = consumption x rate unless the imported workbook provides an amount.</p>
             </div>
             <div>
                <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1">RECONCILE BEFORE EXPORT</p>
                <p className="text-[10px] text-[#667085] max-w-[300px]">Use account number or meter number when matching imported Electricity workbooks. Open uninvoiced rows before generating bills for the month.</p>
             </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 bg-white border-b border-[#F1F5F9]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">TENANT</label>
              <Input placeholder="Search tenant" className="h-10 text-xs border-[#DCE3EA]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">UNIT (EXACT)</label>
              <Input placeholder="Exact unit name" className="h-10 text-xs border-[#DCE3EA]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">SERVICE</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 text-xs border-[#DCE3EA]">
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
              <label className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">PROPERTY</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 text-xs border-[#DCE3EA]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">UTILITY ACCOUNT</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 text-xs border-[#DCE3EA]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">BILL MONTH</label>
              <div className="relative">
                <Input type="month" className="h-10 text-xs border-[#DCE3EA] pr-10" />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-[#667085]" />
              </div>
            </div>
            <div className="flex items-end">
              <Button className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-10 px-8 rounded-lg flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="border-[#F1F5F9]">
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase w-[50px]">#</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase">Date</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase">Tenant</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase">Unit</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase">Unit name</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase">Service</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase text-right">Prev</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase text-right">Current</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase text-right">Consumption</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase">Account</TableHead>
                <TableHead className="text-[10px] font-bold text-[#667085] uppercase text-right">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center text-xs text-[#667085]">
                  No utility readings found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
