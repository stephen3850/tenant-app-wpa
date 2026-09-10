"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, FilterIcon } from "lucide-react";
import { useTransition } from "react";

export function OrganizationsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleStatusChange(status: string) {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "ALL") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
      <div className="relative w-full md:w-72">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name or slug..."
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 font-medium border-slate-200 focus-visible:ring-blue-600 h-10"
        />
      </div>
      <Select
        defaultValue={searchParams.get("status")?.toString() || "ALL"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full md:w-48 h-10 font-bold border-slate-200 focus:ring-blue-600">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-slate-400" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL" className="font-bold">All Statuses</SelectItem>
          <SelectItem value="ACTIVE" className="font-bold">Active</SelectItem>
          <SelectItem value="TRIAL" className="font-bold">Trial</SelectItem>
          <SelectItem value="SUSPENDED" className="font-bold text-red-600">Suspended</SelectItem>
          <SelectItem value="CANCELLED" className="font-bold">Cancelled</SelectItem>
          <SelectItem value="ARCHIVED" className="font-bold">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
