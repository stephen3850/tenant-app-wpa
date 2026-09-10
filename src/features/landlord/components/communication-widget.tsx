"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareIcon, BellIcon, ArrowRightIcon, MegaphoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function CommunicationWidget({ communications }: { communications: any }) {
  const { unreadMessages, urgentMessages, recentConversations, unreadAnnouncements } = communications;

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b py-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <MessageSquareIcon className="h-4 w-4" /> Communication
            </CardTitle>
            <Link href="/landlord/communication">
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-tighter text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View All
                </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="p-4 border-r border-slate-100 text-center">
                <p className="text-2xl font-black text-slate-900">{unreadMessages + unreadAnnouncements}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Unread Items</p>
            </div>
            <div className="p-4 text-center">
                <p className={`text-2xl font-black ${urgentMessages > 0 ? 'text-red-600' : 'text-slate-900'}`}>{urgentMessages}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Urgent Tasks</p>
            </div>
        </div>

        <div className="divide-y divide-slate-50">
            {recentConversations.length > 0 ? (
                recentConversations.map((conv: any) => (
                    <Link key={conv.id} href={`/landlord/communication/${conv.id}`} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group">
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <MessageSquareIcon className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{conv.subject}</p>
                            <p className="text-[10px] font-medium text-slate-500 truncate">
                                {conv.messages[0]?.sender.name}: {conv.messages[0]?.content}
                            </p>
                        </div>
                        <ArrowRightIcon className="h-3 w-3 text-slate-300 group-hover:text-blue-600" />
                    </Link>
                ))
            ) : (
                <div className="p-8 text-center">
                    <p className="text-xs font-medium text-slate-400">No recent conversations.</p>
                </div>
            )}
        </div>

        {unreadAnnouncements > 0 && (
            <div className="p-3 bg-blue-50/50">
                <Link href="/landlord/communication" className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-blue-100 shadow-sm hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-2">
                        <MegaphoneIcon className="h-3 w-3 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter">
                            {unreadAnnouncements} New Announcement{unreadAnnouncements > 1 ? 's' : ''}
                        </span>
                    </div>
                    <Badge className="bg-blue-600 text-white border-none h-4 w-4 p-0 flex items-center justify-center text-[8px] font-bold">
                        !
                    </Badge>
                </Link>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
