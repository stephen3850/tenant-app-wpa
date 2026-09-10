import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Users,
  UserPlus,
  Building2,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FieldOfficersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // Fetch Field Officers (Users with role FIELD_OFFICER)
  const fieldOfficers = await db.user.findMany({
    where: {
      organizationId,
      userRoles: {
        some: {
          role: {
            name: "FIELD_OFFICER"
          }
        }
      }
    },
    include: {
      managedProperties: true,
      caretakerProperties: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalAssignedProperties = await db.property.count({
    where: {
      organizationId,
      OR: [
        { managerId: { not: null } },
        { caretakerId: { not: null } }
      ]
    }
  });

  const totalUnassignedProperties = await db.property.count({
    where: {
      organizationId,
      managerId: null,
      caretakerId: null
    }
  });

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-[#F8F9FB] min-h-screen font-inter">
      {/* Header Section */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#12B76A] uppercase tracking-[0.2em]">TEAM</p>
          <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Field Officers</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Manage property officers and their assigned properties.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 rounded-lg border-[#DCE3EA] text-[#1E293B] font-bold text-[11px] gap-2 px-4 shadow-sm" asChild>
            <Link href="/users">
              <Users className="h-4 w-4" />
              Users
            </Link>
          </Button>
          <Button className="h-9 rounded-lg bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold text-[11px] gap-2 px-4 shadow-md shadow-[#56A600]/10 transition-all">
            <UserPlus className="h-4 w-4" />
            Add Field Officer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="FIELD OFFICERS" value={fieldOfficers.length.toString()} />
        <StatCard label="ASSIGNED PROPERTIES" value={totalAssignedProperties.toString()} />
        <StatCard label="UNASSIGNED PROPERTIES" value={totalUnassignedProperties.toString()} />
      </div>

      {/* Table Section */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-[#F2F4F7] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
              <Input
                placeholder="Search field officers..."
                className="pl-9 h-9 text-[11px] border-[#E2E8F0] rounded-lg focus-visible:ring-[#56A600]/20"
              />
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="h-9 text-[11px] font-bold border-[#E2E8F0] gap-2">
                 <Shield className="h-3.5 w-3.5" />
                 All Roles
               </Button>
            </div>
          </div>
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#F2F4F7]">
                  <th className="px-6 py-4 text-[10px] font-black text-[#667085] uppercase tracking-wider">Field Officer</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#667085] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#667085] uppercase tracking-wider">Assigned Properties</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#667085] uppercase tracking-wider text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7]">
                {fieldOfficers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-[11px] font-medium text-[#64748B]">No Field Officers yet.</p>
                    </td>
                  </tr>
                ) : (
                  fieldOfficers.map((officer: any) => {
                    const propertyCount = (officer.managedProperties?.length || 0) + (officer.caretakerProperties?.length || 0);
                    return (
                      <tr key={officer.id} className="hover:bg-[#F9FAFB]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#12B76A] font-bold text-xs border border-[#12B76A]/10">
                              {officer.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="text-[12px] font-bold text-[#1F2937]">{officer.name}</p>
                              <p className="text-[10px] text-[#64748B]">{officer.status}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-medium text-[#1F2937] flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-[#94A3B8]" /> {officer.email}
                            </p>
                            <p className="text-[11px] font-medium text-[#1F2937] flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-[#94A3B8]" /> {officer.phone || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[10px] font-bold text-[#64748B] border-[#DCE3EA] rounded-md px-2 py-0.5">
                            {propertyCount} {propertyCount === 1 ? 'Property' : 'Properties'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-[11px] font-medium text-[#64748B]">
                            {new Date(officer.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Custom Horizontal Scroll Bar visual (matches image) */}
            <div className="px-4 py-2 border-t border-[#F2F4F7] bg-[#F9FAFB]/30 flex items-center justify-between">
               <ChevronLeft className="h-3 w-3 text-[#94A3B8]" />
               <div className="flex-1 mx-4 h-1.5 bg-[#E2E8F0] rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-full bg-[#94A3B8] rounded-full opacity-50"></div>
               </div>
               <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-white border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-5 space-y-1">
        <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-black text-[#1E293B]">{value}</h3>
      </CardContent>
    </Card>
  );
}
