"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Home,
  User,
  FileText,
  Wrench,
  History,
  CreditCard,
  MapPin,
  Maximize2,
  BedDouble,
  Bath
} from "lucide-react";

interface UnitDetailsProps {
  unit: any;
}

export function UnitDetails({ unit }: UnitDetailsProps) {
  const activeLease = unit.leases?.find((l: any) => l.status === "ACTIVE");
  const tenant = activeLease?.tenant;

  const totalPayments = unit.leases?.reduce((total: number, lease: any) => {
    return total + lease.invoices?.reduce((invTotal: number, invoice: any) => {
      return invTotal + invoice.payments?.reduce((payTotal: number, payment: any) => {
        return payTotal + Number(payment.amount);
      }, 0);
    }, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{unit.unitNumber}</h1>
          <p className="text-muted-foreground flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {unit.property?.propertyName} - {unit.property?.address}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={unit.occupancyStatus === "OCCUPIED" ? "default" : "secondary"}>
            {unit.occupancyStatus}
          </Badge>
          <Badge variant={unit.status === "ACTIVE" ? "outline" : "destructive"}>
            {unit.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(unit.monthlyRent)}</div>
            <p className="text-xs text-muted-foreground">
              + {formatCurrency(unit.serviceCharge)} Service Charge
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unit Details</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center"><BedDouble className="h-4 w-4 mr-1" /> {unit.bedrooms || 0}</span>
              <span className="flex items-center"><Bath className="h-4 w-4 mr-1" /> {unit.bathrooms || 0}</span>
              <span className="flex items-center"><Maximize2 className="h-4 w-4 mr-1" /> {unit.squareFootage ? `${unit.squareFootage} sqft` : "N/A"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tenant</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {tenant ? (
              <div>
                <div className="font-bold">{tenant.firstName} {tenant.lastName}</div>
                <p className="text-xs text-muted-foreground">Since {formatDate(activeLease.startDate)}</p>
              </div>
            ) : (
              <div className="text-muted-foreground">No active tenant</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leases" className="w-full">
        <TabsList>
          <TabsTrigger value="leases"><FileText className="h-4 w-4 mr-2" /> Leases</TabsTrigger>
          <TabsTrigger value="maintenance"><Wrench className="h-4 w-4 mr-2" /> Maintenance</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="h-4 w-4 mr-2" /> Payments</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2" /> History</TabsTrigger>
        </TabsList>

        <TabsContent value="leases" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lease History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unit.leases?.map((lease: any) => (
                    <TableRow key={lease.id}>
                      <TableCell>{lease.tenant.firstName} {lease.tenant.lastName}</TableCell>
                      <TableCell>{formatDate(lease.startDate)}</TableCell>
                      <TableCell>{lease.endDate ? formatDate(lease.endDate) : "Ongoing"}</TableCell>
                      <TableCell>{formatCurrency(lease.monthlyRent)}</TableCell>
                      <TableCell>
                        <Badge variant={lease.status === "ACTIVE" ? "default" : "secondary"}>
                          {lease.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!unit.leases || unit.leases.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No lease history found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unit.tickets?.map((ticket: any) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.priority === "HIGH" || ticket.priority === "URGENT" ? "destructive" : "secondary"}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {(!unit.tickets || unit.tickets.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No maintenance requests found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-sm font-medium text-muted-foreground">Total Collected</div>
                <div className="text-2xl font-bold">{formatCurrency(totalPayments)}</div>
              </div>
              {/* More detailed payment table could go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
           {/* Activity Timeline would go here, fetching from AuditLog */}
           <Card>
             <CardHeader>
               <CardTitle>Activity Timeline</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground">Timeline view coming soon...</p>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
