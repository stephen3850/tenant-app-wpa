"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  User,
  Building2,
  Home,
  CreditCard,
  Paperclip,
  History,
  Activity,
  Calendar,
  Clock,
  AlertCircle
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { LeaseStatusBadge } from "./lease-status-badge";
import { Button } from "@/components/ui/button";

interface LeaseDetailsProps {
  lease: any;
}

export function LeaseDetails({ lease }: LeaseDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{lease.leaseNumber}</h1>
            <LeaseStatusBadge status={lease.status} />
          </div>
          <p className="text-muted-foreground flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(lease.startDate)} to {lease.endDate ? formatDate(lease.endDate) : "Open-ended"}
          </p>
        </div>
        <div className="flex gap-4 items-center">
           <div className="text-right">
             <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Monthly Rent</p>
             <p className="text-2xl font-bold text-blue-600">{formatCurrency(lease.monthlyRent)}</p>
           </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview"><FileText className="h-4 w-4 mr-2" /> Overview</TabsTrigger>
          <TabsTrigger value="financial"><CreditCard className="h-4 w-4 mr-2" /> Financial Terms</TabsTrigger>
          <TabsTrigger value="parties"><User className="h-4 w-4 mr-2" /> Parties & Unit</TabsTrigger>
          <TabsTrigger value="documents"><Paperclip className="h-4 w-4 mr-2" /> Documents</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2" /> History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card>
               <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Term Months</CardTitle></CardHeader>
               <CardContent><div className="text-xl font-bold">{lease.leaseTermMonths || "N/A"} Months</div></CardContent>
             </Card>
             <Card>
               <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Notice Period</CardTitle></CardHeader>
               <CardContent><div className="text-xl font-bold">{lease.noticePeriodDays} Days</div></CardContent>
             </Card>
             <Card>
               <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Billing Day</CardTitle></CardHeader>
               <CardContent><div className="text-xl font-bold">Day {lease.billingDay} of Month</div></CardContent>
             </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Key Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Move-in Date</span>
                  <span className="font-medium">{lease.moveInDate ? formatDate(lease.moveInDate) : "TBD"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Move-out Date</span>
                  <span className="font-medium">{lease.moveOutDate ? formatDate(lease.moveOutDate) : "TBD"}</span>
                </div>
                {lease.terminationReason && (
                   <div className="bg-red-50 p-3 rounded-lg flex gap-3 text-red-700 text-sm">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-bold">Termination Reason</p>
                        <p>{lease.terminationReason}</p>
                      </div>
                   </div>
                )}
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Payment Frequency</span>
                  <span className="font-medium">{lease.paymentFrequency}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-medium">{formatDate(lease.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
           <Card>
             <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
             <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="text-xl font-bold">{formatCurrency(lease.monthlyRent)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Security Deposit</p>
                    <p className="text-xl font-bold">{formatCurrency(lease.securityDeposit)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Service Charge</p>
                    <p className="text-xl font-bold">{formatCurrency(lease.serviceCharge)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Late Fee</p>
                    <p className="text-xl font-bold">{formatCurrency(lease.lateFee)}</p>
                  </div>
                </div>
                {/* Invoices sub-table could go here */}
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="parties" className="mt-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <CardTitle>Tenant Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xl font-bold">{lease.tenant.firstName} {lease.tenant.lastName}</p>
                  <p className="text-sm text-muted-foreground">{lease.tenant.phone}</p>
                  <p className="text-sm text-muted-foreground">{lease.tenant.email}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <Home className="h-5 w-5 text-green-500" />
                  <CardTitle>Unit & Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xl font-bold">Unit {lease.unit.unitNumber}</p>
                  <p className="text-sm font-medium">{lease.property.propertyName}</p>
                  <p className="text-sm text-muted-foreground">{lease.property.address}</p>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
           <Card>
             <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg bg-slate-50">
                  <Paperclip className="h-10 w-10 text-slate-300 mb-4" />
                  {lease.signedLeaseUrl ? (
                    <Button variant="outline" asChild>
                      <a href={lease.signedLeaseUrl} target="_blank" rel="noopener noreferrer">Download Signed Lease</a>
                    </Button>
                  ) : (
                    <p className="text-muted-foreground">No documents uploaded yet.</p>
                  )}
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
           <Card>
             <CardHeader><CardTitle>Lease Timeline</CardTitle></CardHeader>
             <CardContent>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <div>
                        <p className="font-bold">Lease Created</p>
                        <p className="text-sm text-muted-foreground">{formatDate(lease.createdAt)}</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2 shrink-0" />
                      <div>
                        <p className="font-bold">Lease Started</p>
                        <p className="text-sm text-muted-foreground">{formatDate(lease.startDate)}</p>
                      </div>
                   </div>
                   {lease.status === "TERMINATED" && (
                      <div className="flex gap-4">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2 shrink-0" />
                        <div>
                          <p className="font-bold">Lease Terminated</p>
                          <p className="text-sm text-muted-foreground">{formatDate(lease.moveOutDate || lease.updatedAt)}</p>
                        </div>
                      </div>
                   )}
                </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
