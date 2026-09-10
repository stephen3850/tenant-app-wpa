import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { billingService } from "@/features/saas/services/billing-service";
import { SubscriptionOverview } from "@/features/saas/components/subscription-overview";
import { BillingInvoiceList } from "@/features/saas/components/billing-invoice-list";
import { PlanComparison } from "@/features/saas/components/plan-comparison";
import { UsageDashboard } from "@/features/saas/components/usage-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryIcon, ActivityIcon, LayoutGridIcon } from "lucide-react";
import { changePlan } from "@/actions/billing";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const subscription = await billingService.getSubscription(user.organizationId);
  const invoices = await billingService.getBillingInvoices(user.organizationId);
  const usage = await billingService.getUsageStats(user.organizationId);
  const plans = await billingService.getPlans();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
      </div>

      <SubscriptionOverview subscription={subscription} usage={usage} />

      <Tabs defaultValue="history" className="space-y-4 pt-4">
        <TabsList>
          <TabsTrigger value="history">
            <HistoryIcon className="mr-2 h-4 w-4" /> Billing History
          </TabsTrigger>
          <TabsTrigger value="plans">
            <LayoutGridIcon className="mr-2 h-4 w-4" /> Plans & Upgrades
          </TabsTrigger>
          <TabsTrigger value="usage">
            <ActivityIcon className="mr-2 h-4 w-4" /> Detailed Usage
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
            <BillingInvoiceList invoices={invoices as any} />
        </TabsContent>
        <TabsContent value="plans" className="space-y-4">
            <PlanComparison
                plans={plans}
                currentPlanId={subscription?.planId}
            />
        </TabsContent>
        <TabsContent value="usage" className="space-y-4">
            <UsageDashboard usage={usage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
