"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateMpesaCredentials, testMpesaCredentials, registerMpesaUrls } from "@/actions/integrations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PaymentApiFormProps {
  initialData: any;
}

export function PaymentApiForm({ initialData }: PaymentApiFormProps) {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [formData, setFormData] = useState({
    shortCode: initialData?.shortCode || "",
    consumerKey: "",
    consumerSecret: "",
    passkey: "",
    environment: initialData?.environment || "sandbox",
  });

  const [clearKeys, setClearKeys] = useState({
    consumerKey: false,
    consumerSecret: false,
    passkey: false,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateMpesaCredentials({
        shortCode: formData.shortCode,
        consumerKey: clearKeys.consumerKey ? "" : formData.consumerKey,
        consumerSecret: clearKeys.consumerSecret ? "" : formData.consumerSecret,
        passkey: clearKeys.passkey ? "" : formData.passkey,
        environment: formData.environment,
      });

      if (result.success) {
        toast.success(result.success);
      }
    } catch (error) {
      toast.error("Failed to update credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const result = await testMpesaCredentials();
      if (result.success) {
        toast.success(result.success);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const result = await registerMpesaUrls();
      if (result.success) {
        toast.success(result.success);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
      <div className="p-5 lg:p-6 space-y-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-[14px] font-black text-[#1E293B]">Daraja M-Pesa API</h3>
            <p className="text-[11px] text-[#64748B] leading-tight">
              Safaricom Daraja C2B, STK Push, callbacks, and business-level credentials.
            </p>
          </div>
          <Badge className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-none text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
            Mobile Money
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">API Environment</Label>
            <select
              value={formData.environment}
              onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
              className="flex h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-1 text-[12px] font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="sandbox">Sandbox (Testing)</option>
              <option value="production">Production (Live)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Short Code / Paybill</Label>
            <Input
              value={formData.shortCode}
              onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
              className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Consumer Key</Label>
            <Input
              type="password"
              placeholder="Paste consumer key"
              value={formData.consumerKey}
              onChange={(e) => setFormData({ ...formData, consumerKey: e.target.value })}
              className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/30"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Consumer Secret</Label>
            <Input
              type="password"
              placeholder="Paste consumer secret"
              value={formData.consumerSecret}
              onChange={(e) => setFormData({ ...formData, consumerSecret: e.target.value })}
              className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Passkey</Label>
            <Input
              type="password"
              placeholder="Paste passkey"
              value={formData.passkey}
              onChange={(e) => setFormData({ ...formData, passkey: e.target.value })}
              className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/30"
            />
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-50">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="clear-key"
              className="h-4 w-4 border-slate-300"
              checked={clearKeys.consumerKey}
              onCheckedChange={(checked) => setClearKeys({ ...clearKeys, consumerKey: checked as boolean })}
            />
            <Label htmlFor="clear-key" className="text-[11px] font-medium text-[#64748B] cursor-pointer">Clear consumer key</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="clear-secret"
              className="h-4 w-4 border-slate-300"
              checked={clearKeys.consumerSecret}
              onCheckedChange={(checked) => setClearKeys({ ...clearKeys, consumerSecret: checked as boolean })}
            />
            <Label htmlFor="clear-secret" className="text-[11px] font-medium text-[#64748B] cursor-pointer">Clear consumer secret</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="clear-passkey"
              className="h-4 w-4 border-slate-300"
              checked={clearKeys.passkey}
              onCheckedChange={(checked) => setClearKeys({ ...clearKeys, passkey: checked as boolean })}
            />
            <Label htmlFor="clear-passkey" className="text-[11px] font-medium text-[#64748B] cursor-pointer">Clear passkey</Label>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[10px] font-medium text-[#64748B] italic">
            This is the business default. Property-specific collection accounts override it only where configured.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={loading || testing || registering}
            className="h-10 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[13px] rounded-lg shadow-sm px-8"
          >
            {(loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Daraja API
          </Button>
          <Button
            onClick={handleTest}
            disabled={loading || testing || registering}
            className="h-10 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold text-[13px] rounded-lg shadow-sm px-6"
          >
            {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test M-PESA credentials
          </Button>
          <Button
            onClick={handleRegister}
            disabled={loading || testing || registering}
            className="h-10 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold text-[13px] rounded-lg shadow-sm px-6"
          >
            {registering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm validation & confirmation URL
          </Button>
        </div>
      </div>
    </div>
  );
}
