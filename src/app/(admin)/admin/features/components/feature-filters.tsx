"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Globe, Activity } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function FeatureFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search features by name or key..."
          className="pl-10 font-medium border-2 focus-visible:ring-slate-900 h-11 rounded-xl"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => handleFilter("search", e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <Select onValueChange={(v) => handleFilter("status", v)}>
          <SelectTrigger className="w-[160px] font-bold border-2 h-11 rounded-xl">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ENABLED">Enabled</SelectItem>
            <SelectItem value="DISABLED">Disabled</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="BETA">Beta</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(v) => handleFilter("scope", v)}>
          <SelectTrigger className="w-[160px] font-bold border-2 h-11 rounded-xl">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <SelectValue placeholder="Scope" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Scopes</SelectItem>
            <SelectItem value="GLOBAL">Global</SelectItem>
            <SelectItem value="ORGANIZATION">Organization</SelectItem>
            <SelectItem value="PLAN">Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
