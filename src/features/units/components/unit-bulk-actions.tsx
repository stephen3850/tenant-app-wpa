"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, Upload, Archive, CheckCircle } from "lucide-react";

interface UnitBulkActionsProps {
  selectedIds: string[];
  onArchive: (ids: string[]) => void;
  onUpdateStatus: (ids: string[], status: string) => void;
  onExport: () => void;
  onImport: () => void;
}

export function UnitBulkActions({
  selectedIds,
  onArchive,
  onUpdateStatus,
  onExport,
  onImport,
}: UnitBulkActionsProps) {
  const hasSelection = selectedIds.length > 0;

  return (
    <div className="flex items-center gap-2">
      {hasSelection ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Bulk Actions ({selectedIds.length}) <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedIds, "ACTIVE")}>
              <CheckCircle className="mr-2 h-4 w-4" /> Set as Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(selectedIds)}>
              <Archive className="mr-2 h-4 w-4" /> Archive Units
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button variant="outline" onClick={onImport}>
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </>
      )}
    </div>
  );
}
