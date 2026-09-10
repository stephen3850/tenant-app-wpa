"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { changePlan } from "@/actions/billing";

export function PlanComparison({ plans, currentPlanId }: any) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setLoading(planId);
    try {
      await changePlan(planId);
      alert("Plan updated successfully");
    } catch (error: any) {
      alert(error.message || "Failed to update plan");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan: any) => (
        <Card key={plan.id} className={plan.id === currentPlanId ? "border-primary shadow-md" : ""}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">
              KES {plan.price.toString()}
              <span className="text-sm font-normal text-muted-foreground">/{plan.interval.toLowerCase()}</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Up to {plan.features.maxUnits} units</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>{plan.features.maxUsers} users included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>{plan.features.smsCredits} SMS credits/mo</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.id === currentPlanId ? "outline" : "default"}
              disabled={plan.id === currentPlanId || !!loading}
              onClick={() => handleUpgrade(plan.id)}
            >
              {loading === plan.id ? "Updating..." : plan.id === currentPlanId ? "Current Plan" : "Upgrade"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
