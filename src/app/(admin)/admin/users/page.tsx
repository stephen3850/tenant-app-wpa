import { getUsers } from "@/actions/user-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  Building2,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default async function UsersDirectoryPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const { users, total } = await getUsers(params);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global User Directory</h1>
          <p className="text-slate-500 font-medium">Manage and audit users across all organizations.</p>
        </div>
        <div className="flex gap-4">
           {/* Export Button Placeholder */}
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search users by name, email, or organization..." className="pl-10 font-medium border-slate-200 focus-visible:ring-slate-900" />
          </div>
          <Button variant="outline" className="font-bold border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">User Identity</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Organization</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Security</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Joined Date</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                       <UserIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 leading-none mb-1">{user.name || "Unnamed User"}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {user.organization?.name || "No Organization"}
                  </div>
                </TableCell>
                <TableCell>
                   <StatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                    <div className="flex gap-1.5">
                        {user.mfaEnabled ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-bold text-[9px] uppercase">MFA</Badge>
                        ) : (
                            <Badge variant="outline" className="bg-slate-100 text-slate-400 border-slate-200 font-bold text-[9px] uppercase">NO MFA</Badge>
                        )}
                        {user.emailVerified ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        ) : (
                            <ShieldAlert className="w-4 h-4 text-rose-400" />
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-slate-500 text-xs font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 font-bold">
                      <DropdownMenuLabel>User Management</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Security Logs</DropdownMenuItem>
                      <DropdownMenuItem className="text-rose-600">Impersonate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INVITED: "bg-blue-50 text-blue-700 border-blue-200",
    SUSPENDED: "bg-rose-50 text-rose-700 border-rose-200",
    LOCKED: "bg-orange-50 text-orange-700 border-orange-200",
    ARCHIVED: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <Badge variant="outline" className={`${styles[status] || styles.ACTIVE} font-bold px-2.5 py-0.5`}>
      {status}
    </Badge>
  );
}
