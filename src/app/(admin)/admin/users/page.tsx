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

export default async function UsersDirectoryPage({ searchParams }: any) {
  const { users, total } = await getUsers(searchParams);

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

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, email or ID..."
            className="pl-10 border-slate-200 bg-slate-50/50"
          />
        </div>
        <Button variant="outline" className="border-slate-200 font-bold">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">User</TableHead>
              <TableHead className="font-bold text-slate-700">Organization</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">MFA</TableHead>
              <TableHead className="font-bold text-slate-700">Last Login</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                      {user.name ? user.name[0] : user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{user.name || "N/A"}</div>
                      <div className="text-xs text-slate-500 font-medium">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {user.organization?.name || "Platform"}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                  {user.mfaEnabled ? (
                    <div className="flex items-center text-emerald-600 gap-1 font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center text-rose-500 gap-1 font-bold text-xs uppercase tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Disabled
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-500">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-rose-600 font-bold">Suspend User</DropdownMenuItem>
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
