"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, ArrowRightIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export function RecentDocumentsCard({ documents }: { documents: any[] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4 text-blue-600" />
            Recent Documents
          </span>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600" asChild>
            <Link href="/documents">
              View All
              <ArrowRightIcon className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No documents shared recently.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <FileTextIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium line-clamp-1">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(doc.createdAt)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(doc.url, "_blank")}>
                   <DownloadIcon className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
