"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  FileTextIcon,
  DownloadIcon,
  HistoryIcon,
  CalendarIcon,
  UserIcon,
  InfoIcon,
  PrinterIcon
} from "lucide-react";
import { logDocumentDownload, logDocumentPrint } from "@/actions/tenant-documents";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DocumentDetails({ doc, children }: { doc: any, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const handleDownload = async () => {
    await logDocumentDownload(doc.id);
    window.open(doc.url, "_blank");
  };

  const handlePrint = async () => {
    await logDocumentPrint(doc.id);
    // In a real app, this might trigger a specific print view or PDF generation
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] uppercase">{doc.category.replace(/_/g, " ")}</Badge>
            <Badge variant={doc.status === "AVAILABLE" ? "success" as any : "secondary"} className="text-[10px] uppercase">
                {doc.status}
            </Badge>
          </div>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-blue-600" />
            {doc.name}
          </DialogTitle>
          <DialogDescription>
            Document Details & Version History
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {doc.description || "No description provided for this document."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
               <div className="flex items-center gap-3 text-sm">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-muted-foreground">Shared by:</span>
                  <span className="font-medium">{doc.uploadedBy?.name || "Management"}</span>
               </div>
               <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-muted-foreground">Upload Date:</span>
                  <span className="font-medium">{formatDate(doc.createdAt)}</span>
               </div>
               {doc.expiryDate && (
                 <div className="flex items-center gap-3 text-sm">
                    <ClockIcon className="h-4 w-4 text-orange-400" />
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span className="font-medium text-orange-700">{formatDate(doc.expiryDate)}</span>
                 </div>
               )}
               <div className="flex items-center gap-3 text-sm">
                  <InfoIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-muted-foreground">Latest Version:</span>
                  <span className="font-medium">v{doc.version}.0</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <HistoryIcon className="h-3 w-3" /> Version History
             </h4>

             {doc.versions?.length > 0 ? (
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                   {doc.versions.map((v: any) => (
                      <div key={v.id} className="flex justify-between items-center text-[10px] p-2 bg-white rounded border border-slate-100">
                         <div>
                            <span className="font-bold">v{v.version}.0</span>
                            <span className="mx-2 text-slate-300">|</span>
                            <span>{formatDate(v.createdAt)}</span>
                         </div>
                         <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px]" onClick={() => window.open(v.url, "_blank")}>
                            View
                         </Button>
                      </div>
                   ))}
                </div>
             ) : (
                <p className="text-[10px] text-muted-foreground italic">No previous versions available.</p>
             )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
           <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleDownload}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download Document
           </Button>
           <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { ClockIcon } from "lucide-react";
