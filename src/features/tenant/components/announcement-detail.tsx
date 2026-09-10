"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import {
  MegaphoneIcon,
  ClockIcon,
  PaperclipIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  AlertTriangleIcon
} from "lucide-react";
import { acknowledgeAnnouncement } from "@/actions/tenant-announcements";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AnnouncementDetail({ announcement }: { announcement: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isAcknowledged = announcement.reads?.[0]?.acknowledgedAt;

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      await acknowledgeAnnouncement(announcement.id);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "URGENT": return "destructive";
      case "IMPORTANT": return "warning" as any;
      default: return "secondary";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="border-b bg-slate-50/50 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
             <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <Badge variant={getPriorityVariant(announcement.priority)} className="px-3 py-0.5 font-bold uppercase tracking-widest text-[10px]">
                    {announcement.priority}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-0.5 font-bold uppercase tracking-widest text-[10px]">
                    {announcement.category}
                  </Badge>
               </div>
               <CardTitle className="text-3xl font-extrabold text-slate-900 leading-tight">
                 {announcement.title}
               </CardTitle>
             </div>
             {isAcknowledged && (
                <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-1 font-bold gap-2">
                   <CheckCircle2Icon className="h-4 w-4" /> Acknowledged
                </Badge>
             )}
          </div>

          <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-200/60">
             <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={announcement.creator.image} />
                <AvatarFallback className="bg-blue-600 text-white font-bold">
                   {announcement.creator.name.charAt(0)}
                </AvatarFallback>
             </Avatar>
             <div>
                <p className="text-sm font-bold text-slate-900">{announcement.creator.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium uppercase tracking-tighter">
                   <ClockIcon className="h-3 w-3" />
                   Published {formatDate(announcement.sentAt)}
                   {announcement.expiresAt && (
                      <span className="text-red-500">
                        • Expires {formatDate(announcement.expiresAt)}
                      </span>
                   )}
                </p>
             </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 prose prose-slate max-w-none prose-p:text-slate-700 prose-headings:text-slate-900 prose-a:text-blue-600">
           <div
             className="text-lg leading-relaxed whitespace-pre-wrap"
             dangerouslySetInnerHTML={{ __html: announcement.content }}
           />

           {announcement.attachments.length > 0 && (
             <div className="mt-12 pt-8 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Official Attachments</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                   {announcement.attachments.map((att: any) => (
                     <a
                       key={att.id}
                       href={att.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-between p-4 bg-slate-50 border rounded-xl hover:bg-slate-100 transition-colors group"
                     >
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-white rounded-lg border shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                              <PaperclipIcon className="h-4 w-4" />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-sm font-bold text-slate-800 line-clamp-1">{att.name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-semibold">{(att.size / 1024 / 1024).toFixed(2)} MB</p>
                           </div>
                        </div>
                        <ExternalLinkIcon className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                     </a>
                   ))}
                </div>
             </div>
           )}
        </CardContent>

        <CardFooter className="bg-slate-50 border-t p-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3 text-sm text-slate-500 italic">
              {announcement.priority === 'URGENT' && (
                <AlertTriangleIcon className="h-5 w-5 text-red-500" />
              )}
              {announcement.priority === 'URGENT'
                ? "This is an urgent announcement requiring your immediate attention."
                : "Please review this announcement and acknowledge if required."}
           </div>

           <div className="flex gap-4 w-full md:w-auto">
              <Button variant="outline" asChild className="flex-1 md:flex-none">
                 <Link href="/announcements">
                   <ChevronLeftIcon className="h-4 w-4 mr-2" />
                   All Announcements
                 </Link>
              </Button>
              {!isAcknowledged && (
                <Button
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 min-w-[180px] font-bold"
                  onClick={handleAcknowledge}
                  disabled={loading}
                >
                  {loading ? (
                    <ClockIcon className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2Icon className="h-4 w-4 mr-2" />
                  )}
                  Acknowledge Receipt
                </Button>
              )}
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
