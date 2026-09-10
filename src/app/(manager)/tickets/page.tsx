import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ticketRepository } from "@/features/tickets/repositories/ticket-repository";
import { ticketCategoryRepository } from "@/features/tickets/repositories/ticket-category-repository";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";
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
import { MoreHorizontal, Plus, Search, Filter, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function TicketsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const ticketsData = await ticketRepository.findMany(organizationId);
  const categoriesData = await ticketCategoryRepository.findMany(organizationId);

  const tickets = serialize(ticketsData);
  const categories = serialize(categoriesData);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none text-[10px]">Urgent</Badge>;
      case "HIGH": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px]">High</Badge>;
      case "MEDIUM": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px]">Medium</Badge>;
      case "LOW": return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none text-[10px]">Low</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLOSED":
      case "RESOLVED": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px]">Resolved</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px]">In Progress</Badge>;
      case "OPEN": return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none text-[10px]">Open</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8F9FB] min-h-screen animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-xl border border-[#DCE3EA] shadow-sm space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SUPPORT</p>
          <h1 className="text-4xl font-bold text-[#1F2937]">Tickets</h1>
          <p className="text-sm text-slate-500 font-medium">Manage maintenance, complaints, payment issues and more.</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button className="bg-[#4175FF] hover:bg-[#3562D9] text-white font-bold h-11 px-6 rounded-lg transition-all active:scale-95 shadow-md shadow-[#4175FF]/20" asChild>
            <Link href="/tickets/new">Raise Ticket</Link>
          </Button>
          <div className="bg-[#0F172A] text-white px-6 h-11 flex items-center gap-3 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</span>
            <span className="text-xl font-black">{tickets.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-sm flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-bold text-slate-500">Search</label>
          <Input
            placeholder="Subject, tenant"
            className="h-10 rounded-lg border-[#DCE3EA] focus:ring-[#4175FF]/20"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-bold text-slate-500">Category</label>
          <Select defaultValue="all">
            <SelectTrigger className="h-10 rounded-lg border-[#DCE3EA]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-bold text-slate-500">Priority</label>
          <Select defaultValue="all">
            <SelectTrigger className="h-10 rounded-lg border-[#DCE3EA]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-bold text-slate-500">Status</label>
          <Select defaultValue="all">
            <SelectTrigger className="h-10 rounded-lg border-[#DCE3EA]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold h-10 px-8 rounded-lg transition-all active:scale-95">
          Filter
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#DCE3EA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8F9FB]">
              <TableRow className="hover:bg-transparent border-none h-12">
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Subject</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Category</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Tenant</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Priority</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Assigned</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Status</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Cost</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Created</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6">Attachment</TableHead>
                <TableHead className="text-slate-600 font-bold text-[11px] uppercase px-6 text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-48 text-center text-sm font-medium text-slate-400">
                    No tickets yet.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket: any) => (
                  <TableRow key={ticket.id} className="border-b border-[#F5F7FA] hover:bg-slate-50 transition-colors h-14">
                    <TableCell className="px-6 font-bold text-slate-800 text-sm">
                      {ticket.subject}
                    </TableCell>
                    <TableCell className="px-6 text-xs font-medium text-slate-500">
                      {ticket.category?.name || "N/A"}
                    </TableCell>
                    <TableCell className="px-6 text-xs font-bold text-slate-600">
                      {ticket.tenant ? `${ticket.tenant.firstName} ${ticket.tenant.lastName}` : "System"}
                    </TableCell>
                    <TableCell className="px-6">
                      {getPriorityBadge(ticket.priority)}
                    </TableCell>
                    <TableCell className="px-6 text-xs font-medium text-slate-600">
                      {ticket.assignee?.name || "Unassigned"}
                    </TableCell>
                    <TableCell className="px-6">
                      {getStatusBadge(ticket.status)}
                    </TableCell>
                    <TableCell className="px-6 text-xs font-bold text-slate-700">
                      {ticket.actualCost ? `KES ${ticket.actualCost}` : "-"}
                    </TableCell>
                    <TableCell className="px-6 text-xs font-medium text-slate-500 whitespace-nowrap">
                      {format(new Date(ticket.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex justify-center">
                        <Paperclip className="h-4 w-4 text-slate-300" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
