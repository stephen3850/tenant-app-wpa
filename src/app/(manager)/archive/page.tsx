import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2, RotateCcw, Building, Home, FileText, Users, CreditCard, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { serialize } from "@/lib/utils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { ArchiveActions } from "./archive-actions";

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { type = "properties" } = await searchParams;
  const organizationId = (session.user as any).organizationId;
  const tenantDb = getTenantDb(organizationId);

  // Fetch counts for the grid
  const [propertyCount, unitCount, leaseCount] = await Promise.all([
    tenantDb.property.count({ where: { status: "ARCHIVED", deletedAt: null } }),
    tenantDb.unit.count({ where: { status: "INACTIVE", deletedAt: null } }),
    tenantDb.lease.count({ where: { status: "TERMINATED", deletedAt: null } }),
  ]);

  const archiveItems = [
    { id: "properties", label: "Properties", count: propertyCount, icon: Building },
    { id: "units", label: "Units", count: unitCount, icon: Home },
    { id: "leases", label: "Leases", count: leaseCount, icon: FileText },
    { id: "tenants", label: "Tenants", count: 0, icon: Users },
    { id: "invoices", label: "Invoices", count: 0, icon: FileText },
    { id: "payments", label: "Payments", count: 0, icon: CreditCard },
    { id: "expenses", label: "Expenses", count: 0, icon: TrendingDown },
  ];

  // Fetch records for the selected type
  let archivedRecords: any[] = [];
  if (type === "properties") {
    const records = await tenantDb.property.findMany({
      where: { status: "ARCHIVED", deletedAt: null },
      orderBy: { updatedAt: 'desc' }
    });
    archivedRecords = serialize(records);
  } else if (type === "units") {
    const records = await tenantDb.unit.findMany({
      where: { status: "INACTIVE", deletedAt: null },
      include: { property: true },
      orderBy: { updatedAt: 'desc' }
    });
    archivedRecords = serialize(records);
  } else if (type === "leases") {
    const records = await tenantDb.lease.findMany({
      where: { status: "TERMINATED", deletedAt: null },
      include: { property: true, tenant: true },
      orderBy: { updatedAt: 'desc' }
    });
    archivedRecords = serialize(records);
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-700 bg-[#F5F7FA] min-h-screen">
      {/* Header */}
      <Card className="border-[#DCE3EA] shadow-none rounded-xl overflow-hidden bg-white">
        <CardContent className="p-6">
          <h1 className="text-2xl font-black text-[#1F2937] tracking-tight">Archive</h1>
          <p className="text-sm font-medium text-[#667085] mt-1">
            Restore or permanently delete archived records in your account.
          </p>
        </CardContent>
      </Card>

      {/* Warning Banner */}
      <div className="bg-[#E67E22] rounded-xl p-6 text-white flex items-start gap-4">
        <div className="mt-1">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold leading-relaxed">
            Restoring nested records may also restore their required parent records. Permanently deleting a record cannot be undone.
          </p>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {archiveItems.map((item) => (
          <Link key={item.id} href={`?type=${item.id}`}>
            <Card className={cn(
              "border-[#DCE3EA] shadow-none rounded-xl overflow-hidden bg-white cursor-pointer transition-all hover:border-[#12B76A]/50 group",
              type === item.id && "border-[#12B76A] ring-1 ring-[#12B76A]/10"
            )}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-[#12B76A] transition-colors",
                    type === item.id && "bg-[#F0FDF4] text-[#12B76A]"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-[#98A2B3] uppercase tracking-widest">Archived</p>
                    <h4 className="text-sm font-black text-[#1F2937] tracking-tight">{item.label}</h4>
                  </div>
                </div>
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black tabular-nums border border-[#DCE3EA] bg-[#F9FAFB] text-[#1F2937]",
                  item.count > 0 && "bg-[#12B76A] text-white border-transparent shadow-sm shadow-[#12B76A]/20"
                )}>
                  {item.count}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Selected Type Details */}
      <Card className="border-[#DCE3EA] shadow-none rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="p-4 px-6 border-b border-[#F5F7FA] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F2937]">{archiveItems.find(i => i.id === type)?.label}</h3>
            <span className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">{archivedRecords.length} archived record(s)</span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F9FAFB]">
                <TableRow className="border-[#F5F7FA] h-10">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#98A2B3] px-6">Record</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#98A2B3] px-6">Details</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#98A2B3] px-6">Archived At</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#98A2B3] px-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-xs font-medium text-slate-400 italic">
                      No archived {type} found.
                    </TableCell>
                  </TableRow>
                ) : (
                  archivedRecords.map((record) => (
                    <TableRow key={record.id} className="border-[#F5F7FA] h-16 group hover:bg-[#F9FAFB]/50">
                      <TableCell className="px-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#1F2937]">
                            {type === 'properties' && record.propertyName}
                            {type === 'units' && `Unit ${record.unitNumber}`}
                            {type === 'leases' && record.leaseNumber}
                          </span>
                          <span className="text-[10px] font-medium text-[#98A2B3] capitalize">{type.slice(0, -1)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="space-y-0.5">
                          {type === 'properties' && (
                            <>
                              <p className="text-[10px] font-medium text-[#667085]">Code: <span className="font-bold">{record.propertyCode}</span></p>
                              <p className="text-[10px] font-medium text-[#667085]">Type: <span className="font-bold">{record.propertyType}</span></p>
                            </>
                          )}
                          {type === 'units' && (
                            <>
                              <p className="text-[10px] font-medium text-[#667085]">Property: <span className="font-bold">{record.property?.propertyName}</span></p>
                              <p className="text-[10px] font-medium text-[#667085]">Type: <span className="font-bold">{record.unitType}</span></p>
                            </>
                          )}
                          {type === 'leases' && (
                            <>
                              <p className="text-[10px] font-medium text-[#667085]">Property: <span className="font-bold">{record.property?.propertyName}</span></p>
                              <p className="text-[10px] font-medium text-[#667085]">Tenant: <span className="font-bold">{record.tenant?.firstName} {record.tenant?.lastName}</span></p>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <span className="text-[10px] font-bold text-[#667085]">
                          {format(new Date(record.updatedAt), "MMM d, yyyy HH:mm")}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <ArchiveActions id={record.id} type={type} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
