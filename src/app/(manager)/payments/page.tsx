"use client"

import React from "react"
import {
  Plus,
  FileUp,
  FileDown,
  FileText,
  Filter,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RefreshCcw,
  BarChart3,
  CreditCard,
  Settings2,
  Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PaymentsPage() {
  const months = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className="flex-1 space-y-4 p-4 lg:p-6 bg-[#F8FAFC]">
      {/* 1. Header Card */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#56A600]">Receivables</h3>
            <h1 className="text-xl font-black tracking-tight text-[#1F2937]">Payments</h1>
            <p className="text-[11px] font-medium text-[#667085]">
              Filter and audit every payment with export-ready tables.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="border-[#F97316] text-[#F97316] hover:bg-orange-50 font-bold h-8 px-4 rounded-lg flex items-center gap-2 text-[11px]">
               <RefreshCcw className="h-3.5 w-3.5" />
               Find matches
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-[#D0D5DD] text-[#344054] font-bold h-8 px-4 rounded-lg flex items-center gap-2 shadow-sm text-[11px]">
               <BarChart3 className="h-3.5 w-3.5" />
               Payment report
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-[#D0D5DD] text-[#344054] font-bold h-8 px-4 rounded-lg flex items-center gap-2 shadow-sm text-[11px]">
               <FileDown className="h-3.5 w-3.5" />
               Export Excel
            </Button>
            <Button size="sm" className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-8 px-4 rounded-lg flex items-center gap-2 shadow-sm border-none text-[11px]">
               <FileUp className="h-3.5 w-3.5" />
               Import (CSV / Excel)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Payments */}
        <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl">
          <CardContent className="p-4">
            <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">TOTAL PAYMENTS TODAY</p>
            <h2 className="text-xl font-black text-[#1E293B] mt-0.5">KES 0.00</h2>
            <p className="text-[10px] text-[#94A3B8]">Fri, Jul 10, 2026</p>
            <div className="flex gap-2 mt-3">
               <Badge className="bg-[#56A600] hover:bg-[#56A600] text-white text-[9px] px-2 py-0.5 rounded-full font-bold border-none">Rent: KES 0.00</Badge>
               <Badge className="bg-[#F97316] hover:bg-[#F97316] text-white text-[9px] px-2 py-0.5 rounded-full font-bold border-none">Deposit: KES 0.00</Badge>
               <Badge className="bg-[#1E293B] hover:bg-[#1E293B] text-white text-[9px] px-2 py-0.5 rounded-full font-bold border-none">Other: KES 0.00</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Month's Payments */}
        <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl">
          <CardContent className="p-4">
            <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">TOTAL PAYMENTS THIS MONTH</p>
            <h2 className="text-xl font-black text-[#1E293B] mt-0.5">KES 0.00</h2>
            <p className="text-[10px] text-[#94A3B8]">Jul 2026</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Breakdown Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E2E8F0] border border-[#E2E8F0] rounded-sm overflow-hidden shadow-sm">
        <div className="bg-white p-4">
           <p className="text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider">TOTAL RENT</p>
           <h3 className="text-lg font-bold text-[#1E293B] mt-0.5">KES 0.00</h3>
           <p className="text-[9px] text-[#94A3B8]">Based on current filters</p>
        </div>
        <div className="bg-white p-4">
           <p className="text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider">TOTAL DEPOSITS</p>
           <h3 className="text-lg font-bold text-[#1E293B] mt-0.5">KES 0.00</h3>
           <p className="text-[9px] text-[#94A3B8]">Based on current filters</p>
        </div>
        <div className="bg-white p-4">
           <p className="text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider">TOTAL OTHER</p>
           <h3 className="text-lg font-bold text-[#1E293B] mt-0.5">KES 0.00</h3>
           <p className="text-[9px] text-[#94A3B8]">Based on current filters</p>
        </div>
      </div>

      {/* 4. Secondary Nav Card */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-3 px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
             <Button variant="outline" size="sm" className="bg-white border-[#E2E8F0] text-[#1E293B] font-bold rounded-full h-8 px-5 text-[10px] hover:bg-gray-50">Credit Notes</Button>
             <Button variant="outline" size="sm" className="bg-white border-[#E2E8F0] text-[#1E293B] font-bold rounded-full h-8 px-5 text-[10px] hover:bg-gray-50">Opening Balances</Button>
             <Button variant="outline" size="sm" className="bg-white border-[#E2E8F0] text-[#1E293B] font-bold rounded-full h-8 px-5 text-[10px] hover:bg-gray-50">Bad Debts</Button>
             <Button variant="outline" size="sm" className="bg-white border-[#E2E8F0] text-[#1E293B] font-bold rounded-full h-8 px-5 text-[10px] hover:bg-gray-50">Deposits</Button>
             <Button variant="outline" size="sm" className="bg-white border-[#E2E8F0] text-[#1E293B] font-bold rounded-full h-8 px-5 text-[10px] hover:bg-gray-50">Refunds</Button>
          </div>
          <Button size="sm" className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-8 px-6 rounded-full flex items-center gap-2 shadow-sm text-[10px]">
            <Wallet className="h-3.5 w-3.5 fill-white" />
            Go to Deposits
          </Button>
        </CardContent>
      </Card>

      {/* 5. Filters Card */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">PROPERTY</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-xl">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">SEARCH</label>
              <Input placeholder="Name, narration, confirmation" className="h-8 text-[11px] border-[#E2E8F0] rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">UNIT</label>
              <Input placeholder="e.g. 71" className="h-8 text-[11px] border-[#E2E8F0] rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">TYPE</label>
              <Select defaultValue="rent">
                <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-xl">
                  <SelectValue placeholder="Rent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">SERVICE</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-xl">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">BANK</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-xl">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">START</label>
              <div className="relative">
                <Input type="text" placeholder="mm/dd/yyyy" className="h-8 text-[11px] border-[#E2E8F0] rounded-xl pr-8" />
                <Calendar className="absolute right-2 top-2 h-3.5 w-3.5 text-[#475569]" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">END</label>
              <div className="relative">
                <Input type="text" placeholder="mm/dd/yyyy" className="h-8 text-[11px] border-[#E2E8F0] rounded-xl pr-8" />
                <Calendar className="absolute right-2 top-2 h-3.5 w-3.5 text-[#475569]" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">STATUS</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-[11px] border-[#E2E8F0] rounded-xl">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button size="sm" className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-8 px-6 rounded-lg flex items-center gap-2 w-full sm:w-auto text-[11px]">
                <Filter className="h-3.5 w-3.5 fill-white" />
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Info Banner */}
      <div className="bg-[#0EA5E9] text-white px-4 py-2 rounded-lg flex items-center justify-between shadow-sm">
        <p className="text-[10px] font-bold">Showing payments created in July 2026 by default. <span className="underline cursor-pointer ml-1 font-black">Clear default filters</span></p>
      </div>

      {/* 7. Month Selector */}
      <div className="space-y-2">
         <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest ml-1">MONTH</p>
         <div className="flex flex-wrap gap-1.5">
            {months.map(month => (
               <Button
                  key={month}
                  variant={month === "All" ? "default" : "outline"}
                  className={month === "All"
                    ? "bg-[#56A600] hover:bg-[#4a8e00] text-white rounded-full px-4 h-7 text-[10px] font-bold border-none"
                    : "bg-white border-[#E2E8F0] text-[#475569] hover:bg-gray-50 rounded-full px-4 h-7 text-[10px] font-bold"
                  }
               >
                  {month}
               </Button>
            ))}
         </div>
      </div>

      {/* 8. Table Section */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-3 px-4 border-b border-[#F2F4F7] flex items-center justify-between bg-white">
            <div>
              <h3 className="text-[13px] font-bold text-[#1E293B]">Payment records</h3>
              <p className="text-[9px] text-[#64748B]">Choose which columns appear in this table.</p>
            </div>
            <Button variant="outline" size="sm" className="h-7 border-[#D0D5DD] rounded-lg text-[10px] font-bold flex items-center gap-1.5">
               Columns <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          <div className="overflow-x-auto relative">
            <div className="min-w-[1200px]">
              <Table>
                <TableHeader className="bg-[#F9FAFB]">
                  <TableRow className="border-[#F2F4F7] hover:bg-[#F9FAFB]">
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 w-[40px] pl-4">#</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Date</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Reference</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Name</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Unit</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Narration</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Status</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 text-right">Amount</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8">Service</TableHead>
                    <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-8 text-right pr-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-none">
                    <TableCell colSpan={10} className="h-24 text-center text-[10px] font-medium text-[#667085] italic">
                      No payments imported yet.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Custom Horizontal Scroll Bar Mockup */}
            <div className="px-4 py-1.5 border-t border-[#F2F4F7] bg-white flex items-center justify-between">
               <ChevronLeft className="h-3 w-3 text-[#94A3B8]" />
               <div className="flex-1 mx-4 h-1 bg-[#F1F5F9] rounded-full relative">
                  <div className="absolute left-[20%] top-0 h-full w-[60%] bg-[#94A3B8] rounded-full"></div>
               </div>
               <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacer */}
      <div className="h-4"></div>
    </div>
  )
}
