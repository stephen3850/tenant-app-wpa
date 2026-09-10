"use client"

import React from "react"
import {
  MessageSquare,
  Mail,
  Bell,
  Megaphone,
  FileText,
  Settings,
  Plus,
  Send,
  Search,
  ChevronDown,
  Filter,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  MessageCircle,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = React.useState("Logs")

  const tabs = [
    "Logs",
    "Internal Inbox",
    "Announcements",
    "SMS Templates",
    "Email Templates",
    "WhatsApp Templates"
  ]

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

  const channelStats = [
    { name: "SMS", status: "QUIET", logs: "0 logs", healthy: false },
    { name: "WhatsApp", status: "HEALTHY", logs: "1 logs - Last 1 hour ago", healthy: true },
    { name: "Email", status: "HEALTHY", logs: "3 logs - Last 1 hour ago", healthy: true }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 lg:p-6 bg-[#F8FAFC]">
      {/* Page Header */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#56A600]">Tenant Messaging</h3>
            <h1 className="text-xl font-black tracking-tight text-[#1F2937] mt-0.5">Communications</h1>
            <p className="text-[10px] font-medium text-[#667085] mt-0.5">
              4 today · 0 need attention · 4 total logs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="bg-[#1E293B] text-white hover:bg-[#0F172A] font-bold h-9 px-4 rounded-full text-[11px] border-none">
              Create Template
            </Button>
            <Button size="sm" className="bg-[#2D60FF] hover:bg-[#1A4BDE] text-white font-bold h-9 px-4 rounded-full flex items-center gap-2 shadow-sm border-none text-[11px]">
              <Send className="h-3.5 w-3.5 fill-white" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[#E2E8F0] border border-[#E2E8F0] rounded-sm overflow-hidden shadow-sm">
        <div className="bg-white p-4">
           <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">TODAY</p>
           <h3 className="text-2xl font-black text-[#1E293B] mt-1">4</h3>
           <p className="text-[10px] text-[#94A3B8]">1 delivered or read</p>
        </div>
        <div className="bg-[#F0FDF4] p-4">
           <p className="text-[9px] font-bold text-[#12B76A] uppercase tracking-wider">SENT</p>
           <h3 className="text-2xl font-black text-[#1E293B] mt-1">4</h3>
           <p className="text-[10px] text-[#12B76A]">Successful today</p>
        </div>
        <div className="bg-[#FEF2F2] p-4">
           <p className="text-[9px] font-bold text-[#F04438] uppercase tracking-wider">FAILED</p>
           <h3 className="text-2xl font-black text-[#1E293B] mt-1">0</h3>
           <p className="text-[10px] text-[#F04438]">Failed today</p>
        </div>
        <div className="bg-[#FFFBEB] p-4">
           <p className="text-[9px] font-bold text-[#F79009] uppercase tracking-wider">PENDING</p>
           <h3 className="text-2xl font-black text-[#1E293B] mt-1">0</h3>
           <p className="text-[10px] text-[#F79009]">Pending today</p>
        </div>
        <div className="bg-white p-4">
           <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">ATTENTION</p>
           <h3 className="text-2xl font-black text-[#1E293B] mt-1">0</h3>
           <p className="text-[10px] text-[#64748B]">Failed plus pending</p>
        </div>
      </div>

      {/* Channel Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channelStats.map((channel) => (
          <Card key={channel.name} className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${channel.status === 'QUIET' ? 'bg-[#94A3B8]' : 'bg-[#12B76A]'}`}></div>
                <div>
                  <p className="text-[11px] font-black text-[#1E293B]">{channel.name}</p>
                  <p className="text-[9px] text-[#64748B]">{channel.logs}</p>
                </div>
              </div>
              <Badge variant="secondary" className={`${
                channel.healthy ? 'bg-[#DCFCE7] text-[#12B76A]' : 'bg-[#F2F4F7] text-[#64748B]'
              } font-bold text-[9px] px-2 py-0.5 rounded-md border-none`}>
                {channel.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-[#E2E8F0] gap-6 px-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[11px] font-bold transition-all relative ${
              activeTab === tab ? "text-[#56A600]" : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#56A600]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Logs Section */}
      <Card className="bg-white border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-[#F2F4F7]">
            <h3 className="text-[14px] font-bold text-[#1E293B]">Logs</h3>
            <p className="text-[10px] text-[#64748B]">4 matching communication logs</p>
          </div>

          {/* Filters */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-4 space-y-1">
                <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">SEARCH</label>
                <Input placeholder="Recipient, message, or type" className="h-9 text-[11px] border-[#E2E8F0] rounded-xl" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">CHANNEL</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-9 text-[11px] border-[#E2E8F0] rounded-xl">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">STATUS</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-9 text-[11px] border-[#E2E8F0] rounded-xl">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] font-black text-[#475569] uppercase tracking-wider">DATE</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-9 text-[11px] border-[#E2E8F0] rounded-xl">
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button className="bg-[#2D60FF] hover:bg-[#1A4BDE] text-white font-bold h-9 px-4 rounded-xl flex items-center gap-1.5 flex-1 text-[11px]">
                  <Search className="h-3.5 w-3.5" />
                  Apply
                </Button>
                <Button variant="outline" className="bg-[#1E293B] text-white hover:bg-[#0F172A] font-bold h-9 px-4 rounded-xl border-none text-[11px]">
                  Clear
                </Button>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {filterTags.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className={`${
                    tag === "All Logs"
                    ? "bg-[#1E293B] text-white hover:bg-[#1E293B] border-none"
                    : "bg-white border-[#E2E8F0] text-[#1E293B] hover:bg-gray-50"
                  } rounded-full h-7 px-4 text-[10px] font-bold`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F9FAFB]">
                <TableRow className="border-[#F2F4F7] hover:bg-[#F9FAFB]">
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9 pl-4">Log</TableHead>
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9">Recipient</TableHead>
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9">Channel</TableHead>
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9">Type</TableHead>
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9">Status</TableHead>
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9">Delivery</TableHead>
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9">Message</TableHead>
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9">Created</TableHead>
                  <TableHead className="text-[9px] font-bold text-[#475467] uppercase tracking-wider h-9 text-right pr-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-none">
                  <TableCell colSpan={9} className="h-24 text-center text-[11px] font-medium text-[#667085] italic">
                    No matching communication logs found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legacy Links Section (Preserved) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[
          { title: "SMS History", href: "/communications/sms", icon: MessageSquare, description: "Track sent SMS messages", color: "blue" },
          { title: "Email History", href: "/communications/email", icon: Mail, description: "Track sent emails", color: "green" },
          { title: "Announcements", href: "/communications/announcements", icon: Megaphone, description: "Manage broadcast messages", color: "amber" },
          { title: "Notifications", href: "/communications/notifications", icon: Bell, description: "View system alerts", color: "rose" },
          { title: "Templates", href: "/communications/templates", icon: FileText, description: "Manage message templates", color: "purple" },
          { title: "Automation", href: "/communications/automation", icon: Settings, description: "Manage communication rules", color: "slate" },
        ].map((link) => (
          <Card key={link.title} className="group border-[#E4E7EC] shadow-sm rounded-xl overflow-hidden bg-white hover:border-[#56A600] transition-all cursor-pointer">
            <Link href={link.href}>
              <CardHeader className="p-4 pb-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ring-1 ring-inset group-hover:bg-[#56A600] group-hover:text-white transition-all ${
                  link.color === 'blue' ? 'bg-blue-50 text-blue-600 ring-blue-600/10' :
                  link.color === 'green' ? 'bg-[#F0FDF4] text-[#12B76A] ring-[#12B76A]/10' :
                  link.color === 'amber' ? 'bg-amber-50 text-amber-600 ring-amber-600/10' :
                  link.color === 'rose' ? 'bg-rose-50 text-rose-600 ring-rose-600/10' :
                  link.color === 'purple' ? 'bg-purple-50 text-purple-600 ring-purple-600/10' :
                  'bg-slate-50 text-slate-600 ring-slate-600/10'
                }`}>
                  <link.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold text-[#1F2937]">{link.title}</CardTitle>
                <CardDescription className="text-[10px] font-medium text-[#667085]">{link.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center text-[#56A600] text-[10px] font-bold group-hover:translate-x-1 transition-transform">
                  View details <ExternalLink className="ml-1.5 h-2.5 w-2.5" />
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
