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
import { DocumentCategory, DocumentStatus } from "@prisma/client";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/documents?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/documents");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by document name..."
          className="pl-9"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => {
            const val = e.target.value;
            // Debounce would be better in a real app
            const timeout = setTimeout(() => updateFilters("search", val), 500);
            return () => clearTimeout(timeout);
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          defaultValue={searchParams.get("category") || "ALL"}
          onValueChange={(val) => updateFilters("category", val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {Object.values(DocumentCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("status") || "ALL"}
          onValueChange={(val) => updateFilters("status", val)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.values(DocumentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchParams.get("category") || searchParams.get("status") || searchParams.get("search")) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
            <XIcon className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
