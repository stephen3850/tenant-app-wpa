"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { BellIcon, CheckCircle2Icon, FileTextIcon } from "lucide-react";
import { acknowledgeNotice } from "@/actions/tenant-lease";
import { useState } from "react";

export function LeaseNotices({ notices }: { notices: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAcknowledge = async (id: string) => {
    setLoadingId(id);
    try {
      await acknowledgeNotice(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lease Notices & Communications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {notices.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-sm">No notices issued.</p>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className={`flex items-start gap-4 p-4 rounded-lg border ${notice.acknowledgedAt ? 'bg-slate-50 border-slate-100' : 'bg-yellow-50 border-yellow-200'}`}>
               <div className={`mt-1 p-2 rounded-full ${notice.acknowledgedAt ? 'bg-slate-200 text-slate-500' : 'bg-yellow-100 text-yellow-600'}`}>
                  {notice.acknowledgedAt ? <CheckCircle2Icon className="h-4 w-4" /> : <BellIcon className="h-4 w-4" />}
               </div>
               <div className="flex-1 space-y-1">
                 <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{notice.title}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase">{formatDate(notice.createdAt)}</span>
                 </div>
                 <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
                 {notice.documentUrl && (
                    <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-blue-600" asChild>
                       <a href={notice.documentUrl} target="_blank" rel="noopener noreferrer">
                          <FileTextIcon className="h-3 w-3 mr-1" /> View Attachment
                       </a>
                    </Button>
                 )}
               </div>
               {!notice.acknowledgedAt && (
                  <Button
                    size="sm"
                    className="text-[10px] h-7 bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => handleAcknowledge(notice.id)}
                    disabled={loadingId === notice.id}
                  >
                    Acknowledge
                  </Button>
               )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
