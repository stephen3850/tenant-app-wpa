"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  MegaphoneIcon,
  ClockIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  PaperclipIcon
} from "lucide-react";
import Link from "next/link";

export function AnnouncementList({ announcements }: { announcements: any[] }) {
  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <MegaphoneIcon className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-[250px] text-center">
          No new announcements to show at the moment.
        </p>
      </div>
    );
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "URGENT": return "destructive";
      case "IMPORTANT": return "warning" as any;
      default: return "secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "EMERGENCY": return "bg-red-100 text-red-700 border-red-200";
      case "MAINTENANCE": return "bg-orange-100 text-orange-700 border-orange-200";
      case "UTILITIES": return "bg-blue-100 text-blue-700 border-blue-200";
      case "SECURITY": return "bg-slate-100 text-slate-700 border-slate-200";
      case "BILLING": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="space-y-4">
      {announcements.map((a) => {
        const isRead = a.reads.length > 0;
        const isAcknowledged = isRead && a.reads[0].acknowledgedAt;

        return (
          <Link key={a.id} href={`/announcements/${a.id}`}>
            <Card className={`hover:shadow-md transition-shadow group overflow-hidden border-l-4 ${!isRead ? 'bg-blue-50/30 border-blue-400' : 'border-slate-200'}`}>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      {!isRead && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                      )}
                      <Badge variant={getPriorityVariant(a.priority)} className="text-[10px] font-bold uppercase tracking-tighter">
                        {a.priority}
                      </Badge>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getCategoryColor(a.category)}`}>
                        {a.category}
                      </span>
                      {isAcknowledged && (
                        <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50 uppercase font-bold gap-1">
                          <CheckCircle2Icon className="h-2 w-2" /> Acknowledged
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className={`text-base font-bold transition-colors ${!isRead ? 'text-blue-900 group-hover:text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>
                        {a.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                        {a.content.replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center text-[10px] text-muted-foreground uppercase font-semibold">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {formatDate(a.sentAt)}
                      </div>
                      <div className="flex items-center text-[10px] text-muted-foreground uppercase font-semibold">
                        <MegaphoneIcon className="h-3 w-3 mr-1" />
                        {a.creator.name}
                      </div>
                      {a.attachments.length > 0 && (
                        <div className="flex items-center text-[10px] text-blue-600 font-bold uppercase">
                          <PaperclipIcon className="h-3 w-3 mr-1" />
                          {a.attachments.length} {a.attachments.length === 1 ? 'Attachment' : 'Attachments'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 flex items-center">
                     <ChevronRightIcon className="h-5 w-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
