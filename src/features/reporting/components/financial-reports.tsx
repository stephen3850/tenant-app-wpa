"use client";

// Touch
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Send, Eye } from "lucide-react";
import { getIncomeStatement } from "../actions/report-actions";
import { useState } from "react";
import { toast } from "sonner";

export function FinancialReports() {
  const reports = [
    { id: "income_statement", name: "Income Statement", description: "Summary of income and expenses for a period." },
    { id: "p_and_l", name: "Profit & Loss Statement", description: "Detailed P&L with category breakdown." },
    { id: "rent_roll", name: "Rent Roll Report", description: "Complete list of units, tenants, and rental amounts." },
    { id: "ar_aging", name: "Accounts Receivable Aging", description: "Track overdue rent by time period." },
    { id: "revenue_property", name: "Revenue by Property", description: "Compare financial performance across properties." },
    { id: "deposit_liability", name: "Deposit Liability Report", description: "Total security deposits held in trust." },
  ];

  const handleGenerate = async (id: string) => {
    toast.promise(
      // Example for Income Statement
      id === "income_statement"
        ? (getIncomeStatement(new Date(new Date().getFullYear(), 0, 1), new Date()) as Promise<any>)
        : Promise.resolve(),
      {
        loading: `Generating ${id.replace("_", " ")}...`,
        success: "Report generated successfully",
        error: "Failed to generate report",
      }
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Card key={report.id} className="border-2 shadow-sm hover:border-slate-300 transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-black">{report.name}</CardTitle>
            </div>
            <CardDescription className="font-medium text-slate-500">
              {report.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2 pt-2">
            <Button className="flex-1 bg-slate-900 font-bold" onClick={() => handleGenerate(report.id)}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
            <Button variant="outline" size="icon" className="border-2">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-2">
              <Send className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
