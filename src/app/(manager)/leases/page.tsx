"use client";

import React from "react";
import { getLeases, getLeaseStats } from "@/features/leases/actions/lease-actions";
import { getProperties } from "@/actions/property-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RefreshCw, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function LeasesPage() {
  const [leases, setLeases] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>(null);
  const [properties, setProperties] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("VACATED"); // Set a default to match image's selected state

  const [filters, setFilters] = React.useState({
    search: "",
    status: "",
    propertyId: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leasesData, statsData, propertiesData] = await Promise.all([
        getLeases({
            search: filters.search,
            status: filters.status as any,
            propertyId: filters.propertyId
        }),
        getLeaseStats(),
        getProperties(),
      ]);
      setLeases(leasesData);
      setStats(statsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error("Failed to fetch leases data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilters = () => {
    fetchData();
  };

  const statCards = [
    { label: "ACTIVE", count: stats?.activeLeases || 0, color: "bg-[#56A600]", btnLabel: "View" },
    { label: "VACATED", count: 0, color: "bg-[#E67E22]", btnLabel: "View" },
    { label: "PENDING", count: 0, color: "bg-[#3498DB]", btnLabel: "View" },
    { label: "PENDING MOVE-OUT", count: 0, color: "bg-[#E67E22]", btnLabel: "View" },
    { label: "INACTIVE", count: stats?.expiredLeases || 0, color: "bg-[#2C3E50]", btnLabel: "View" },
    { label: "ALL STATUSES", count: leases.length, color: "bg-[#21A300]", btnLabel: "Reset" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-[#F5F7FA] min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-4 flex justify-between items-start shadow-sm">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#56A600]">PORTFOLIO</p>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Leases</h1>
          <p className="text-[11px] font-medium text-[#667085]">A clear ledger of tenant-unit relationships and lease status health.</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-[0.1em]">TOTAL LEASES</p>
          <p className="text-4xl font-black text-[#111827] leading-none">{leases.length}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, i) => (
          <div key={i} className={cn(
            "bg-white rounded-lg border border-[#DCE3EA] p-3 shadow-sm flex flex-col justify-between min-h-[90px] transition-all",
            activeTab === stat.label && "border-[#111827] ring-1 ring-[#111827]"
          )}>
            <div>
              <p className="text-[9px] font-bold text-[#98A2B3] uppercase tracking-wider leading-none">{stat.label}</p>
              <p className="text-2xl font-black text-[#111827] mt-1.5 leading-none">{stat.count}</p>
            </div>
            <div className="flex items-end justify-between mt-3">
              <p className="text-[8px] font-medium text-[#98A2B3] max-w-[60px] leading-tight">Filter leases by status.</p>
              <Button
                size="sm"
                className={cn("h-6 px-3 text-[9px] font-black text-white rounded-[4px] shadow-sm", stat.color)}
                onClick={() => setActiveTab(stat.label)}
              >
                {stat.btnLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Box */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[#1F2937] uppercase tracking-wider">SEARCH UNIT / PROPERTY</label>
            <Input
              placeholder="e.g. 101 or CIANDA"
              className="h-10 border-[#DCE3EA] bg-white rounded-md text-[11px] focus:ring-[#56A600]/10"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[#1F2937] uppercase tracking-wider">STATUS</label>
            <Select
                value={filters.status}
                onValueChange={(v) => setFilters({...filters, status: v === "all" ? "" : v})}
            >
              <SelectTrigger className="h-10 border-[#DCE3EA] bg-white rounded-md text-[11px] text-[#667085]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="TERMINATED">Vacated</SelectItem>
                <SelectItem value="DRAFT">Pending</SelectItem>
                <SelectItem value="EXPIRED">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[#1F2937] uppercase tracking-wider">PROPERTY</label>
            <Select
                value={filters.propertyId}
                onValueChange={(v) => setFilters({...filters, propertyId: v === "all" ? "" : v})}
            >
              <SelectTrigger className="h-10 border-[#DCE3EA] bg-white rounded-md text-[11px] text-[#667085]">
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
            className="bg-[#56A600] hover:bg-[#4a8e00] text-white text-[11px] font-black h-9 px-6 rounded-md flex gap-2 items-center"
            onClick={handleApplyFilters}
        >
          <Filter className="h-3.5 w-3.5" /> Apply
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#DCE3EA]">
                <th className="px-5 py-3 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider w-10">#</th>
                <th className="px-5 py-3 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Tenant</th>
                <th className="px-5 py-3 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Unit</th>
                <th className="px-5 py-3 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">Start date</th>
                <th className="px-5 py-3 text-[9px] font-black text-[#98A2B3] uppercase tracking-wider">End date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE3EA]">
              {leases.length > 0 ? leases.map((lease, index) => (
                <tr key={lease.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-5 py-3 text-[10px] font-bold text-[#111827]">{index + 1}</td>
                  <td className="px-5 py-3">
                    <div className="text-[11px] font-bold text-[#111827]">{lease.tenant.firstName} {lease.tenant.lastName}</div>
                  </td>
                  <td className="px-5 py-3 text-[11px] font-bold text-[#111827]">{lease.unit.unitNumber}</td>
                  <td className="px-5 py-3 text-right text-[11px] font-black text-[#111827]">
                    {formatCurrency(lease.monthlyRent)}
                  </td>
                  <td className="px-5 py-3 text-[11px] font-bold text-[#111827]">{lease.status}</td>
                  <td className="px-5 py-3 text-[11px] font-bold text-[#111827]">{formatDate(lease.startDate)}</td>
                  <td className="px-5 py-3 text-[11px] font-bold text-[#111827]">{lease.endDate ? formatDate(lease.endDate) : "-"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <p className="text-[11px] font-medium text-[#667085]">No leases on record.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
