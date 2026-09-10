"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Step {
  id: string;
  label: string;
  completed: boolean;
}

interface ProgressEngineProps {
  steps: Step[];
  percentage: number;
}

export function ProgressEngine({ steps, percentage }: ProgressEngineProps) {
  if (percentage === 100) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Workspace Setup</CardTitle>
          <span className="text-xs font-bold text-primary">{Math.round(percentage)}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="h-2 mb-4" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center space-x-2">
              {step.completed ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`text-xs ${step.completed ? "font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
