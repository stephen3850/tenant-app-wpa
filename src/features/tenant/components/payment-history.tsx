"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DownloadIcon, FileTextIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function PaymentHistory({ payments }: { payments: any[] }) {
  const [search, setSearch] = useState("");

  const filteredPayments = payments.filter(p =>
    p.transactionRef?.toLowerCase().includes(search.toLowerCase()) ||
    p.receiptNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-lg">Payment History</CardTitle>
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reference..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-sm">{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium text-xs">{payment.transactionRef || "N/A"}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{payment.receiptNumber || "Processing"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold uppercase">{payment.method}</TableCell>
                  <TableCell className="font-bold">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "COMPLETED" ? "success" as any : "secondary"}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.receipt ? (
                        <Button variant="ghost" size="sm" asChild>
                            <a href={payment.receipt.receiptUrl} target="_blank" rel="noopener noreferrer">
                                <DownloadIcon className="h-4 w-4" />
                            </a>
                        </Button>
                    ) : (
                        <span className="text-[10px] text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
