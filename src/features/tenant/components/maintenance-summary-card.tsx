import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WrenchIcon, PlusIcon, ChevronRightIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MaintenanceSummaryCard({ maintenance }: any) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span className="flex items-center gap-2 uppercase tracking-tighter">
            <WrenchIcon className="h-4 w-4 text-blue-600" />
            Tickets
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
            <Link href="/portal/tickets">
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 border p-2 rounded-lg text-center">
            <p className="text-lg font-bold text-slate-900">{maintenance.open}</p>
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Open</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-center">
            <p className="text-lg font-bold text-blue-700">{maintenance.inProgress}</p>
            <p className="text-[10px] font-bold uppercase text-blue-600/70 tracking-tighter">Active</p>
          </div>
          <div className="bg-green-50 border border-green-100 p-2 rounded-lg text-center">
            <p className="text-lg font-bold text-green-700">{maintenance.closed || maintenance.resolved || 0}</p>
            <p className="text-[10px] font-bold uppercase text-green-600/70 tracking-tighter">Done</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
           <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest border-b pb-1">Recent Tickets</h4>
           {maintenance.latest?.length === 0 ? (
             <p className="text-[10px] text-muted-foreground italic py-2">No recent tickets.</p>
           ) : (
             maintenance.latest?.map((ticket: any) => (
               <Link key={ticket.id} href={`/portal/tickets/${ticket.id}`} className="flex justify-between items-center text-xs group">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors truncate max-w-[120px]">{ticket.subject}</p>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">{ticket.category?.name}</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] h-4 px-1 font-bold uppercase tracking-tighter">{ticket.status}</Badge>
               </Link>
             ))
           )}
        </div>

        <div className="pt-2">
          <Button size="sm" className="w-full text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 h-8" asChild>
            <Link href="/portal/tickets/new">
              <PlusIcon className="h-3 w-3 mr-1" /> New Ticket
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
