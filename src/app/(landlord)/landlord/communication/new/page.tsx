import { startLandlordConversation } from "@/actions/landlord-communication";
import { ConversationForm } from "./conversation-form";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function NewConversationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/landlord/communication">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">New Conversation</h1>
          <p className="text-slate-500 font-medium">Start a direct line of communication with your management team.</p>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <ConversationForm />
      </div>
    </div>
  );
}
