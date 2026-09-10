"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPropertyUnits } from "@/actions/property-actions";
import { createFullTenantAction } from "../actions/tenant-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar, Plus, ChevronRight, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Tenant details", subtitle: "Name and contact." },
  { id: 2, title: "Unit & lease", subtitle: "Space, rent, dates." },
  { id: 3, title: "Initial invoice", subtitle: "Choose charges." },
  { id: 4, title: "Lease terms", subtitle: "Cycle, deposit, penalty." },
  { id: 5, title: "Optional details", subtitle: "Portal, VAT, notes." },
];

export function AddTenantForm({
  hasProperties = true,
  hasVacantUnits = true,
  properties = []
}: {
  hasProperties?: boolean,
  hasVacantUnits?: boolean,
  properties?: { id: string, name: string }[]
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [availableUnits, setAvailableUnits] = useState<{id: string, unitNumber: string, monthlyRent: number, securityDeposit: number}[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    leaseType: "Normal lease",
    property: "",
    unit: "",
    rent: "",
    dueDay: "",
    leaseStartDate: "",
    leaseEndDate: "",
    billingStartDate: "",
    createFirstInvoice: true,
    includeRent: true,
    includeServiceCharge: false,
    serviceChargeType: "Same as one month rent",
    serviceChargeAmount: "",
    paymentPlan: "Monthly",
    leaseDeposit: "",
    leaseGracePeriod: "",
    enableLeasePenalty: false,
    penaltyRate: "",
    penaltyCap: "",
    whatsapp: "",
    idNumber: "",
    taxPin: "",
    nextOfKinPhone: "",
    guarantorName: "",
    guarantorPhone: "",
    guarantorRelationship: "",
    portalLogin: "No login",
    autoCreateLogin: false,
    tenantPaysVat: false,
    vatPercentage: "16",
    narration: ""
  });

  const router = useRouter();

  // Fetch units when property changes
  React.useEffect(() => {
    async function fetchUnits() {
      if (!formData.property) {
        setAvailableUnits([]);
        return;
      }

      setIsLoadingUnits(true);
      try {
        const units = await getPropertyUnits(formData.property);
        // Only show vacant and active units
        const vacantUnits = units
          .filter((u: any) => u.occupancyStatus === "VACANT" && u.status === "ACTIVE")
          .map((u: any) => ({
            id: u.id,
            unitNumber: u.unitNumber,
            monthlyRent: Number(u.monthlyRent),
            securityDeposit: Number(u.securityDeposit)
          }));

        setAvailableUnits(vacantUnits);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setIsLoadingUnits(false);
      }
    }

    fetchUnits();
  }, [formData.property]);

  const nextStep = async () => {
    if (currentStep === 5) {
      if (!formData.name || !formData.phone || !formData.property || !formData.unit) {
        toast.error("Please fill in all required fields (Name, Phone, Property, Unit)");
        return;
      }

      setIsSaving(true);
      try {
        const result = await createFullTenantAction(formData);
        if (result.success) {
          toast.success("Tenant added successfully with active lease.");
          router.push("/tenants");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to save tenant");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error(error);
      } finally {
        setIsSaving(false);
      }
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Compact Vacant Units Alert */}
      {!hasProperties && (
        <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg p-3 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="text-[#92400E] text-[12px] font-medium leading-relaxed">
            No properties with vacant units are available.{" "}
            <Link href="/properties" className="text-[#3182CE] underline font-bold">
              Go to Properties
            </Link>{" "}
            to add a property and unit, then return here.
          </div>
        </div>
      )}

      {/* Step Indicators */}
      <div className="flex overflow-x-auto pb-2 md:grid md:grid-cols-5 gap-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 min-w-[160px] md:min-w-0 shrink-0",
              currentStep === step.id
                ? "bg-[#F0FDF4] border-[#BBF7D0] ring-1 ring-[#BBF7D0] shadow-sm"
                : "bg-white border-[#E2E8F0] hover:border-[#CBD5E0]"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border-2 shrink-0 transition-colors",
                currentStep === step.id
                  ? "bg-[#DCFCE7] border-[#86EFAC] text-[#166534]"
                  : "bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8]"
              )}
            >
              {step.id}
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={cn(
                  "text-[12px] font-bold truncate",
                  currentStep === step.id ? "text-[#166534]" : "text-[#1A202C]"
                )}
              >
                {step.title}
              </span>
              <span className="text-[10px] font-medium text-[#718096] truncate">
                {step.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Form Content Card */}
      <Card className="border-[#E2E8F0] shadow-sm rounded-xl bg-white overflow-hidden">
        <CardContent className="p-8 min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <StepHeader number={1} title="ADD NEW TENANT (CLEARED)" subtitle="Capture the person or business occupying the unit." />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Name" required value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                <FormField label="Phone" required value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A202C]">Email</label>
                  <Input
                    className="h-10 rounded-lg border-[#E2E8F0] text-xs font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <p className="text-[10px] font-medium text-[#94A3B8]">Optional now. Needed for portal login.</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <StepHeader number={2} title="UNIT & LEASE" subtitle="Choose the lease type first, then fill only the fields needed for that flow." />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#4A5568]">Lease type</label>
                  <Select value={formData.leaseType} onValueChange={(v) => setFormData({...formData, leaseType: v})}>
                    <SelectTrigger className="h-10 rounded-lg border-[#E2E8F0] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal lease">Normal lease</SelectItem>
                      <SelectItem value="Rent to own">Rent to own</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#4A5568]">Property</label>
                    <Select value={formData.property} onValueChange={(v) => setFormData({...formData, property: v, unit: ""})}>
                      <SelectTrigger className="h-10 rounded-lg border-[#E2E8F0] text-xs">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.length > 0 ? (
                          properties.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No properties found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#4A5568]">Unit</label>
                    <Select
                      value={formData.unit}
                      onValueChange={(v) => {
                        const unit = availableUnits.find(u => u.id === v);
                        setFormData({
                          ...formData,
                          unit: v,
                          rent: unit ? unit.monthlyRent.toString() : formData.rent,
                          leaseDeposit: unit ? unit.securityDeposit.toString() : formData.leaseDeposit
                        });
                      }}
                      disabled={!formData.property || isLoadingUnits}
                    >
                      <SelectTrigger className="h-10 rounded-lg border-[#E2E8F0] text-xs">
                        <SelectValue placeholder={isLoadingUnits ? "Loading..." : formData.property ? "Select unit" : "Select property first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUnits.length > 0 ? (
                          availableUnits.map(u => (
                            <SelectItem key={u.id} value={u.id}>{u.unitNumber}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            {formData.property ? "No vacant units available" : "Select property first"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField label="Rent" value={formData.rent} onChange={(v: string) => setFormData({...formData, rent: v})} />
                   <FormField label="Due day" value={formData.dueDay} onChange={(v: string) => setFormData({...formData, dueDay: v})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-[#4A5568]">Lease start date</label>
                      <Input type="date" className="h-10 rounded-lg border-[#E2E8F0] text-xs" value={formData.leaseStartDate} onChange={(e) => setFormData({...formData, leaseStartDate: e.target.value})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-[#4A5568]">Lease end date</label>
                      <Input type="date" className="h-10 rounded-lg border-[#E2E8F0] text-xs" value={formData.leaseEndDate} onChange={(e) => setFormData({...formData, leaseEndDate: e.target.value})} />
                   </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <StepHeader number={3} title="INITIAL INVOICE" subtitle="Choose exactly what should be included on the first invoice." />
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]/50 flex items-start gap-3">
                  <Checkbox
                    id="createFirstInvoice"
                    checked={formData.createFirstInvoice}
                    onCheckedChange={(c) => setFormData({...formData, createFirstInvoice: !!c})}
                  />
                  <div className="space-y-0.5 leading-none">
                    <label htmlFor="createFirstInvoice" className="text-[12px] font-bold text-[#1A202C] cursor-pointer">Create first invoice after saving</label>
                    <p className="text-[11px] text-[#718096]">Turn off to create invoices later.</p>
                  </div>
                </div>

                <div className="p-6 rounded-lg border border-[#E2E8F0] space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex items-start gap-3">
                      <Checkbox id="includeRent" checked={formData.includeRent} onCheckedChange={(c) => setFormData({...formData, includeRent: !!c})} />
                      <div className="space-y-0.5 leading-none">
                        <label htmlFor="includeRent" className="text-[12px] font-bold text-[#1A202C] cursor-pointer">Rent</label>
                        <p className="text-[11px] text-[#718096]">Uses rent amount and selected plan.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox id="includeServiceCharge" checked={formData.includeServiceCharge} onCheckedChange={(c) => setFormData({...formData, includeServiceCharge: !!c})} />
                        <div className="space-y-0.5 leading-none">
                          <label htmlFor="includeServiceCharge" className="text-[12px] font-bold text-[#1A202C] cursor-pointer">Service charge</label>
                          <p className="text-[11px] text-[#718096]">Defaults to one month rent.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Select value={formData.serviceChargeType} onValueChange={(v) => setFormData({...formData, serviceChargeType: v})}>
                          <SelectTrigger className="h-9 rounded-lg border-[#E2E8F0] bg-white text-[11px] flex-1"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="Same as one month rent">Same as one month rent</SelectItem><SelectItem value="Fixed amount">Fixed amount</SelectItem></SelectContent>
                        </Select>
                        <Input placeholder="Amount" className="h-9 rounded-lg border-[#E2E8F0] text-[11px] w-24" value={formData.serviceChargeAmount} onChange={(e) => setFormData({...formData, serviceChargeAmount: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[12px] font-bold text-[#1A202C]">More services</p>
                      <p className="text-[11px] text-[#718096]">Add one-time services.</p>
                    </div>
                    <Button variant="outline" className="h-8 px-3 rounded-lg border-[#E2E8F0] text-[11px] font-bold gap-1.5 bg-white shadow-sm">
                      <Plus className="h-3 w-3" /> Add service
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <StepHeader number={4} title="LEASE TERMS" subtitle="Set payment cycle, deposits, and overdue handling" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Payment Plan */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#4A5568]">Payment Plan</label>
                  <Select value={formData.paymentPlan} onValueChange={(v) => setFormData({...formData, paymentPlan: v})}>
                    <SelectTrigger className="h-11 rounded-lg border-[#E2E8F0] bg-white text-sm">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lease Deposit */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#4A5568]">Lease Deposit</label>
                  <Input
                    className="h-11 rounded-lg border-[#E2E8F0] text-sm"
                    placeholder="Uses unit deposit by default"
                    value={formData.leaseDeposit}
                    onChange={(e) => setFormData({...formData, leaseDeposit: e.target.value})}
                  />
                  <p className="text-[11px] text-[#94A3B8]">Stored on this lease and used for deposit coverage checks.</p>
                </div>

                {/* Lease Grace Period */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#4A5568]">Lease Grace Period (days)</label>
                  <Input
                    className="h-11 rounded-lg border-[#E2E8F0] text-sm"
                    placeholder="Uses property/business default"
                    value={formData.leaseGracePeriod}
                    onChange={(e) => setFormData({...formData, leaseGracePeriod: e.target.value})}
                  />
                  <p className="text-[11px] text-[#94A3B8]">Used for lease-specific overdue handling.</p>
                </div>

                {/* Penalty / Late Fee */}
                <div className="space-y-4">
                  <label className="text-[13px] font-bold text-[#4A5568]">Penalty / Late Fee</label>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="enablePenalty"
                      checked={formData.enableLeasePenalty}
                      onCheckedChange={(c) => setFormData({...formData, enableLeasePenalty: !!c})}
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="enablePenalty" className="text-[14px] font-bold text-[#1A202C] cursor-pointer">Enable lease penalty</label>
                      <p className="text-[11px] text-[#718096]">Overrides property late-fee setting for this lease.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className={cn("text-[12px] font-bold transition-colors", formData.enableLeasePenalty ? "text-[#4A5568]" : "text-[#94A3B8]")}>Penalty Rate (%)</label>
                      <Input
                        placeholder="e.g. 5"
                        disabled={!formData.enableLeasePenalty}
                        className="h-10 rounded-lg border-[#E2E8F0] text-sm disabled:bg-[#F8FAFC]"
                        value={formData.penaltyRate}
                        onChange={(e) => setFormData({...formData, penaltyRate: e.target.value})}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className={cn("text-[12px] font-bold transition-colors", formData.enableLeasePenalty ? "text-[#4A5568]" : "text-[#94A3B8]")}>Penalty Cap (%)</label>
                      <Input
                        placeholder="Optional cap"
                        disabled={!formData.enableLeasePenalty}
                        className="h-10 rounded-lg border-[#E2E8F0] text-sm disabled:bg-[#F8FAFC]"
                        value={formData.penaltyCap}
                        onChange={(e) => setFormData({...formData, penaltyCap: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <StepHeader number={5} title="OPTIONAL DETAILS" subtitle="Portal access, VAT, guarantor, and notes." />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <FormField label="WhatsApp Number" value={formData.whatsapp} onChange={(v: string) => setFormData({...formData, whatsapp: v})} />
                  <p className="text-[10px] font-medium text-[#94A3B8]">If blank, phone number is used.</p>
                </div>
                <FormField label="ID Number" placeholder="ID / Passport number" value={formData.idNumber} onChange={(v: string) => setFormData({...formData, idNumber: v})} />
                <FormField label="Tax PIN" placeholder="Tax PIN" value={formData.taxPin} onChange={(v: string) => setFormData({...formData, taxPin: v})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Next of Kin Phone" placeholder="+2547..." value={formData.nextOfKinPhone} onChange={(v: string) => setFormData({...formData, nextOfKinPhone: v})} />
                <FormField label="Guarantor Name" placeholder="Full name" value={formData.guarantorName} onChange={(v: string) => setFormData({...formData, guarantorName: v})} />
                <FormField label="Guarantor Phone" placeholder="+2547..." value={formData.guarantorPhone} onChange={(v: string) => setFormData({...formData, guarantorPhone: v})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Guarantor Relationship" placeholder="e.g. Parent, Employer" value={formData.guarantorRelationship} onChange={(v: string) => setFormData({...formData, guarantorRelationship: v})} />
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#4A5568]">Portal login</label>
                  <Select value={formData.portalLogin} onValueChange={(v) => setFormData({...formData, portalLogin: v})}>
                    <SelectTrigger className="h-10 rounded-lg border-[#E2E8F0] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No login">No login</SelectItem>
                      <SelectItem value="Existing user">Existing user</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="autoCreateLogin"
                    checked={formData.autoCreateLogin}
                    onCheckedChange={(c) => setFormData({...formData, autoCreateLogin: !!c})}
                  />
                  <div className="space-y-0.5 leading-none">
                    <label htmlFor="autoCreateLogin" className="text-[12px] font-bold text-[#1A202C] cursor-pointer">Auto-create login</label>
                    <p className="text-[10px] font-medium text-[#94A3B8]">Requires Email. Password = Phone. Link an existing tenant user above, or leave it as "No login" and enable auto-create.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                <h4 className="text-[11px] font-black text-[#1A202C] uppercase tracking-wider">VAT</h4>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="tenantPaysVat"
                    checked={formData.tenantPaysVat}
                    onCheckedChange={(c) => setFormData({...formData, tenantPaysVat: !!c})}
                  />
                  <div className="space-y-0.5 leading-none">
                    <label htmlFor="tenantPaysVat" className="text-[12px] font-bold text-[#1A202C] cursor-pointer">Tenant pays VAT</label>
                    <p className="text-[10px] font-medium text-[#94A3B8]">Default: No VAT.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <FormField
                      label="Tenant VAT (%)"
                      value={formData.vatPercentage}
                      disabled={!formData.tenantPaysVat}
                      onChange={(v: string) => setFormData({...formData, vatPercentage: v})}
                    />
                    <p className="text-[10px] font-medium text-[#94A3B8]">Leave blank to use the business default of 16%.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#1A202C]">Narration</label>
                <textarea
                  className="w-full min-h-[80px] p-3 rounded-lg border border-[#E2E8F0] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#56A600]/10 focus:border-[#56A600] transition-all"
                  placeholder="Internal notes or additional lease info..."
                  value={formData.narration}
                  onChange={(e) => setFormData({...formData, narration: e.target.value})}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2 pt-2 pb-6">
        <Button onClick={prevStep} variant="outline" className="h-9 px-6 rounded-lg border-[#E2E8F0] text-[#1A202C] font-bold text-xs bg-white hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
          {currentStep === 1 ? "Cancel" : "Back"}
        </Button>
        <Button
          onClick={nextStep}
          disabled={isSaving}
          className="h-9 px-8 rounded-lg bg-[#56A600] hover:bg-[#4a8e00] text-white font-black text-xs transition-all active:scale-95 shadow-lg shadow-[#56A600]/20 disabled:opacity-70"
        >
          {isSaving ? "Saving..." : currentStep === 5 ? "Save Tenant" : "Next"}
        </Button>
      </div>
    </div>
  );
}

function StepHeader({ number, title, subtitle }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-[#F0FDF4] border-2 border-[#BBF7D0] flex items-center justify-center text-[12px] font-black text-[#166534] shrink-0">{number}</div>
      <div className="space-y-0.5 pt-0.5">
        <h3 className="text-[11px] font-black text-[#1A202C] uppercase tracking-[0.12em]">{title}</h3>
        <p className="text-[12px] font-medium text-[#718096]">{subtitle}</p>
      </div>
    </div>
  );
}

function FormField({ label, required, value, onChange, placeholder, disabled, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <label className={cn(
        "text-[12px] font-bold flex items-center gap-1 transition-colors",
        disabled ? "text-[#94A3B8]" : "text-[#1A202C]"
      )}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        type={type}
        disabled={disabled}
        className="h-10 rounded-lg border-[#E2E8F0] focus-visible:ring-2 focus-visible:ring-[#56A600]/10 focus-visible:border-[#56A600] transition-all text-xs font-medium disabled:bg-[#F8FAFC]"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
