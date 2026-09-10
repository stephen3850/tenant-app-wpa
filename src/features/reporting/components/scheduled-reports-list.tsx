"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Plus, MoreVertical, Play, Pause, Trash2 } from "lucide-react";

export function ScheduledReportsList() {
  const scheduled = [
    { id: 1, name: "Weekly Financial Summary", frequency: "Weekly", nextRun: "2026-06-21", status: "ACTIVE", template: "Income Statement" },
    { id: 2, name: "Monthly Rent Roll", frequency: "Monthly", nextRun: "2026-07-01", status: "ACTIVE", template: "Rent Roll" },
    { id: 3, name: "Daily Occupancy Snapshot", frequency: "Daily", nextRun: "2026-06-16", status: "PAUSED", template: "Occupancy Report" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-slate-900 font-bold">
          <Plus className="mr-2 h-4 w-4" /> Schedule New Report
        </Button>
      </div>

      <div className="bg-white rounded-xl border-2 border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Schedule Name</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Template</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Frequency</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Next Run</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs">Status</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduled.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50">
                <TableCell className="font-bold text-slate-900">{item.name}</TableCell>
                <TableCell className="font-medium text-slate-500">{item.template}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-black uppercase text-[10px]">
                    {item.frequency}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-slate-600">
                  <Clock className="h-3 w-3 inline mr-2" />
                  {item.nextRun}
                </TableCell>
                <TableCell>
                  <Badge className={`font-black uppercase text-[10px] ${
                    item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  } border-none`}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {item.status === 'ACTIVE' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
