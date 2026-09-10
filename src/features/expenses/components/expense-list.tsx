"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ExpenseStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ExpenseList({ expenses }: { expenses: any[] }) {
  const getStatusColor = (status: ExpenseStatus) => {
    switch (status) {
      case "DRAFT": return "bg-slate-100 text-slate-800";
      case "SUBMITTED": return "bg-blue-100 text-blue-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      case "PAID": return "bg-emerald-100 text-emerald-800";
      case "VOIDED": return "bg-slate-300 text-slate-600";
      default: return "bg-gray-100";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                No expenses found.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-mono text-xs">{expense.expenseNumber}</TableCell>
                <TableCell>{format(new Date(expense.expenseDate), "dd MMM yyyy")}</TableCell>
                <TableCell>{expense.property.propertyName}</TableCell>
                <TableCell>{expense.vendor.name}</TableCell>
                <TableCell>{expense.category.name}</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(Number(expense.totalAmount))}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(expense.status)}>
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/expenses/${expense.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
