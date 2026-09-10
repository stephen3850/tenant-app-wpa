"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, Power, PowerOff, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function ScheduledTaskList({ tasks }: { tasks: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {tasks.length === 0 && (
        <Card className="col-span-full border-2 border-dashed p-12 text-center">
          <CardContent>
            <p className="text-slate-500 font-medium">No scheduled tasks found.</p>
          </CardContent>
        </Card>
      )}
      {tasks.map((task) => (
        <Card key={task.id} className="border-2 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black">{task.name}</CardTitle>
                <Badge variant={task.isEnabled ? "default" : "secondary"} className="font-bold">
                  {task.isEnabled ? "ENABLED" : "PAUSED"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 border-2">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className={`h-8 w-8 border-2 ${task.isEnabled ? "text-rose-600" : "text-emerald-600"}`}>
                  {task.isEnabled ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium text-slate-500">{task.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="font-black text-slate-700">{task.cronExpression}</span>
              </div>
              <div className="flex items-center gap-2 text-sm justify-end">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="font-bold text-slate-500">
                  Next: {task.nextRunAt ? formatDate(task.nextRunAt) : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
