"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeaseFormSchema, LeaseFormValues } from "../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaseStatus } from "@prisma/client";

interface LeaseFormProps {
  properties: { id: string, propertyName: string }[];
  units: { id: string, unitNumber: string, propertyId: string, monthlyRent: number, securityDeposit: number }[];
  tenants: { id: string, firstName: string, lastName: string }[];
  initialData?: Partial<LeaseFormValues>;
  onSubmit: (values: LeaseFormValues) => void;
  isLoading?: boolean;
}

export function LeaseForm({
  properties,
  units,
  tenants,
  initialData,
  onSubmit,
  isLoading
}: LeaseFormProps) {
  const form = useForm<LeaseFormValues>({
    resolver: zodResolver(LeaseFormSchema),
    defaultValues: initialData || {
      leaseNumber: `LS-${Math.floor(Math.random() * 10000)}`,
      monthlyRent: 0,
      securityDeposit: 0,
      serviceCharge: 0,
      lateFee: 0,
      billingDay: 1,
      paymentFrequency: "MONTHLY",
      noticePeriodDays: 30,
      status: LeaseStatus.ACTIVE,
    },
  });

  const selectedPropertyId = form.watch("propertyId");
  const selectedUnitId = form.watch("unitId");
  const filteredUnits = units.filter(u => u.propertyId === selectedPropertyId);

  // Auto-populate rent and deposit when unit is selected
  React.useEffect(() => {
    if (selectedUnitId) {
      const selectedUnit = units.find(u => u.id === selectedUnitId);
      if (selectedUnit) {
        form.setValue("monthlyRent", selectedUnit.monthlyRent);
        form.setValue("securityDeposit", selectedUnit.securityDeposit);
      }
    }
  }, [selectedUnitId, units, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
             <h3 className="text-lg font-semibold border-b pb-2">Identification & Parties</h3>
             <FormField
                control={form.control}
                name="leaseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lease Number</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {properties.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.propertyName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedPropertyId}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredUnits.map(u => (
                          <SelectItem key={u.id} value={u.id}>{u.unitNumber}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tenants.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          <div className="space-y-6">
             <h3 className="text-lg font-semibold border-b pb-2">Financial Terms</h3>
             <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="monthlyRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rent</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceCharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Charge</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Day (1-31)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
             <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Duration & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl><Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl><Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(LeaseStatus).map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Lease"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
