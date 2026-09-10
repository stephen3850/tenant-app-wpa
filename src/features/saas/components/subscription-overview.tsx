import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircleIcon, CalendarIcon, ZapIcon } from "lucide-react";

export function SubscriptionOverview({ subscription, usage }: any) {
  if (!subscription) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>Managed your plan and renewal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Plan</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{subscription.plan.name}</span>
              <Badge variant="success" className="bg-green-100 text-green-700">Active</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>Next Renewal</span>
            </div>
            <span className="font-medium">{format(new Date(subscription.endDate || subscription.updatedAt), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ZapIcon className="h-4 w-4" />
              <span>Billing Cycle</span>
            </div>
            <span className="font-medium capitalize">{subscription.plan.interval.toLowerCase()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Summary</CardTitle>
          <CardDescription>Real-time resource utilization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UsageItem label="Active Units" current={usage.activeUnits} limit={subscription.plan.features.maxUnits} />
          <UsageItem label="System Users" current={usage.activeUsers} limit={subscription.plan.features.maxUsers} />
          <UsageItem label="SMS Sent" current={usage.smsSent} limit={subscription.plan.features.smsCredits} />
        </CardContent>
      </Card>
    </div>
  );
}

function UsageItem({ label, current, limit }: { label: string, current: number, limit: number }) {
  const percentage = Math.min((current / limit) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{current} / {limit}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
            className={`h-full ${percentage > 90 ? "bg-destructive" : percentage > 70 ? "bg-warning" : "bg-blue-600"}`}
            style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
