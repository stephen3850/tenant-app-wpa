"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    MegaphoneIcon,
    CalendarIcon,
    UserIcon,
    ArrowRightIcon,
    CheckCircle2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { acknowledgeLandlordAnnouncement } from "@/actions/landlord-communication";
import { toast } from "sonner";
import { useState } from "react";

interface AnnouncementListProps {
  announcements: any[];
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAcknowledge(id: string) {
    setLoadingId(id);
    try {
      await acknowledgeLandlordAnnouncement(id);
      toast.success("Announcement acknowledged");
    } catch (error) {
      toast.error("Failed to acknowledge");
    } finally {
      setLoadingId(null);
    }
  }

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed rounded-2xl">
        <MegaphoneIcon className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-900">No active announcements</h3>
        <p className="text-slate-500 font-medium">Check back later for management updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {announcements.map((ann) => {
        const isRead = ann.reads && ann.reads.length > 0;
        const isUrgent = ann.priority === "URGENT";

        return (
          <Card key={ann.id} className={`overflow-hidden border-none shadow-sm transition-all hover:shadow-md ${isRead ? 'opacity-80' : 'ring-2 ring-blue-100 ring-offset-2'}`}>
            <CardHeader className={`${isUrgent ? 'bg-red-50' : 'bg-slate-50'} border-b flex flex-row items-center justify-between py-4`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <MegaphoneIcon className="h-4 w-4" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-black text-slate-900">{ann.title}</CardTitle>
                        <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <UserIcon className="h-3 w-3" /> {ann.creator.name}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <CalendarIcon className="h-3 w-3" /> {format(new Date(ann.sentAt), "MMM d, yyyy")}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isUrgent && (
                        <Badge className="bg-red-600 text-white border-none font-black text-[10px] uppercase tracking-tighter">
                            Critical Update
                        </Badge>
                    )}
                    <Badge variant="outline" className="bg-white text-[10px] font-black uppercase tracking-widest text-slate-500 border-slate-200">
                        {ann.category}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6 pb-6 bg-white">
              <div className="prose prose-slate max-w-none mb-6">
                <p className="text-slate-600 font-medium leading-relaxed">
                  {ann.content}
                </p>
              </div>

              {ann.attachments && ann.attachments.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {ann.attachments.map((file: any) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 border rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="p-1.5 bg-white rounded shadow-sm">
                        <ArrowRightIcon className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{file.name}</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                    {ann.expiresAt && `Valid until ${format(new Date(ann.expiresAt), "MMM d, yyyy")}`}
                  </div>
                  {!isRead ? (
                    <Button
                        size="sm"
                        onClick={() => handleAcknowledge(ann.id)}
                        disabled={loadingId === ann.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-6 rounded-full"
                    >
                        {loadingId === ann.id ? "Processing..." : "Mark as Read"}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                        <CheckCircle2Icon className="h-4 w-4" />
                        Acknowledged
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
