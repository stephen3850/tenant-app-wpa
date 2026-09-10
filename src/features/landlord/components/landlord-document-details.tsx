"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  DownloadIcon,
  PrinterIcon,
  ChevronLeftIcon,
  BuildingIcon,
  CalendarIcon,
  UserIcon,
  HistoryIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  Share2Icon,
  StarIcon,
  InfoIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { favoriteDocument } from "@/actions/landlord-document";
import { useState } from "react";
import { toast } from "sonner";

export function LandlordDocumentDetails({ document }: { document: any }) {
  const [isFav, setIsFavorite] = useState(document.favorites.length > 0);

  const handleToggleFavorite = async () => {
    try {
      const result = await favoriteDocument(document.id);
      setIsFavorite(result);
      toast.success(result ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  if (!document) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/documents" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Vault
          </Link>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">{document.name}</h1>
             <Badge variant="outline" className="font-black border-blue-200 text-blue-600 bg-blue-50/50 uppercase tracking-widest">
                V{document.version}
             </Badge>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <BuildingIcon className="h-4 w-4" /> {document.property.propertyName} • {document.category.replace("_", " ")}
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="font-bold border-2 h-11" onClick={handleToggleFavorite}>
              <StarIcon className={`h-4 w-4 mr-2 ${isFav ? "fill-orange-400 text-orange-400" : ""}`} />
              {isFav ? "Favorited" : "Add Favorite"}
           </Button>
           <Button className="font-bold bg-blue-600 hover:bg-blue-700 h-11">
              <DownloadIcon className="h-4 w-4 mr-2" /> Download Document
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-slate-200 shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                 <div className="flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-xl font-black">Document Preview</CardTitle>
                 </div>
                 <Button variant="ghost" size="sm" className="font-bold text-blue-600 h-8 uppercase text-[10px]">
                    <ExternalLinkIcon className="h-3 w-3 mr-1" /> Open in New Tab
                 </Button>
              </CardHeader>
              <CardContent className="aspect-[4/3] flex items-center justify-center bg-slate-100/50">
                 <div className="text-center p-8">
                    <FileTextIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Preview Not Available</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                       This document type must be downloaded to be viewed securely.
                    </p>
                    <Button className="mt-6 font-bold" variant="outline">
                       Download {document.fileType?.split("/")[1]?.toUpperCase()}
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                 <div className="flex items-center gap-2">
                    <HistoryIcon className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Version History</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-slate-100">
                    <div className="p-4 flex items-center justify-between bg-blue-50/30">
                       <div className="flex items-center gap-3">
                          <Badge className="bg-blue-600 font-black">V{document.version}</Badge>
                          <div>
                             <p className="text-sm font-bold text-slate-900">Current Version (Published)</p>
                             <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{format(new Date(document.publishedAt || document.createdAt), "MMMM dd, yyyy")}</p>
                          </div>
                       </div>
                       <Button variant="ghost" size="sm" className="font-bold text-blue-600 text-[10px] uppercase">Selected</Button>
                    </div>
                    {document.versions.map((v: any) => (
                       <div key={v.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-3 opacity-60">
                             <Badge variant="outline" className="font-black border-slate-300">V{v.version}</Badge>
                             <div>
                                <p className="text-sm font-bold text-slate-900 italic">Historical Archive</p>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{format(new Date(v.publishedAt || v.createdAt), "MMMM dd, yyyy")}</p>
                             </div>
                          </div>
                          <Button variant="ghost" size="sm" className="font-bold text-slate-600 text-[10px] uppercase hover:bg-slate-100">View Archive</Button>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-900 text-white pb-6">
                 <CardTitle className="text-lg font-black flex items-center gap-2">
                    <InfoIcon className="h-5 w-5 text-blue-400" /> Document Info
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 -mt-4 bg-white rounded-t-2xl relative z-10">
                 <div className="space-y-4">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Publisher</p>
                       <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-slate-600" />
                          <p className="text-sm font-bold text-slate-900">{document.uploadedBy?.name || "System"}</p>
                       </div>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <div className="flex items-center gap-2">
                          <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
                          <p className="text-sm font-bold text-emerald-600 uppercase tracking-tighter">Verified & Published</p>
                       </div>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">File Details</p>
                       <p className="text-sm font-bold text-slate-900">{(document.fileSize / 1024 / 1024).toFixed(2)} MB • {document.fileType?.toUpperCase()}</p>
                    </div>
                 </div>

                 <Separator className="bg-slate-100" />

                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                       {document.description || "No description provided for this document."}
                    </p>
                 </div>

                 <Button variant="outline" className="w-full font-bold h-10 border-slate-200" onClick={() => toast.info("Share links are restricted to secure portal access only.")}>
                    <Share2Icon className="h-4 w-4 mr-2" /> Share Securely
                 </Button>
              </CardContent>
           </Card>

           <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                 <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Legal Notice</p>
                 <p className="text-[11px] font-medium text-amber-900/70 leading-relaxed">
                    This document is an immutable record. For corrections, please contact management to publish a new version.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
