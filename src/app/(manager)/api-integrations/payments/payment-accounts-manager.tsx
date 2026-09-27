"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createPaymentAccount,
  getPaymentAccounts,
  getPaymentRoutes,
  testPaymentAccountCredentials,
  updatePaymentAccount,
  upsertPaymentRoute,
} from "@/actions/payment-accounts";
import { toast } from "sonner";
import { Loader2, Plus, ShieldCheck, Smartphone, CheckCircle, Settings2, Route } from "lucide-react";

export function PaymentAccountsManager() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [routesData, setRoutesData] = useState<{ routes: any[]; properties: any[]; accounts: any[] }>({
    routes: [],
    properties: [],
    accounts: [],
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: "",
    accountType: "PAYBILL" as "PAYBILL" | "TILL",
    shortCode: "",
    consumerKey: "",
    consumerSecret: "",
    passkey: "",
    environment: "sandbox" as "sandbox" | "production",
    isDefault: false,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [accs, rts] = await Promise.all([getPaymentAccounts(), getPaymentRoutes()]);
      setAccounts(accs);
      setRoutesData(rts);
    } catch (err: any) {
      toast.error(err.message || "Failed to load payment accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPaymentAccount({
        displayName: formData.displayName,
        accountType: formData.accountType,
        shortCode: formData.shortCode,
        consumerKey: formData.consumerKey,
        consumerSecret: formData.consumerSecret,
        passkey: formData.passkey,
        environment: formData.environment,
        isDefault: formData.isDefault,
      });
      toast.success("Payment account created and verified successfully!");
      setDialogOpen(false);
      setFormData({
        displayName: "",
        accountType: "PAYBILL",
        shortCode: "",
        consumerKey: "",
        consumerSecret: "",
        passkey: "",
        environment: "sandbox",
        isDefault: false,
      });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create payment account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      await updatePaymentAccount(accountId, { isDefault: true });
      toast.success("Default payment account updated");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update default account");
    }
  };

  const handleRouteUpdate = async (propertyId: string, paymentAccountId: string) => {
    try {
      await upsertPaymentRoute({
        propertyId,
        paymentAccountId,
      });
      toast.success("Payment route updated");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update route");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div>
          <h3 className="text-base font-black text-[#1E293B]">Multi-Tenant Payment Accounts</h3>
          <p className="text-xs text-[#64748B]">
            Configure M-Pesa Tills, PayBills, and credentials for your organisation.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
              <Plus className="mr-2 h-4 w-4" /> Add Payment Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Account</DialogTitle>
              <DialogDescription>
                Configure an M-Pesa Till or PayBill account for your organisation.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateAccount} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Display Name</Label>
                <Input
                  placeholder="e.g. Westlands Collection Till"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Account Type</Label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as any })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs font-medium"
                  >
                    <option value="PAYBILL">M-Pesa PayBill</option>
                    <option value="TILL">M-Pesa Till (Buy Goods)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Shortcode / Till</Label>
                  <Input
                    placeholder="e.g. 123456"
                    value={formData.shortCode}
                    onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Consumer Key</Label>
                <Input
                  type="password"
                  placeholder="Safaricom Daraja Consumer Key"
                  value={formData.consumerKey}
                  onChange={(e) => setFormData({ ...formData, consumerKey: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Consumer Secret</Label>
                <Input
                  type="password"
                  placeholder="Safaricom Daraja Consumer Secret"
                  value={formData.consumerSecret}
                  onChange={(e) => setFormData({ ...formData, consumerSecret: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Passkey (Optional)</Label>
                <Input
                  type="password"
                  placeholder="STK Passkey"
                  value={formData.passkey}
                  onChange={(e) => setFormData({ ...formData, passkey: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Environment</Label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs font-medium"
                  >
                    <option value="sandbox">Sandbox (Testing)</option>
                    <option value="production">Production (Live)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <Label htmlFor="isDefault" className="text-xs font-bold cursor-pointer">Set as Default</Label>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-blue-600 text-white">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Account
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <Card key={acc.id} className="border-[#E2E8F0] shadow-sm relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-emerald-600" />
                    <CardTitle className="text-sm font-black">{acc.displayName}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {acc.accountType} • Shortcode: <span className="font-bold text-slate-800">{acc.shortCode}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {acc.isDefault && (
                    <Badge className="bg-blue-100 text-blue-800 border-none text-[10px] font-bold">
                      Default
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                    {acc.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 text-slate-600">
                <p>Environment: <span className="font-semibold text-slate-800 capitalize">{acc.credentialsSafe.environment}</span></p>
                <p>Consumer Key: <span className="font-mono text-slate-700">{acc.credentialsSafe.consumerKey}</span></p>
              </div>

              <div className="flex items-center justify-between pt-1">
                {!acc.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(acc.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                  >
                    Make Default
                  </Button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Badge variant="secondary" className="text-[10px]">
                    <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600" /> AES-256 Encrypted
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-xl border border-dashed text-center space-y-3">
            <Smartphone className="h-10 w-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Payment Accounts Configured</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add an M-Pesa Till or PayBill account above to enable automated tenant payments for your organisation.
            </p>
          </div>
        )}
      </div>

      {/* Property Payment Routing Table */}
      {routesData.properties.length > 0 && (
        <Card className="border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-sm font-black">Property Payment Routing</CardTitle>
                <CardDescription className="text-xs">
                  Map specific properties to individual M-Pesa Till or PayBill accounts.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y border rounded-lg overflow-hidden">
              {routesData.properties.map((prop) => {
                const activeRoute = routesData.routes.find((r) => r.propertyId === prop.id);
                const selectedAccountId = activeRoute?.paymentAccountId || "";

                return (
                  <div key={prop.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-white gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{prop.propertyName}</p>
                      <p className="text-[11px] text-slate-500">Code: {prop.propertyCode}</p>
                    </div>

                    <div className="w-full sm:w-64">
                      <select
                        value={selectedAccountId}
                        onChange={(e) => handleRouteUpdate(prop.id, e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs font-medium"
                      >
                        <option value="">Use Org Default Account</option>
                        {routesData.accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.displayName} ({acc.shortCode})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
