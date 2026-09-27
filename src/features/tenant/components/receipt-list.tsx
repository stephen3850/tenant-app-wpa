"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileCheckIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { tenantRoutes } from "@/lib/routes";

export function ReceiptList({ receipts }: { receipts: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileCheckIcon className="h-5 w-5 text-green-600" />
          Payment Receipts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No receipts found.
                </TableCell>
              </TableRow>
            ) : (
              receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">
                    {receipt.payment?.receiptNumber || `RCP-${receipt.id.slice(0, 8).toUpperCase()}`}
                  </TableCell>
                  <TableCell>{formatDate(receipt.createdAt)}</TableCell>
                  <TableCell className="text-xs font-semibold uppercase">
                    {receipt.payment?.method}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {receipt.payment?.transactionRef || "N/A"}
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(receipt.payment?.amount)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="outline" size="sm" className="h-8 rounded-lg font-bold text-xs" asChild>
                      <Link href={tenantRoutes.receipt(receipt.id)}>
                        <EyeIcon className="h-3.5 w-3.5 mr-1" /> View Receipt
                      </Link>
                    </Button>
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
