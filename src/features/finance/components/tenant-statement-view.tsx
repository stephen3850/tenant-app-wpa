"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format } from "date-fns";

export function TenantStatementView({ statement, tenantName }: { statement: any[], tenantName: string }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Tenant Statement</h2>
          <p className="text-muted-foreground">{tenantName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className={`text-xl font-bold ${Number(statement[statement.length - 1]?.balance || 0) > 0 ? "text-red-600" : "text-green-600"}`}>
            {formatCurrency(Number(statement[statement.length - 1]?.balance || 0))}
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statement.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap">{format(new Date(entry.createdAt), "dd MMM yyyy")}</TableCell>
                <TableCell className="text-xs font-mono">{entry.reference || "-"}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="text-right text-red-600">
                  {Number(entry.debit) > 0 ? formatCurrency(Number(entry.debit)) : ""}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {Number(entry.credit) > 0 ? formatCurrency(Number(entry.credit)) : ""}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(Number(entry.balance))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
