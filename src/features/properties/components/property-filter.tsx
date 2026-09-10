"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface PropertyFilterProps {
  onFilterChange: (filters: any) => void;
}

export function PropertyFilter({ onFilterChange }: PropertyFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or code..."
          className="pl-8"
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      <Select onValueChange={(val) => onFilterChange({ status: val })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
          <SelectItem value="ARCHIVED">Archived</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="County..."
        className="w-[180px]"
        onChange={(e) => onFilterChange({ county: e.target.value })}
      />
    </div>
  );
}
