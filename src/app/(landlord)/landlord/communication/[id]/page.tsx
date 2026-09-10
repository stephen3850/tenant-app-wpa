import { getLandlordConversation } from "@/actions/landlord-communication";
import { MessageThread } from "./message-thread";
import { ReplyBox } from "./reply-box";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, MoreVerticalIcon, AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";

export default async function ConversationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await getLandlordConversation(id);
  const session = await auth();
  const currentUserId = session?.user?.id || "";

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-black text-slate-900">Conversation not found</h2>
        <p className="text-slate-500 mb-6">You may not have permission to view this thread.</p>
        <Link href="/landlord/communication">
          <Button variant="outline" className="font-bold">Back to Communication Center</Button>
        </Link>
      </div>
    );
  }

  const isUrgent = conversation.priority === "URGENT";

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/landlord/communication">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{conversation.subject}</h1>
                {isUrgent && (
                    <Badge className="bg-red-600 text-white border-none font-black text-[10px] uppercase tracking-tighter">
                        Urgent
                    </Badge>
                )}
            </div>
            <div className="flex items-center gap-3 mt-0.5">
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-slate-200">
                    {conversation.category}
                </Badge>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  ID: {conversation.id.slice(0, 8)}
                </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVerticalIcon className="h-5 w-5 text-slate-400" />
        </Button>
      </div>

      <Separator className="bg-slate-100" />

      <div className="flex-1 overflow-y-auto py-6">
        <MessageThread messages={conversation.messages} participants={conversation.participants} currentUserId={currentUserId} />
      </div>

      <div className="pt-6 border-t border-slate-100 bg-white sticky bottom-0">
        <ReplyBox conversationId={id} />
      </div>
    </div>
  );
}
