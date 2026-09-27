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
import { ChevronDown, ChevronRight, Upload, Loader2 } from "lucide-react";
import { updateProperty, getLandlords } from "@/actions/property-actions";
import { useTenant } from "@/providers/tenant-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditPropertyDialogProps {
  property: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPropertyDialog({ property, open, onOpenChange }: EditPropertyDialogProps) {
  const router = useRouter();
  const { organizationId } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [landlords, setLandlords] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    propertyName: property?.propertyName || "",
    propertyPrefix: property?.propertyCode || "",
    landlordId: property?.landlordId || "",
    propertyType: property?.propertyType || "Apartment",
    location: property?.address || "",
    numberOfFloors: property?.numberOfFloors?.toString() || "1",
    paybillNumber: property?.paybillNumber || "",
    accountFormat: property?.accountFormat || "Unit number",
    bankName: property?.bankName || "",
    accountNumber: property?.accountNumber || "",
    customFormat: property?.customFormat || "",
    serviceChargeRate: property?.serviceChargeRate?.toString() || "0",
    waterUnitRate: property?.waterUnitRate?.toString() || "",
    utilityDueRule: property?.utilityDueRule || "Reading date",
    daysAfterReading: property?.daysAfterReading?.toString() || "",
    nextMonthDay: property?.nextMonthDay?.toString() || "",
    incomeTaxRate: property?.incomeTaxRate?.toString() || "0",
    featuredImage: null as File | null,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        propertyName: property.propertyName || "",
        propertyPrefix: property.propertyCode || "",
        landlordId: property.landlordId || "",
        propertyType: property.propertyType || "Apartment",
        location: property.address || "",
        numberOfFloors: property.numberOfFloors?.toString() || "1",
        paybillNumber: property.paybillNumber || "",
        accountFormat: property.accountFormat || "Unit number",
        bankName: property.bankName || "",
        accountNumber: property.accountNumber || "",
        customFormat: property.customFormat || "",
        serviceChargeRate: property.serviceChargeRate?.toString() || "0",
        waterUnitRate: property.waterUnitRate?.toString() || "",
        utilityDueRule: property.utilityDueRule || "Reading date",
        daysAfterReading: property.daysAfterReading?.toString() || "",
        nextMonthDay: property.nextMonthDay?.toString() || "",
        incomeTaxRate: property.incomeTaxRate?.toString() || "0",
        featuredImage: null,
      });
    }
  }, [property]);

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
      let imageUrl: string | null | undefined = undefined;

      if (formData.featuredImage) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.featuredImage!);
        });
      }

      const result = await updateProperty(property.id, {
        propertyName: formData.propertyName,
        propertyCode: formData.propertyPrefix,
        landlordId: formData.landlordId,
        propertyType: formData.propertyType,
        address: formData.location || "N/A",
        city: formData.location || "N/A",
        county: "Nairobi",
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

      if (result && 'success' in result && result.success) {
        toast.success("Property updated successfully");
        onOpenChange(false);
        router.refresh();
      } else if (result && 'error' in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success("Property updated successfully");
        onOpenChange(false);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update property");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
        <DialogHeader className="p-0 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
            Edit Property Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Property Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Westlands Apartments"
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                className="h-10 text-sm border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Property Prefix */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Property Code / Prefix <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. WST"
                value={formData.propertyPrefix}
                onChange={(e) => setFormData({ ...formData, propertyPrefix: e.target.value })}
                className="h-10 text-sm border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Landlord Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Assigned Landlord</label>
              <Select
                value={formData.landlordId}
                onValueChange={(val) => setFormData({ ...formData, landlordId: val })}
              >
                <SelectTrigger className="h-10 text-sm border-slate-200 rounded-lg bg-white">
                  <SelectValue placeholder="Select landlord (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None / Unassigned</SelectItem>
                  {landlords.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name} ({l.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Property Type</label>
              <Select
                value={formData.propertyType}
                onValueChange={(val) => setFormData({ ...formData, propertyType: val })}
              >
                <SelectTrigger className="h-10 text-sm border-slate-200 rounded-lg bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Location / Address</label>
              <Input
                placeholder="e.g. Ring Road, Westlands"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-10 text-sm border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Number of Floors */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Number of Floors</label>
              <Input
                type="number"
                value={formData.numberOfFloors}
                onChange={(e) => setFormData({ ...formData, numberOfFloors: e.target.value })}
                className="h-10 text-sm border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Featured Image</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
              <p className="text-xs font-medium text-slate-600">
                {formData.featuredImage
                  ? formData.featuredImage.name
                  : "Click to upload a new featured photo"}
              </p>
            </div>
          </div>

          {/* Advanced Dropdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>Advanced Financial & Utility Settings</span>
              {isAdvancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {isAdvancedOpen && (
              <div className="p-4 space-y-4 bg-white border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">PayBill Number</label>
                    <Input
                      placeholder="e.g. 123456"
                      value={formData.paybillNumber}
                      onChange={(e) => setFormData({ ...formData, paybillNumber: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Bank Name</label>
                    <Input
                      placeholder="e.g. NCBA Bank"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Bank Account Number</label>
                    <Input
                      placeholder="e.g. 1234567890"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Service Charge Rate (KES)</label>
                    <Input
                      type="number"
                      value={formData.serviceChargeRate}
                      onChange={(e) => setFormData({ ...formData, serviceChargeRate: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dialog Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="h-10 px-5 text-sm font-semibold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 px-6 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
