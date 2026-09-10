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
import { UnitFilterValues } from "../schemas";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface UnitFiltersProps {
  properties: { id: string; propertyName: string }[];
  filters: UnitFilterValues;
  setFilters?: (filters: UnitFilterValues) => void;
}

export function UnitFilters({ properties, filters, setFilters }: UnitFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = (newFilters: UnitFilterValues) => {
    if (setFilters) {
      setFilters(newFilters);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.search) params.set("search", newFilters.search);
    else params.delete("search");

    if (newFilters.propertyId) params.set("propertyId", newFilters.propertyId);
    else params.delete("propertyId");

    if (newFilters.occupancyStatus) params.set("occupancyStatus", newFilters.occupancyStatus);
    else params.delete("occupancyStatus");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    updateFilters({
      search: "",
      propertyId: undefined,
      unitType: undefined,
      occupancyStatus: undefined,
      status: undefined,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search units..."
          className="pl-9"
          value={filters.search || ""}
          onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <Select
        value={filters.propertyId || "all"}
        onValueChange={(v) => updateFilters({ ...filters, propertyId: v === "all" ? undefined : v })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Properties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Properties</SelectItem>
          {properties.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.propertyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.occupancyStatus || "all"}
        onValueChange={(v) => updateFilters({ ...filters, occupancyStatus: v === "all" ? undefined : v as any })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Occupancy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="VACANT">Vacant</SelectItem>
          <SelectItem value="OCCUPIED">Occupied</SelectItem>
          <SelectItem value="RESERVED">Reserved</SelectItem>
          <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" onClick={handleClear} className="h-10 px-2 lg:px-3">
        Reset
        <X className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
