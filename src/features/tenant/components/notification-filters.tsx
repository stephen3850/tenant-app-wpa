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
import { NotificationPriority } from "@prisma/client";
import { SearchIcon, XIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NOTIFICATION_TYPES = [
  { value: "ALL", label: "All Types" },
  { value: "INVOICE_ISSUED", label: "Invoices" },
  { value: "PAYMENT_CONFIRMED", label: "Payments" },
  { value: "RECEIPT_GENERATED", label: "Receipts" },
  { value: "LEASE_EXPIRY", label: "Lease Expiry" },
  { value: "RENEWAL_OFFER", label: "Renewals" },
  { value: "MAINTENANCE_UPDATE", label: "Maintenance" },
  { value: "DOCUMENT_SHARED", label: "Documents" },
  { value: "ANNOUNCEMENT_REMINDER", label: "Announcements" },
  { value: "SECURITY_NOTICE", label: "Security" },
  { value: "SYSTEM", label: "System" },
];

export function NotificationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/notifications?${params.toString()}`);
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
    router.push("/notifications");
  };

  const hasActiveFilters = searchParams.get("type") ||
                          searchParams.get("priority") ||
                          searchParams.get("search") ||
                          searchParams.get("isRead") ||
                          searchParams.get("isArchived");

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-9 bg-white"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className={isExpanded ? "bg-slate-100" : ""}
        >
          <SlidersHorizontalIcon className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Type</label>
            <Select
              defaultValue={searchParams.get("type") || "ALL"}
              onValueChange={(val) => updateFilters("type", val)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Priority</label>
            <Select
              defaultValue={searchParams.get("priority") || "ALL"}
              onValueChange={(val) => updateFilters("priority", val)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                {Object.values(NotificationPriority).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Status</label>
            <Select
              defaultValue={searchParams.get("isRead") || "ALL"}
              onValueChange={(val) => updateFilters("isRead", val)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="false">Unread</SelectItem>
                <SelectItem value="true">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">View</label>
            <Select
              defaultValue={searchParams.get("isArchived") || "false"}
              onValueChange={(val) => updateFilters("isArchived", val)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Inbox" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Inbox</SelectItem>
                <SelectItem value="true">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
