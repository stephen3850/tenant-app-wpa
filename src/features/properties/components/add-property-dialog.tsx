"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, Upload, UserPlus } from "lucide-react";

import { createProperty, getLandlords } from "@/actions/property-actions";
import { useTenant } from "@/providers/tenant-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPropertyDialog({ open, onOpenChange }: AddPropertyDialogProps) {
  const router = useRouter();
  const { organizationId } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [landlords, setLandlords] = useState<any[]>([]);
  const [isNewLandlord, setIsNewLandlord] = useState(false);

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyPrefix: "",
    landlordName: "",
    landlordId: "",
    propertyType: "Apartment",
    location: "",
    numberOfFloors: "1",
    paybillNumber: "",
    accountFormat: "Unit number",
    bankName: "",
    accountNumber: "",
    customFormat: "",
    serviceChargeRate: "0",
    waterUnitRate: "",
    utilityDueRule: "Reading date",
    daysAfterReading: "",
    nextMonthDay: "",
    incomeTaxRate: "0",
    featuredImage: null as File | null,
  });

  useEffect(() => {
    if (open && organizationId) {
      getLandlords(organizationId).then(setLandlords).catch(console.error);
    }
  }, [open, organizationId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, featuredImage: e.target.files[0] });
    }
  };

  const handleSave = async () => {
    if (!formData.propertyName || !formData.propertyPrefix) {
      toast.error("Please fill in property name and prefix");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = null;

      if (formData.featuredImage) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.featuredImage!);
        });
      }

      const result = await createProperty({
        propertyName: formData.propertyName,
        propertyCode: formData.propertyPrefix,
        landlordName: isNewLandlord ? formData.landlordName : "",
        landlordId: isNewLandlord ? undefined : formData.landlordId,
        propertyType: formData.propertyType,
        address: formData.location || "N/A",
        city: formData.location || "N/A",
        county: "Nairobi",
        status: "ACTIVE",
        description: isNewLandlord ? `Landlord: ${formData.landlordName}` : "",
        paybillNumber: formData.paybillNumber,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountFormat: formData.accountFormat,
        customFormat: formData.customFormat,
        numberOfFloors: formData.numberOfFloors,
        serviceChargeRate: formData.serviceChargeRate,
        waterUnitRate: formData.waterUnitRate,
        utilityDueRule: formData.utilityDueRule,
        daysAfterReading: formData.daysAfterReading,
        nextMonthDay: formData.nextMonthDay,
        incomeTaxRate: formData.incomeTaxRate,
        featuredImage: imageUrl,
      });

      if (result.success && result.data) {
        toast.success("Property created successfully");
        onOpenChange(false);
        // Redirect to the property detail page
        router.push(`/properties/${result.data.id}?new=true`);
      } else {
        toast.error(result.error || "Failed to create property");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
        <DialogHeader className="p-6 border-b bg-white">
          <DialogTitle className="text-xl font-bold text-[#1F2937]">Add property</DialogTitle>
          <p className="text-xs font-medium text-[#667085] mt-1">
            Capture the building name and (optionally) assign to a landlord profile.
          </p>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-[#F8FAFC]">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Property Name</label>
              <Input
                placeholder="e.g. Parklands Plaza"
                className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Property Prefix</label>
              <Input
                placeholder="e.g. PKP"
                className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                value={formData.propertyPrefix}
                onChange={(e) => setFormData({ ...formData, propertyPrefix: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Landlord / Owner</label>
                <button
                  type="button"
                  onClick={() => setIsNewLandlord(!isNewLandlord)}
                  className="text-[9px] font-bold text-[#12B76A] hover:underline flex items-center gap-1"
                >
                  {isNewLandlord ? "Select Existing" : "+ New Landlord"}
                </button>
              </div>
              {isNewLandlord ? (
                <Input
                  placeholder="Enter new landlord name"
                  className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                  value={formData.landlordName}
                  onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                />
              ) : (
                <Select
                  value={formData.landlordId}
                  onValueChange={(v) => setFormData({ ...formData, landlordId: v })}
                >
                  <SelectTrigger className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm">
                    <SelectValue placeholder="Select a landlord" />
                  </SelectTrigger>
                  <SelectContent>
                    {landlords.length > 0 ? (
                      landlords.map((l) => (
                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No landlords found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Property Type</label>
              <Select
                value={formData.propertyType}
                onValueChange={(v) => setFormData({ ...formData, propertyType: v })}
              >
                <SelectTrigger className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Location</label>
              <Input
                placeholder="e.g. Upper Hill Road"
                className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Number of Floors</label>
              <Input
                type="number"
                className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                value={formData.numberOfFloors}
                onChange={(e) => setFormData({ ...formData, numberOfFloors: e.target.value })}
              />
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-transparent"
            >
              {isAdvancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1F2937]">Advanced details</span>
              <span className="text-[10px] font-medium text-[#718096] ml-2">Payment, image, rates...</span>
            </button>

            {isAdvancedOpen && (
              <div className="p-5 space-y-6 bg-[#F8FAFC]/50 border-t border-[#E2E8F0]">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-[#1F2937] uppercase tracking-tight">Payment instructions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Paybill Number</label>
                      <Input
                        placeholder="e.g. 123456"
                        className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                        value={formData.paybillNumber}
                        onChange={(e) => setFormData({ ...formData, paybillNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Account Format</label>
                      <Select
                        value={formData.accountFormat}
                        onValueChange={(v) => setFormData({ ...formData, accountFormat: v })}
                      >
                        <SelectTrigger className="h-11 rounded-2xl border-[#7DAAFE] bg-white text-sm ring-4 ring-[#7DAAFE]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="p-0 border border-[#E2E8F0] shadow-xl rounded-none">
                          <SelectItem value="Unit number" className="py-3 px-4 focus:bg-[#1D6AE5] focus:text-white data-[state=checked]:bg-[#1D6AE5] data-[state=checked]:text-white rounded-none [&>span:first-child]:hidden font-medium">Unit number</SelectItem>
                          <SelectItem value="Bank account # + unit number" className="py-3 px-4 focus:bg-[#1D6AE5] focus:text-white data-[state=checked]:bg-[#1D6AE5] data-[state=checked]:text-white rounded-none [&>span:first-child]:hidden font-medium">Bank account # + unit number</SelectItem>
                          <SelectItem value="Bank number" className="py-3 px-4 focus:bg-[#1D6AE5] focus:text-white data-[state=checked]:bg-[#1D6AE5] data-[state=checked]:text-white rounded-none [&>span:first-child]:hidden font-medium">Bank number</SelectItem>
                          <SelectItem value="Custom" className="py-3 px-4 focus:bg-[#1D6AE5] focus:text-white data-[state=checked]:bg-[#1D6AE5] data-[state=checked]:text-white rounded-none [&>span:first-child]:hidden font-medium">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pop up fields based on selection */}
                  {(formData.accountFormat === "Bank account # + unit number" || formData.accountFormat === "Bank number" || formData.accountFormat === "Custom") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-1 bg-white p-4 rounded-2xl border border-[#7DAAFE]/30">
                      {formData.accountFormat === "Bank account # + unit number" && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Bank Name</label>
                            <Input
                              placeholder="Enter bank name"
                              className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                              value={formData.bankName}
                              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Account Number</label>
                            <Input
                              placeholder="Enter bank account #"
                              className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                              value={formData.accountNumber}
                              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            />
                          </div>
                        </>
                      )}
                      {formData.accountFormat === "Bank number" && (
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Bank Number</label>
                          <Input
                            placeholder="Enter bank number"
                            className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                          />
                        </div>
                      )}
                      {formData.accountFormat === "Custom" && (
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Custom Description</label>
                          <Input
                            placeholder="Enter custom account format details"
                            className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                            value={formData.customFormat}
                            onChange={(e) => setFormData({ ...formData, customFormat: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Featured Image</label>
                  <div className="flex items-center h-12 w-full rounded-2xl border-2 border-[#7DAAFE] bg-white overflow-hidden shadow-sm">
                    <label className="h-full px-6 flex items-center bg-[#F1F5F9] border-r-2 border-[#7DAAFE] text-xs font-bold text-[#1F2937] cursor-pointer hover:bg-[#E2E8F0] transition-colors">
                      Choose File
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    <span className="px-6 text-[11px] font-medium text-[#475569]">
                      {formData.featuredImage ? formData.featuredImage.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-[#94A3B8] ml-1">Upload a cover photo for this property (optional).</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Service Charge (%)</label>
                    <Input
                      className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                      value={formData.serviceChargeRate}
                      onChange={(e) => setFormData({ ...formData, serviceChargeRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Water Unit Rate</label>
                    <Input
                      placeholder="e.g. 55.50"
                      className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                      value={formData.waterUnitRate}
                      onChange={(e) => setFormData({ ...formData, waterUnitRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Utility Due Rule</label>
                    <Select
                      value={formData.utilityDueRule}
                      onValueChange={(v) => setFormData({ ...formData, utilityDueRule: v })}
                    >
                      <SelectTrigger className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reading date">Reading date</SelectItem>
                        <SelectItem value="Fixed date">Fixed date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Days after reading</label>
                    <Input
                      placeholder="e.g. 7"
                      className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                      value={formData.daysAfterReading}
                      onChange={(e) => setFormData({ ...formData, daysAfterReading: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Next-Month Day</label>
                    <Input
                      placeholder="e.g. 5"
                      className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                      value={formData.nextMonthDay}
                      onChange={(e) => setFormData({ ...formData, nextMonthDay: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A5568]">Income Tax (%)</label>
                    <Input
                      className="h-11 rounded-2xl border-[#E2E8F0] bg-white text-sm"
                      value={formData.incomeTaxRate}
                      onChange={(e) => setFormData({ ...formData, incomeTaxRate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t bg-white flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 px-8 rounded-2xl border-[#E2E8F0] text-[#1F2937] font-bold text-xs hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-11 px-8 rounded-2xl bg-[#56A600] hover:bg-[#4a8e00] text-white font-black text-xs shadow-lg shadow-[#56A600]/20 disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save property"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
