"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Mail, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export function OwnerStatementList() {
  const statements = [
    { id: "1", number: "STMT-2026-05", period: "May 2026", revenue: 450000, expenses: 125000, net: 325000, status: "PUBLISHED" },
    { id: "2", number: "STMT-2026-04", period: "April 2026", revenue: 450000, expenses: 98000, net: 352000, status: "PUBLISHED" },
    { id: "3", number: "STMT-2026-03", period: "March 2026", revenue: 450000, expenses: 110000, net: 340000, status: "PUBLISHED" },
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-slate-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Statement #</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Period</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Revenue</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Expenses</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs">Net Payout</TableHead>
            <TableHead className="font-black text-slate-900 uppercase text-xs text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements.map((stmt) => (
            <TableRow key={stmt.id} className="hover:bg-slate-50/50">
              <TableCell className="font-black text-slate-900">{stmt.number}</TableCell>
              <TableCell className="font-medium text-slate-500">{stmt.period}</TableCell>
              <TableCell className="font-bold text-emerald-600">{formatCurrency(stmt.revenue)}</TableCell>
              <TableCell className="font-bold text-rose-600">({formatCurrency(stmt.expenses)})</TableCell>
              <TableCell className="font-black text-slate-900">{formatCurrency(stmt.net)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
