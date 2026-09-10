"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Activity {
  title: string;
  desc: string;
  time: string | Date;
  user: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  className?: string;
  title?: string;
}

export function RecentActivity({
  activities = [],
  className,
  title = "RECENT ACTIVITY"
}: RecentActivityProps) {
  return (
    <Card className={cn("border-[#DCE3EA] shadow-sm rounded-xl overflow-hidden bg-[#F8FAFC]", className)}>
      <CardHeader className="pb-3 pt-6 px-6 bg-white/50 border-b border-[#F1F5F9]">
        <CardTitle className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          {activities && activities.length > 0 ? (
            activities.map((act, i) => (
              <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-1 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="h-2 w-2 mt-1.5 rounded-full bg-[#10A34F] shrink-0 shadow-[0_0_0_4px_rgba(16,163,79,0.05)]" />
                <div className="space-y-1">
                  <p className="text-[13px] font-black text-[#1E293B] leading-none">{act.title}</p>
                  <p className="text-[12px] font-medium text-[#64748B] leading-relaxed mt-1">{act.desc}</p>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mt-1.5 flex items-center gap-2">
                    <span>{formatDistanceToNow(new Date(act.time), { addSuffix: true })}</span>
                    <span className="h-1 w-1 rounded-full bg-[#E2E8F0]" />
                    <span>{act.user}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <p className="text-[15px] font-bold text-[#94A3B8]">No recent activities found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
