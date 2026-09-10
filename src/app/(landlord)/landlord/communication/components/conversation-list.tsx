"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ClockIcon,
    ChevronRightIcon,
    AlertCircleIcon,
    CircleIcon,
    MessageSquareIcon
} from "lucide-react";

interface ConversationListProps {
  conversations: any[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed rounded-2xl">
        <MessageSquareIcon className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-900">No conversations yet</h3>
        <p className="text-slate-500 font-medium">Start a discussion with your property manager.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {conversations.map((conv) => {
        const lastMessage = conv.messages[0];
        const isUrgent = conv.priority === "URGENT";

        return (
          <Link
            key={conv.id}
            href={`/landlord/communication/${conv.id}`}
            className="group flex items-center justify-between p-5 bg-white border rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-slate-50">
                  <AvatarImage src={lastMessage?.sender?.image} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                    {lastMessage?.sender?.name?.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
                {/* Unread indicator placeholder */}
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {conv.subject}
                  </h3>
                  {isUrgent && (
                    <Badge className="bg-red-50 text-red-600 border-none font-black text-[10px] uppercase tracking-tighter">
                      Urgent
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-200 uppercase tracking-widest px-2 py-0">
                    {conv.category}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 font-medium truncate">
                  <span className="font-bold text-slate-700">{lastMessage?.sender?.name}: </span>
                  {lastMessage?.content}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquareIcon className="h-3 w-3" />
                    {conv._count.messages} Messages
                  </div>
                </div>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-all ml-4" />
          </Link>
        );
      })}
    </div>
  );
}
