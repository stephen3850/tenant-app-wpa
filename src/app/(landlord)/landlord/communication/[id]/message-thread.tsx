"use client";

import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileIcon, DownloadIcon } from "lucide-react";
import { auth } from "@/auth"; // We can't use auth in client component easily, better pass currentUserId

export function MessageThread({ messages, participants, currentUserId }: { messages: any[], participants: any[], currentUserId: string }) {
  return (
    <div className="space-y-8">
      {messages.map((msg, index) => {
        const isMe = msg.sender.id === currentUserId;
        const showAvatar = index === 0 || messages[index - 1].sender.id !== msg.sender.id;

        return (
          <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex-shrink-0">
              {showAvatar ? (
                <Avatar className="h-10 w-10 border-2 border-slate-50 shadow-sm">
                  <AvatarImage src={msg.sender.image} />
                  <AvatarFallback className={`${isMe ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'} font-bold`}>
                    {msg.sender.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-10" />
              )}
            </div>

            <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
              {showAvatar && (
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-black text-slate-900">{isMe ? 'You' : msg.sender.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {format(new Date(msg.createdAt), "h:mm a")}
                  </span>
                </div>
              )}

              <div className={`p-4 rounded-2xl shadow-sm ${
                isMe
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>

              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.attachments.map((file: any) => (
                    <div
                        key={file.id}
                        className={`flex items-center gap-3 p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer group`}
                    >
                      <div className="p-2 bg-white rounded-lg shadow-xs group-hover:bg-blue-50">
                        <FileIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-slate-900 truncate">{file.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <DownloadIcon className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
