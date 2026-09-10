"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  ChevronLeftIcon,
  CalendarIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function OwnerStatementsList({ statements }: { statements: any[] }) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/financials" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Financials
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Owner Statements</h1>
          <p className="text-slate-500 font-medium">Access your monthly financial reports and historical data.</p>
        </div>
        <Button className="font-bold bg-blue-600 hover:bg-blue-700">
           <CalendarIcon className="h-4 w-4 mr-2" /> Filter by Year
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Statement #</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Period</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-emerald-600">Revenue</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-red-600">Expenses</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Net Payout</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statements.map((stmt) => (
                <TableRow key={stmt.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-6 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                       <FileTextIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                       {stmt.statementNumber}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600 uppercase">
                    {format(new Date(stmt.startDate), "MMM yyyy")}
                  </TableCell>
                  <TableCell className="font-bold text-emerald-600">
                    <div className="flex items-center gap-1">
                       <ArrowUpRightIcon className="h-3 w-3" />
                       KES {Number(stmt.revenue).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-red-600">
                    <div className="flex items-center gap-1">
                       <ArrowDownRightIcon className="h-3 w-3" />
                       KES {Number(stmt.expenses).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-900">
                     KES {Number(stmt.closingBalance).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500 font-black">{stmt.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="sm" className="font-bold text-blue-600 hover:bg-blue-50" asChild>
                         <Link href={`/landlord/financials/statements/${stmt.id}`}>
                           <EyeIcon className="h-4 w-4 mr-1" /> View
                         </Link>
                       </Button>
                       <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:bg-slate-100">
                         <DownloadIcon className="h-4 w-4" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {statements.length === 0 && (
                <TableRow>
                   <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                         <FileTextIcon className="h-12 w-12 text-slate-200 mb-4" />
                         <h3 className="text-lg font-black text-slate-900">No statements yet</h3>
                         <p className="text-slate-500 font-medium">Statements are generated at the end of each billing cycle.</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
