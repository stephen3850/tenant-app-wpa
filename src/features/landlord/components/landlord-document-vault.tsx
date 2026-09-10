"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileTextIcon,
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  StarIcon,
  BuildingIcon,
  CalendarIcon,
  EyeIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  FileIcon,
  FileBadgeIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { favoriteDocument } from "@/actions/landlord-document";
import { toast } from "sonner";

export function LandlordDocumentVault({ documents }: { documents: any[] }) {
  const [search, setSearch] = useState("");

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.property.propertyName.toLowerCase().includes(search.toLowerCase())
  );

  const handleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await favoriteDocument(id);
      toast.success("Preferences updated");
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const getCategoryBadge = (category: string) => {
    return <Badge variant="outline" className="font-bold text-[10px] uppercase border-slate-200 text-slate-500">{category.replace("_", " ")}</Badge>;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("pdf")) return <FileTextIcon className="h-4 w-4 text-red-500" />;
    if (fileType?.includes("image")) return <FileIcon className="h-4 w-4 text-blue-500" />;
    return <FileIcon className="h-4 w-4 text-slate-400" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Document Vault</h1>
          <p className="text-slate-500 font-medium">Secure access to all property agreements, reports, and compliance certificates.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documents by name or property..."
            className="pl-10 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold gap-2">
            <FilterIcon className="h-4 w-4" /> Category
          </Button>
          <Button variant="outline" className="font-bold gap-2">
             <BuildingIcon className="h-4 w-4" /> All Properties
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-2">Document Name</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Category</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Property</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Published Date</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Version</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <TableCell className="text-center pl-4">
                       <button onClick={(e) => handleFavorite(doc.id, e)} className="hover:scale-110 transition-transform">
                          <StarIcon className={`h-4 w-4 ${doc.favorites.length > 0 ? "fill-orange-400 text-orange-400" : "text-slate-300"}`} />
                       </button>
                    </TableCell>
                    <TableCell className="pl-2">
                      <Link href={`/landlord/documents/${doc.id}`} className="flex items-center gap-3">
                         <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                            {getFileIcon(doc.fileType)}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{doc.name}</p>
                            <p className="text-[10px] font-medium text-slate-400">{(doc.fileSize / 1024 / 1024).toFixed(2)} MB • {doc.fileType?.split("/")[1]?.toUpperCase()}</p>
                         </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                       {getCategoryBadge(doc.category)}
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm italic">
                          <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
                          {doc.property.propertyName}
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {doc.publishedAt ? format(new Date(doc.publishedAt), "MMM dd, yyyy") : format(new Date(doc.createdAt), "MMM dd, yyyy")}
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <Badge variant="secondary" className="font-black h-5 text-[9px] px-1.5">V{doc.version}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black text-blue-600 uppercase hover:bg-blue-50" asChild>
                             <Link href={`/landlord/documents/${doc.id}`}>
                                <EyeIcon className="h-3.5 w-3.5 mr-1" /> View
                             </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-slate-900">
                             <DownloadIcon className="h-3.5 w-3.5" />
                          </Button>
                       </div>
                    </TableCell>
                </TableRow>
              ))}
              {filteredDocs.length === 0 && (
                <TableRow>
                   <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <FileBadgeIcon className="h-12 w-12 text-slate-200 mb-4" />
                         <h3 className="text-lg font-black text-slate-900">No documents found</h3>
                         <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
