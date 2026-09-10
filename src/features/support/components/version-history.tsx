"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RotateCcwIcon, HistoryIcon } from "lucide-react";
import { rollbackVersion } from "@/actions/support";

export function VersionHistory({ articleId, versions, currentVersion }: any) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleRollback = async (version: number) => {
    if (!confirm(`Are you sure you want to rollback to version ${version}?`)) return;

    setLoading(version);
    try {
      await rollbackVersion(articleId, version);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Rollback failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HistoryIcon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Revision History</h3>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Change Summary</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((v: any) => (
              <TableRow key={v.id} className={v.version === currentVersion ? "bg-muted/50" : ""}>
                <TableCell className="font-medium">
                  v{v.version} {v.version === currentVersion && "(Current)"}
                </TableCell>
                <TableCell>{v.author.name}</TableCell>
                <TableCell>{v.changeSummary || "No summary"}</TableCell>
                <TableCell>{new Date(v.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {v.version !== currentVersion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRollback(v.version)}
                      disabled={loading !== null}
                    >
                      {loading === v.version ? "..." : <RotateCcwIcon className="h-4 w-4" />}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
