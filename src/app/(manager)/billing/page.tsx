import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBillingInvoices, getSubscription } from "@/actions/billing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serialize, cn } from "@/lib/utils";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let invoices: any[] = [];
  let subscription: any = null;

  try {
    const [invoicesData, subData] = await Promise.all([
      getBillingInvoices(),
      getSubscription(),
    ]);
    invoices = serialize(invoicesData || []);
    subscription = serialize(subData);
  } catch (error) {
    console.error("Failed to fetch billing data:", error);
  }

  const currentPlan = subscription?.plan?.name || "Not selected";
  const planPrice = subscription?.plan?.price || 5000;
  const planInterval = subscription?.plan?.interval === "YEARLY" ? "year" : "month";
  const status = subscription?.status || "Inactive";

  return (
    <div className="p-4 lg:p-12 space-y-6 animate-in fade-in duration-700 bg-white min-h-screen">
      {/* Header Card */}
      <Card className="border-[#DCE3EA] shadow-none rounded-xl overflow-hidden bg-white">
        <CardContent className="p-8 space-y-2">
          <p className="text-[11px] font-bold text-[#56A600] uppercase tracking-[0.15em]">
            SUBSCRIPTION
          </p>
          <h1 className="text-4xl font-black text-[#1F2937] tracking-tight">
            Billing Invoices
          </h1>
          <p className="text-sm font-medium text-[#667085]">
            Review invoices issued for your account and confirm payment status.
          </p>
        </CardContent>
      </Card>

      {/* Current Plan Card */}
      <Card className="border-[#DCE3EA] shadow-none rounded-xl overflow-hidden bg-white">
        <CardContent className="p-8 flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest mr-4">
            CURRENT PLAN
          </span>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-bold text-[#1F2937]">Selected:</span>
            <span className="font-medium text-[#667085]">{currentPlan}</span>
          </div>
          <div className="h-4 w-[1px] bg-[#DCE3EA] mx-4" />
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-medium text-[#667085]">Billed at:</span>
            <span className="font-medium text-[#667085]">
              {subscription?.plan?.name || "Starter Plan"} (KES {planPrice.toLocaleString()} / {planInterval})
            </span>
          </div>
          <div className="ml-4">
            <Badge variant="outline" className="rounded-full bg-[#F3F4F6] text-[#667085] border-[#DCE3EA] font-bold text-[10px] px-3 py-0.5 uppercase">
              Status: {status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <div className="border border-[#DCE3EA] rounded-xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-[#F9FAFB]/50 border-b border-[#DCE3EA]">
            <TableRow className="hover:bg-transparent h-12">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-6 w-12">#</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-4">Period</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-4">Frequency</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-4">RentalDesk Plan</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-4">ZChat</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-4">Amount</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-4">Issued on</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-4">Due on</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-4">Status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#1F2937] px-6">Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-sm font-medium text-[#667085]">
                  No billing invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice, index) => (
                <TableRow key={invoice.id} className="border-[#F5F7FA] h-14 group hover:bg-[#F9FAFB]/50">
                  <TableCell className="px-6 text-[11px] font-bold text-[#1F2937]">{index + 1}</TableCell>
                  <TableCell className="px-4 text-[11px] font-medium text-[#667085]">
                    {new Date(invoice.periodStart).toLocaleDateString()} - {new Date(invoice.periodEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 text-[11px] font-medium text-[#667085] uppercase">
                    {invoice.subscription?.plan?.interval || "Monthly"}
                  </TableCell>
                  <TableCell className="px-4 text-[11px] font-bold text-[#1F2937]">
                    {invoice.subscription?.plan?.name || "Starter Plan"}
                  </TableCell>
                  <TableCell className="px-4 text-[11px] font-medium text-[#667085]">
                    Included
                  </TableCell>
                  <TableCell className="px-4 text-[11px] font-bold text-[#1F2937]">
                    KES {Number(invoice.total).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 text-[11px] font-medium text-[#667085]">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 text-[11px] font-medium text-[#667085]">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge variant="outline" className={cn(
                        "rounded-full font-bold px-3 py-0.5 text-[9px] uppercase h-6 border-none",
                        invoice.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-[11px] font-medium text-[#98A2B3] tabular-nums">
                    {invoice.invoiceNumber}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination Placeholder */}
      <div className="h-4 bg-[#F9FAFB]/50 rounded-lg" />
    </div>
  );
}
