import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, FileTextIcon, DownloadIcon, ArrowUpRightIcon, AlertCircleIcon } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import Link from "next/link";

export function FinancialSummary({ financial }: any) {
  const isOverdue = Number(financial.currentBalance) > 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className={cn(
        "relative overflow-hidden border-none shadow-xl transition-all hover:scale-[1.01]",
        isOverdue ? "bg-rose-600 text-white" : "bg-zinc-900 text-white"
      )}>
        <div className="absolute top-[-20%] right-[-10%] opacity-10 rotate-12">
            <CreditCardIcon size={160} />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Current Balance</CardTitle>
          <CreditCardIcon className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-black tracking-tight mt-2">
            {formatCurrency(financial.currentBalance)}
          </div>
          <p className="text-xs mt-2 font-semibold opacity-90 flex items-center gap-1.5">
            {isOverdue ? (
                <>
                  <AlertCircleIcon className="h-3.5 w-3.5" />
                  Payment overdue. Please settle your account.
                </>
            ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Account is fully paid and up to date.
                </>
            )}
          </p>
          <div className="mt-8">
            <Button size="lg" className={cn(
                "w-full font-bold text-sm h-11 transition-all active:scale-[0.98]",
                isOverdue ? "bg-white text-rose-600 hover:bg-zinc-100" : "bg-primary text-primary-foreground hover:bg-primary/90"
            )} asChild>
                <Link href="/payments">
                    Make a Payment
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm group hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Latest Invoice</CardTitle>
          <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <FileTextIcon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          {financial.latestInvoice ? (
            <>
              <div className="text-3xl font-bold tracking-tight mt-2">
                {formatCurrency(financial.latestInvoice.totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Period: {new Date(financial.latestInvoice.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
              <div className="mt-8">
                <Button variant="outline" size="lg" className="w-full h-11 font-bold text-sm rounded-xl border-2 hover:bg-muted" asChild>
                    <Link href={`/invoices/${financial.latestInvoice.id}`}>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download PDF
                    </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm font-medium text-muted-foreground">No recent invoices found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1 border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Account Tools</CardTitle>
          <ArrowUpRightIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 mt-2">
          <Button variant="ghost" size="sm" className="justify-start h-11 font-semibold rounded-xl hover:bg-primary/5 hover:text-primary group">
            <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 mr-3">
                <FileTextIcon className="h-4 w-4" />
            </div>
            Full Statement
          </Button>
          <Button variant="ghost" size="sm" className="justify-start h-11 font-semibold rounded-xl hover:bg-primary/5 hover:text-primary group">
            <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 mr-3">
                <CreditCardIcon className="h-4 w-4" />
            </div>
            Payment Methods
          </Button>
          <div className="mt-2 p-4 rounded-xl bg-muted/30 border border-dashed border-border">
             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Support</p>
             <p className="text-xs font-semibold">Contact support for billing inquiries.</p>
             <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold text-primary mt-1">Help Center →</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
