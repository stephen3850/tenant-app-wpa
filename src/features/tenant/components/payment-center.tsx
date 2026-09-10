"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PhoneIcon, CreditCardIcon, HistoryIcon, InfoIcon, Loader2Icon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { initiateMpesaPayment, getMpesaPaymentStatus } from "@/actions/tenant-payments";

export function PaymentCenter({ data }: { data: any }) {
  const { summary, recentPayments, outstandingInvoices } = data;
  const [amount, setAmount] = useState(summary.totalOutstanding.toString());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!phoneNumber) {
      setMessage({ text: "Phone number required", type: 'error' });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await initiateMpesaPayment(parseFloat(amount), phoneNumber);
      if (result.ResponseCode === "0") {
        setCheckoutId(result.CheckoutRequestID);
        setMessage({ text: "STK Push Sent. Please check your phone and enter your M-Pesa PIN.", type: 'info' });
        startPolling(result.CheckoutRequestID);
      } else {
        throw new Error(result.ResponseDescription || "Failed to initiate payment");
      }
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
      setIsProcessing(false);
    }
  };

  const startPolling = (id: string) => {
    let count = 0;
    const interval = setInterval(async () => {
      count++;
      setPollCount(count);
      try {
        const status = await getMpesaPaymentStatus(id);
        if (status.status === "SUCCESS") {
          clearInterval(interval);
          setCheckoutId(null);
          setIsProcessing(false);
          setMessage({ text: "Payment Successful! Your account has been updated.", type: 'success' });
          setTimeout(() => window.location.reload(), 3000);
        } else if (status.status === "FAILED") {
          clearInterval(interval);
          setCheckoutId(null);
          setIsProcessing(false);
          setMessage({ text: "Payment Failed. The transaction was cancelled or timed out.", type: 'error' });
        }
      } catch (err) {
        // Continue polling
      }

      if (count > 12) { // 1 minute timeout
        clearInterval(interval);
        setCheckoutId(null);
        setIsProcessing(false);
        setMessage({ text: "Taking longer than expected. Please check your payment history later.", type: 'info' });
      }
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
            title="Outstanding Balance"
            value={formatCurrency(summary.totalOutstanding)}
            icon={CreditCardIcon}
            description={summary.overdueAmount > 0 ? `${formatCurrency(summary.overdueAmount)} is overdue` : "Up to date"}
            descriptionColor={summary.overdueAmount > 0 ? "text-destructive" : "text-green-600"}
        />
        <StatCard
            title="Last Payment"
            value={summary.latestPayment ? formatCurrency(summary.latestPayment.amount) : "N/A"}
            icon={HistoryIcon}
            description={summary.latestPayment ? `Paid on ${formatDate(summary.latestPayment.paymentDate)}` : "No payment history"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Pay Outstanding Balance</CardTitle>
            <CardDescription>Enter the amount and your M-Pesa registered phone number.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePay} className="space-y-4">
              {message && (
                <div className={`p-3 rounded-md text-sm ${
                    message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                    message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                    {message.text}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0712345678"
                        className="pl-10"
                        required
                    />
                </div>
                <p className="text-[10px] text-muted-foreground">Formats: 07XXXXXXXX, 2547XXXXXXXX</p>
              </div>

              {isProcessing && checkoutId ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center text-center space-y-2">
                     <Loader2Icon className="h-8 w-8 text-blue-600 animate-spin" />
                     <p className="text-sm font-medium text-blue-800">Awaiting Confirmation</p>
                     <p className="text-xs text-blue-700">Please check your phone and enter your M-Pesa PIN. Do not close this page.</p>
                     <div className="w-full bg-blue-200 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${(pollCount / 12) * 100}%` }} />
                     </div>
                  </div>
              ) : (
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg" disabled={isProcessing}>
                    {isProcessing ? <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> : null}
                    {isProcessing ? "Processing..." : "Pay via M-Pesa STK Push"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
               <InfoIcon className="h-5 w-5 text-blue-500 shrink-0" />
               <p className="text-sm text-muted-foreground">
                  Payments made via M-Pesa are reflected instantly in your ledger.
               </p>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground">Other Methods</p>
                <div className="border rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground">Bank: NCBA Bank</p>
                    <p className="text-xs text-muted-foreground">Account Name: TMS Management</p>
                    <p className="text-xs text-muted-foreground">Account Number: 1234567890</p>
                    <p className="text-xs text-muted-foreground font-medium">Reference: YOUR_TENANT_CODE</p>
                </div>
                <Button variant="link" className="text-xs p-0 h-auto">
                    Submit Proof of Payment
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description, descriptionColor = "text-muted-foreground" }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-[10px] mt-1 ${descriptionColor}`}>{description}</p>
      </CardContent>
    </Card>
  );
}
