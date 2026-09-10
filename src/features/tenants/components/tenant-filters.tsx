"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { TenantStatus } from "@prisma/client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface TenantFiltersProps {
  filters: any;
  setFilters?: (filters: any) => void;
}

export function TenantFilters({ filters, setFilters }: TenantFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = (newFilters: any) => {
    if (setFilters) {
      setFilters(newFilters);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.search) {
      params.set("search", newFilters.search);
    } else {
      params.delete("search");
    }

    if (newFilters.status) {
      params.set("status", newFilters.status);
    } else {
      params.delete("status");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    updateFilters({
      search: "",
      status: undefined,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tenants..."
          className="pl-9"
          value={filters.search || ""}
          onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <Select
        value={filters.status || "all"}
        onValueChange={(v) => updateFilters({ ...filters, status: v === "all" ? undefined : v as any })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {Object.values(TenantStatus).map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" onClick={handleClear} className="h-10 px-2 lg:px-3">
        Reset
        <X className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
