import { getLandlordConversations, getLandlordAnnouncements } from "@/actions/landlord-communication";
import { ConversationList } from "./components/conversation-list";
import { AnnouncementList } from "./components/announcement-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon, MessageSquareIcon, MegaphoneIcon } from "lucide-react";
import Link from "next/link";

export default async function CommunicationCenterPage() {
  const conversations = await getLandlordConversations();
  const announcements = await getLandlordAnnouncements();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Communication Center</h1>
          <p className="text-slate-500 font-medium mt-1">
            Stay connected with your property management team.
          </p>
        </div>
        <Link href="/landlord/communication/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-full md:w-auto h-auto">
          <TabsTrigger
            value="messages"
            className="rounded-lg font-black text-xs uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Messages ({conversations.length})
          </TabsTrigger>
          <TabsTrigger
            value="announcements"
            className="rounded-lg font-black text-xs uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            <MegaphoneIcon className="mr-2 h-4 w-4" />
            Announcements ({announcements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <ConversationList conversations={conversations} />
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <AnnouncementList announcements={announcements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
