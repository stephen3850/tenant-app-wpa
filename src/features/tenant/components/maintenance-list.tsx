"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  WrenchIcon,
  MessageSquareIcon,
  PaperclipIcon,
  ClockIcon,
  ChevronRightIcon,
  AlertCircleIcon
} from "lucide-react";
import Link from "next/link";

export function MaintenanceList({ requests }: { requests: any[] }) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <WrenchIcon className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No maintenance requests</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-[250px] text-center">
          Everything looks good! If you have an issue, click the "New Request" button.
        </p>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "OPEN":
      case "UNDER_REVIEW": return "secondary";
      case "ASSIGNED":
      case "IN_PROGRESS": return "warning" as any;
      case "RESOLVED": return "success" as any;
      case "CLOSED": return "outline";
      case "REOPENED": return "destructive";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "EMERGENCY": return "text-red-600 bg-red-50 border-red-100";
      case "URGENT":
      case "HIGH": return "text-orange-600 bg-orange-50 border-orange-100";
      case "MEDIUM": return "text-blue-600 bg-blue-50 border-blue-100";
      default: return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Link key={request.id} href={`/maintenance/${request.id}`}>
          <Card className="hover:shadow-md transition-shadow group overflow-hidden border-l-4" style={{ borderLeftColor: request.priority === 'EMERGENCY' ? '#ef4444' : request.priority === 'HIGH' ? '#f97316' : '#3b82f6' }}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] font-bold tracking-tighter uppercase">
                      {request.ticketNumber}
                    </Badge>
                    <Badge variant={getStatusVariant(request.status)} className="text-[10px] font-bold uppercase">
                      {request.status.replace(/_/g, " ")}
                    </Badge>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {request.subject}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                      {request.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center text-[10px] text-muted-foreground uppercase font-semibold">
                      <WrenchIcon className="h-3 w-3 mr-1" />
                      {request.category.name}
                    </div>
                    <div className="flex items-center text-[10px] text-muted-foreground uppercase font-semibold">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {formatDate(request.createdAt)}
                    </div>
                    {request._count.comments > 0 && (
                      <div className="flex items-center text-[10px] text-blue-600 font-bold uppercase">
                        <MessageSquareIcon className="h-3 w-3 mr-1" />
                        {request._count.comments} {request._count.comments === 1 ? 'Update' : 'Updates'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-6 flex items-center">
                   {request.status === 'AWAITING_TENANT' && (
                     <Badge className="mr-4 bg-orange-500 animate-pulse">Action Required</Badge>
                   )}
                   <ChevronRightIcon className="h-5 w-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
