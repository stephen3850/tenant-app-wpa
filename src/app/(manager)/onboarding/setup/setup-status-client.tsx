"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  UserCog,
  Landmark,
  Building2,
  Home,
  Wallet,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Settings
} from "lucide-react";
import Link from "next/link";

export function SetupStatusClient({ data }: { data: any }) {
  const steps = data.progress.steps.slice(0, 6); // Take first 6 as per screenshot
  const completedCount = steps.filter((s: any) => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[#98A2B3] uppercase tracking-[0.2em]">SETUP STATUS</p>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-[#1F2937] tracking-tight">Set up your owner workspace</h1>
                <span className="bg-[#F0FDF4] text-[#12B76A] px-3 py-1 rounded-full text-[12px] font-black border border-[#DCFCE7]">
                  {percentage}%
                </span>
              </div>
              <p className="text-sm font-medium text-[#667085] max-w-2xl">
                {completedCount} of {steps.length} setup steps completed. Follow the next open step and the system will be ready for rent, deposits, and payments.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 shrink-0">
              <div className="flex items-center gap-20">
                <span className="text-[11px] font-bold text-[#98A2B3] uppercase tracking-wider">Progress</span>
                <span className="text-[12px] font-black text-[#1F2937]">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2 w-64 bg-[#F2F4F7] [&>div]:bg-[#10B981]" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step: any) => (
          <Card key={step.id} className={cn(
            "border border-[#E5EAF0] shadow-none rounded-2xl bg-white transition-all duration-300 hover:shadow-md hover:border-[#DCE3EA]",
            step.completed && "bg-[#F0FDF4]/30 border-[#DCFCE7]"
          )}>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  step.completed ? "bg-[#DCFCE7] text-[#56A600]" : "bg-[#F3F4F6] text-[#9CA3AF]"
                )}>
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <StepIcon iconName={step.icon} />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#1F2937] leading-tight">{step.label}</h3>
                  <p className="text-[11px] font-medium text-[#667085] leading-relaxed line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F2F4F7]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#64748B]">
                    {step.completed ? "Ready" : "Setup needed"}
                  </span>
                </div>
                <Link
                  href={step.href}
                  className={cn(
                    "text-xs font-black transition-all hover:translate-x-0.5",
                    "text-[#56A600] hover:text-[#4a8e00]"
                  )}
                >
                  {step.completed ? "Done" : step.action}
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StepIcon({ iconName }: { iconName: string }) {
  switch (iconName) {
    case "Business": return <UserCog className="h-6 w-6" />;
    case "Bank": return <Landmark className="h-6 w-6" />;
    case "Property": return <Building2 className="h-6 w-6" />;
    case "Unit": return <Home className="h-6 w-6" />;
    case "Wallet": return <Receipt className="h-5 w-5" />;
    case "Tenant": return <Users className="h-6 w-6" />;
    case "Lease": return <FileText className="h-6 w-6" />;
    case "Invoice": return <Receipt className="h-6 w-6" />;
    case "Payment": return <CreditCard className="h-6 w-6" />;
    default: return <Home className="h-6 w-6" />;
  }
}
