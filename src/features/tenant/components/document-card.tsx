"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  FileIcon,
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  MoreVerticalIcon
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
      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
             <FileTextIcon className="h-6 w-6" />
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

          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex items-center text-[10px] text-muted-foreground">
              <ClockIcon className="h-3 w-3 mr-1" />
              Uploaded {formatDate(doc.createdAt)}
            </div>
            {doc.expiryDate && (
              <div className="flex items-center text-[10px] text-orange-600 font-medium">
                <ClockIcon className="h-3 w-3 mr-1" />
                Expires {formatDate(doc.expiryDate)}
              </div>
            )}
            <div className="flex items-center text-[10px] text-muted-foreground">
              <UserIcon className="h-3 w-3 mr-1" />
              Shared by {doc.uploadedBy?.name || "Management"}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
           <Button variant="outline" size="sm" className="w-full text-xs" onClick={(e) => { e.stopPropagation(); handleDownload(); }}>
              <DownloadIcon className="h-3 w-3 mr-2" />
              Download PDF
           </Button>
        </CardFooter>
      </Card>
    </DocumentDetails>
  );
}
