import { getSubscriptions } from "@/actions/subscription-billing";
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
import { format } from "date-fns";
import {
    MoreHorizontalIcon,
    ExternalLinkIcon,
    AlertCircleIcon,
    ClockIcon
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

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions({});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">All Subscriptions</h2>
          <p className="text-slate-500 font-medium mt-1">Monitor and manage every organization's billing status.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[250px] font-black text-[10px] uppercase tracking-widest text-slate-500">Organization</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Plan</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Amount</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Renewal Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900">{sub.organization.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {sub.id.slice(0, 8)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="font-bold border-slate-200 text-slate-600 capitalize">
                    {sub.plan.name}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={`font-black text-[10px] uppercase tracking-widest border-none ${
                    sub.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    sub.status === "TRIAL" ? "bg-blue-100 text-blue-700" :
                    sub.status === "PAST_DUE" ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-bold text-slate-900">
                  ${Number(sub.plan.price).toLocaleString()}
                  <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">/{sub.plan.interval === 'MONTHLY' ? 'mo' : 'yr'}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-700">
                      {sub.endDate ? format(new Date(sub.endDate), "MMM d, yyyy") : "N/A"}
                    </span>
                    {sub.status === "TRIAL" && sub.trialEndsAt && (
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">
                            Trial Ends: {format(new Date(sub.trialEndsAt), "MMM d")}
                        </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-full">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-black uppercase text-[10px] text-slate-400">Subscription Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                         <Link href={`/admin/billing/subscriptions/${sub.id}`} className="font-bold">View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-bold text-blue-600">Upgrade / Downgrade</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {sub.status === "TRIAL" && (
                          <DropdownMenuItem className="font-bold">Extend Trial</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="font-bold text-red-600">Cancel Subscription</DropdownMenuItem>
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
