"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchIcon, DownloadIcon, FileTextIcon, PlusIcon } from "lucide-react";
import { recordDownload } from "@/actions/support";

export function DownloadCenter({ documents }: any) {
  const [search, setSearch] = useState("");

  const filteredDocs = documents.filter((doc: any) =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (doc: any) => {
    try {
      await recordDownload(doc.id);
      window.open(doc.fileUrl, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates & forms..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates & Forms</CardTitle>
          <CardDescription>Download official templates, inspection forms, and compliance documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No documents found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{doc.title}</div>
                          <div className="text-xs text-muted-foreground font-normal">{doc.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs uppercase tracking-wider">{doc.category.replace("_", " ")}</TableCell>
                    <TableCell>{doc.fileType}</TableCell>
                    <TableCell>{doc._count.downloadLogs}</TableCell>
                    <TableCell>{new Date(doc.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
