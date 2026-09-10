"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, PaperclipIcon, Loader2Icon } from "lucide-react";
import { replyToLandlordConversation } from "@/actions/landlord-communication";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ReplyBox({ conversationId }: { conversationId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSend() {
    if (!content.trim()) return;

    setLoading(true);
    try {
      await replyToLandlordConversation(conversationId, content);
      setContent("");
      toast.success("Message sent");
      router.refresh();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Textarea
          placeholder="Type your reply here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] rounded-2xl border-slate-200 focus:ring-blue-600 focus:border-blue-600 pr-12 font-medium"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Button
                onClick={handleSend}
                disabled={loading || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-10 w-10 p-0 shadow-lg shadow-blue-200"
            >
                {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
            </Button>
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
        This conversation is restricted to organization staff and assigned property owners.
      </p>
    </div>
  );
}
