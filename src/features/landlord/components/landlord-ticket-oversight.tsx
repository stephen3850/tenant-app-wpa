"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  WrenchIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  AlertTriangleIcon,
  CalendarIcon,
  BuildingIcon,
  UserIcon,
  ClockIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";

export function LandlordTicketOversight({ tickets }: { tickets: any[] }) {
  const [search, setSearch] = useState("");

  const filteredTickets = tickets.filter(t =>
    t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.property.propertyName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN": return <Badge className="bg-blue-500 font-black uppercase">OPEN</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-orange-500 font-black uppercase">IN PROGRESS</Badge>;
      case "RESOLVED": return <Badge className="bg-emerald-500 font-black uppercase">RESOLVED</Badge>;
      case "CLOSED": return <Badge variant="secondary" className="font-black uppercase">CLOSED</Badge>;
      case "EMERGENCY": return <Badge variant="destructive" className="font-black uppercase">EMERGENCY</Badge>;
      default: return <Badge className="font-black uppercase">{status.replace("_", " ")}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "EMERGENCY": return <Badge variant="destructive" className="font-black h-5 text-[9px]">EMERGENCY</Badge>;
      case "HIGH": return <Badge className="bg-red-100 text-red-700 border-red-200 font-black h-5 text-[9px]">HIGH</Badge>;
      case "MEDIUM": return <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-black h-5 text-[9px]">MEDIUM</Badge>;
      default: return <Badge variant="outline" className="font-black h-5 text-[9px]">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/tickets" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ticket Oversight</h1>
          <p className="text-slate-500 font-medium">Real-time monitoring of all maintenance requests and their progress.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by ticket #, subject or property..."
            className="pl-10 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold gap-2">
            <FilterIcon className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="font-bold gap-2">
             <CalendarIcon className="h-4 w-4" /> Date Range
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Ticket & Unit</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Property</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Category</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Priority</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                       <div className="bg-slate-100 p-2 rounded-lg"><WrenchIcon className="h-4 w-4 text-slate-600" /></div>
                       <div>
                          <p className="font-bold text-slate-900">{ticket.ticketNumber}</p>
                          <p className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]">{ticket.subject}</p>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight">Unit {ticket.unit?.unitNumber || "N/A"}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm">
                        <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
                        {ticket.property.propertyName}
                     </div>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline" className="font-bold text-slate-500 border-slate-200">{ticket.category.name}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getPriorityBadge(ticket.priority)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(ticket.status)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="text-xs font-bold text-slate-900">{format(new Date(ticket.updatedAt), "MMM dd, yyyy")}</div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-1 uppercase">
                       <ClockIcon className="h-3 w-3" /> {format(new Date(ticket.updatedAt), "HH:mm")}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTickets.length === 0 && (
                <TableRow>
                   <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <WrenchIcon className="h-12 w-12 text-slate-200 mb-4" />
                         <h3 className="text-lg font-black text-slate-900">No tickets found</h3>
                         <p className="text-slate-500 font-medium">There are no maintenance tickets matching your search or filters.</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
