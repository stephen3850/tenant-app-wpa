import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantPaymentService } from "@/features/tenant/services/tenant-payment-service";
import { PaymentCenter } from "@/features/tenant/components/payment-center";
import { PaymentHistory } from "@/features/tenant/components/payment-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCardIcon, HistoryIcon } from "lucide-react";

export default async function TenantPaymentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  try {
    const data = await tenantPaymentService.getPaymentDashboard(session.user.id);
    const fullHistory = await tenantPaymentService.getPaymentHistory(session.user.id);

    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        </div>

        <Tabs defaultValue="pay" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pay">
              <CreditCardIcon className="mr-2 h-4 w-4" /> Payment Center
            </TabsTrigger>
            <TabsTrigger value="history">
              <HistoryIcon className="mr-2 h-4 w-4" /> Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pay" className="space-y-4">
             <PaymentCenter data={data} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
             <PaymentHistory payments={fullHistory} />
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-destructive">Error loading payments</h2>
            <p className="text-muted-foreground">Please try again later or contact support.</p>
        </div>
    );
  }
}
