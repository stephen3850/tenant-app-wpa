"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  MoreVerticalIcon,
  ImageIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { logDocumentDownload } from "@/actions/tenant-documents";
import { DocumentDetails } from "./document-details";

export function DocumentCard({ doc }: { doc: any }) {
  const handleDownload = async () => {
    await logDocumentDownload(doc.id);
    window.open(doc.url, "_blank");
  };

  const isImage =
    doc.fileType?.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.url);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "success";
      case "ARCHIVED": return "secondary";
      case "EXPIRED": return "destructive";
      default: return "outline";
    }
  };

  return (
    <DocumentDetails doc={doc}>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-slate-200">
        {isImage && (
          <div className="relative h-36 w-full bg-slate-100 overflow-hidden border-b border-slate-200">
            <img
              src={doc.url}
              alt={doc.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90 text-slate-800 backdrop-blur-xs text-[10px] font-bold shadow-xs">
                Image
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="flex flex-row items-start justify-between pb-2 pt-4">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            {isImage ? <ImageIcon className="h-5 w-5" /> : <FileTextIcon className="h-5 w-5" />}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(doc.url, "_blank"); }}>
                <EyeIcon className="h-4 w-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownload(); }}>
                <DownloadIcon className="h-4 w-4 mr-2" /> Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <CardTitle className="text-sm font-bold line-clamp-1">{doc.name}</CardTitle>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]">
              {doc.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
              {doc.category.replace(/_/g, " ")}
            </Badge>
            <Badge variant={getStatusColor(doc.status) as any} className="text-[10px] uppercase font-bold tracking-tighter">
              {doc.status}
            </Badge>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center text-[10px] text-muted-foreground font-medium">
              <ClockIcon className="h-3 w-3 mr-1 text-slate-400" />
              Uploaded {formatDate(doc.createdAt)}
            </div>
            {doc.expiryDate && (
              <div className="flex items-center text-[10px] text-orange-600 font-semibold">
                <ClockIcon className="h-3 w-3 mr-1" />
                Expires {formatDate(doc.expiryDate)}
              </div>
            )}
            <div className="flex items-center text-[10px] text-muted-foreground font-medium">
              <UserIcon className="h-3 w-3 mr-1 text-slate-400" />
              Uploaded by {doc.uploadedBy?.name || "You"}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl border-slate-200" onClick={(e) => { e.stopPropagation(); handleDownload(); }}>
            <DownloadIcon className="h-3.5 w-3.5 mr-2" />
            {isImage ? "View / Download Image" : "Download File"}
          </Button>
        </CardFooter>
      </Card>
    </DocumentDetails>
  );
}
