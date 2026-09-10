"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnnouncementCategory, AnnouncementPriority } from "@prisma/client";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnnouncementFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/announcements?${params.toString()}`);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== (searchParams.get("search") || "")) {
        updateFilters("search", searchValue);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const clearFilters = () => {
    setSearchValue("");
    router.push("/announcements");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          className="pl-9 bg-white"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          defaultValue={searchParams.get("category") || "ALL"}
          onValueChange={(val) => updateFilters("category", val)}
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {Object.values(AnnouncementCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("priority") || "ALL"}
          onValueChange={(val) => updateFilters("priority", val)}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            {Object.values(AnnouncementPriority).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("isRead") || "ALL"}
          onValueChange={(val) => updateFilters("isRead", val)}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="true">Read</SelectItem>
            <SelectItem value="false">Unread</SelectItem>
          </SelectContent>
        </Select>

        {(searchParams.get("category") || searchParams.get("priority") || searchParams.get("search") || searchParams.get("isRead")) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
            <XIcon className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
