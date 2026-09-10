import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { userRepository } from "@/features/access/repositories/user-repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Shield,
  Settings2,
  FileDown,
  Filter,
  Users
} from "lucide-react";
import Link from "next/link";
import { serialize } from "@/lib/utils";
import { format } from "date-fns";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const rawUsers = await userRepository.findMany(user.organizationId);
  const users = serialize(rawUsers);

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-700 bg-[#F5F7FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-sm">
        <div>
          <p className="text-[10px] font-bold text-[#56A600] uppercase tracking-[0.2em] mb-0.5">TEAM</p>
          <h1 className="text-2xl font-black text-[#1F2937] tracking-tight">Users</h1>
          <p className="text-sm font-medium text-[#667085]">Manage users in your business and onboarding states.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-10 border-[#DCE3EA] text-[#1F2937] font-bold gap-2 rounded-lg text-xs">
            <Shield className="h-4 w-4" />
            <span>Role access</span>
          </Button>
          <Button variant="outline" className="h-10 border-[#DCE3EA] text-[#1F2937] font-bold gap-2 rounded-lg text-xs">
            <Settings2 className="h-4 w-4" />
            <span>Manage role permissions</span>
          </Button>
          <div className="bg-[#F0FDF4] px-3 py-2 rounded-lg border border-[#DCE3EA]">
             <span className="text-xs font-bold text-[#12B76A] whitespace-nowrap">{users.length} members</span>
          </div>
          <Button className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold gap-2 h-10 px-4 rounded-lg shadow-sm transition-all active:scale-95" asChild>
            <Link href="/users/new">
              <UserPlus className="h-4 w-4" />
              <span>Add user</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="border-[#DCE3EA] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="space-y-1.5 min-w-[240px]">
              <label className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest ml-0.5">ROLE</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9 text-xs font-medium border-[#DCE3EA] rounded-lg">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 flex-1">
               <Button className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-9 px-6 rounded-lg transition-all gap-2">
                 <Filter className="h-3.5 w-3.5" />
                 Apply
               </Button>
               <Button variant="outline" className="border-[#DCE3EA] text-[#1F2937] font-bold h-9 px-6 rounded-lg hover:bg-[#F9FAFB] transition-all">
                 Reset
               </Button>
               <Button variant="outline" className="border-[#DCE3EA] text-[#56A600] font-bold h-9 px-6 rounded-lg hover:bg-[#F0FDF4] transition-all gap-2">
                 <FileDown className="h-3.5 w-3.5" />
                 Export CSV
               </Button>
               <span className="text-[11px] font-medium text-[#98A2B3] ml-2">Showing {users.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <div className="border border-[#DCE3EA] rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-[#F9FAFB] border-b border-[#DCE3EA]">
            <TableRow className="hover:bg-transparent h-12">
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-6 w-12">#</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Name</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Email</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Phone</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Role</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4 text-center">Onboarding</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-4">Created</TableHead>
              <TableHead className="text-[11px] font-bold text-[#667085] uppercase tracking-wider px-6 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-sm font-medium text-[#98A2B3] italic">
                  No users found in your organization.
                </TableCell>
              </TableRow>
            ) : (
              users.map((item: any, index: number) => (
                <TableRow key={item.id} className="border-[#F5F7FA] h-14 group hover:bg-[#F9FAFB]/30">
                  <TableCell className="px-6 py-3 text-[11px] font-bold text-[#1F2937]">{index + 1}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-[11px] font-bold text-[#1F2937]">{item.name}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-[11px] font-medium text-[#667085]">{item.email}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-[11px] font-medium text-[#667085] tabular-nums">{item.phone || "-"}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-[11px] font-medium text-[#667085]">
                      {item.userRoles?.[0]?.role?.name || "Member"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="text-[11px] font-medium text-[#98A2B3]">_</span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-[11px] font-medium text-[#667085] tabular-nums">
                      {format(new Date(item.createdAt), "yyyy-MM-dd")}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <Button variant="outline" size="sm" className="h-8 border-[#DCE3EA] text-[#1F2937] font-bold text-[10px] rounded-lg px-4 hover:bg-[#F9FAFB]">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
