"use client"

import React from "react"
import {
  Search,
  ChevronDown,
  Filter,
  Send,
  ExternalLink,
  MessageCircle,
  Mail,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CommunicationLogsPage() {
  const filterTags = [
    "All Logs",
    "Rent Reminders",
    "Automated Triggers",
    "Needs Attention",
    "Failed",
    "Pending",
    "Lead Alerts",
    "Subscriptions"
  ]

  return (
    <div className="flex-1 space-y-4 p-4 lg:p-6 bg-[#F8FAFC]">
      {/* Logs Header & Filters Section */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 pb-4">
            <h1 className="text-xl font-black text-[#1F2937]">Logs</h1>
            <p className="text-[11px] font-medium text-[#667085] mt-0.5">4 matching communication logs</p>
          </div>

          <div className="px-6 pb-6 space-y-5">
            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-[10px] font-black text-[#475569] uppercase tracking-wider">SEARCH</label>
                <Input
                  placeholder="Recipient, message, or type"
                  className="h-10 text-[12px] border-[#E2E8F0] rounded-xl placeholder:text-[#94A3B8] focus:ring-[#2D60FF]/10 focus:border-[#2D60FF]"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-[#475569] uppercase tracking-wider">CHANNEL</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 text-[12px] border-[#E2E8F0] rounded-xl text-[#1E293B]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-[#475569] uppercase tracking-wider">STATUS</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 text-[12px] border-[#E2E8F0] rounded-xl text-[#1E293B]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1.5 space-y-1.5">
                <label className="text-[10px] font-black text-[#475569] uppercase tracking-wider">DATE</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 text-[12px] border-[#E2E8F0] rounded-xl text-[#1E293B]">
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1.5 flex gap-2 w-full">
                <Button className="bg-[#2D60FF] hover:bg-[#1A4BDE] text-white font-bold h-10 px-5 rounded-xl flex items-center gap-2 shadow-sm transition-all flex-1 text-[11px]">
                  <Search className="h-4 w-4" />
                  Apply
                </Button>
                <Button variant="outline" className="bg-[#1E293B] text-white hover:bg-[#0F172A] font-bold h-10 px-5 rounded-xl border-none transition-all text-[11px]">
                  Clear
                </Button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {filterTags.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className={`${
                    tag === "All Logs"
                    ? "bg-[#1E293B] text-white hover:bg-[#1E293B] border-none shadow-md"
                    : tag === "Pending"
                    ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]"
                    : "bg-white border-[#E2E8F0] text-[#475569] hover:bg-gray-50"
                  } rounded-full h-8 px-5 text-[11px] font-bold transition-all shadow-sm`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto relative">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="bg-[#F9FAFB] border-t border-[#F2F4F7]">
                  <TableRow className="border-[#F2F4F7] hover:bg-[#F9FAFB]">
                    <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10 pl-6">Delivery</TableHead>
                    <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10">Message</TableHead>
                    <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10">Created</TableHead>
                    <TableHead className="text-[10px] font-bold text-[#475467] uppercase tracking-wider h-10 text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-[#F2F4F7] group hover:bg-[#F8FAFC]">
                    <TableCell className="pl-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#F0FDF4] flex items-center justify-center border border-[#DCFCE7]">
                             <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                          </div>
                          <div>
                             <p className="text-[11px] font-black text-[#1E293B]">Delivered</p>
                             <p className="text-[10px] text-[#64748B]">via WhatsApp</p>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="max-w-[400px]">
                       <p className="text-[11px] font-medium text-[#475569] line-clamp-1">Your rent payment of KES 45,000 for July 2026 has been received.</p>
                    </TableCell>
                    <TableCell>
                       <p className="text-[10px] font-bold text-[#1E293B]">Jul 10, 2026</p>
                       <p className="text-[9px] text-[#64748B]">10:45 AM</p>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-gray-100">
                          <ExternalLink className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                  {/* Empty state if no data */}
                  <TableRow className="border-none">
                    <TableCell colSpan={4} className="h-40 text-center text-[11px] font-medium text-[#667085] italic">
                      No matching communication logs found.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Custom Horizontal Scroll Bar Mockup */}
            <div className="px-6 py-2 border-t border-[#F2F4F7] bg-[#F9FAFB]">
               <div className="h-1.5 w-full bg-[#EAECF0] rounded-full relative overflow-hidden">
                  <div className="absolute left-[30%] top-0 h-full w-1/4 bg-[#94A3B8] rounded-full"></div>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
