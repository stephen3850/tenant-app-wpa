"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    MoreHorizontalIcon,
    ExternalLinkIcon,
    AlertCircleIcon,
    CheckCircle2Icon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function OrganizationsTable({ organizations }: { organizations: any[] }) {
  return (
    <Table>
      <TableHeader className="bg-slate-50/50">
        <TableRow className="hover:bg-transparent border-slate-100">
          <TableHead className="w-[300px] font-black text-[10px] uppercase tracking-widest">Organization</TableHead>
          <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Plan</TableHead>
          <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Status</TableHead>
          <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Usage</TableHead>
          <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Health</TableHead>
          <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Created</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org.id} className="hover:bg-slate-50/50 border-slate-50 group">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border shadow-sm">
                  <AvatarImage src={org.logo || ""} />
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold">
                    {org.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/admin/organizations/${org.id}`}
                    className="font-black text-sm text-slate-900 truncate hover:text-blue-600 transition-colors"
                  >
                    {org.name}
                  </Link>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                    {org.slug}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="font-bold border-slate-200 text-slate-600 capitalize">
                {org.subscription?.plan?.name || "Free"}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge
                className={`font-black text-[10px] uppercase tracking-widest border-none ${
                  org.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : org.status === "SUSPENDED"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {org.status}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
                <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900">{org._count.properties} Props • {org._count.tenants} Tenants</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{org._count.users} Users • {org._count.leases} Leases</span>
                </div>
            </TableCell>
            <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                    <span className={`text-xs font-black ${
                        org.healthScore >= 70 ? 'text-green-600' :
                        org.healthScore >= 40 ? 'text-orange-500' : 'text-red-600'
                    }`}>
                        {org.healthScore}%
                    </span>
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${
                                org.healthScore >= 70 ? 'bg-green-500' :
                                org.healthScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${org.healthScore}%` }}
                        />
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-center text-xs font-bold text-slate-500">
              {format(new Date(org.createdAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-full">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-black uppercase text-[10px] text-slate-400">Manage Org</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/organizations/${org.id}`} className="font-bold flex items-center">
                        <ExternalLinkIcon className="mr-2 h-4 w-4" /> Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="font-bold text-blue-600">
                      Login as Admin
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-bold text-red-600">
                      Suspend Organization
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
