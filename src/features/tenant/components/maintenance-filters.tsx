"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketStatus } from "@prisma/client";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MaintenanceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/portal/tickets?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/portal/tickets");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by subject or ticket number..."
          className="pl-9 bg-white"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => {
            const val = e.target.value;
            const timeout = setTimeout(() => updateFilters("search", val), 500);
            return () => clearTimeout(timeout);
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          defaultValue={searchParams.get("status") || "ALL"}
          onValueChange={(val) => updateFilters("status", val)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.values(TicketStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchParams.get("status") || searchParams.get("search")) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
            <XIcon className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
