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
import { ChevronDown, Download, Mail, Archive, UserCheck, Ban } from "lucide-react";

interface TenantBulkActionsProps {
  selectedIds: string[];
}

export function TenantBulkActions({ selectedIds }: TenantBulkActionsProps) {
  const hasSelection = selectedIds.length > 0;

  if (!hasSelection) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-slate-50 border-slate-200">
          Bulk Actions ({selectedIds.length}) <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" /> Send Message
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserCheck className="mr-2 h-4 w-4" /> Set as Active
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">
          <Ban className="mr-2 h-4 w-4" /> Blacklist Selected
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Archive className="mr-2 h-4 w-4" /> Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
