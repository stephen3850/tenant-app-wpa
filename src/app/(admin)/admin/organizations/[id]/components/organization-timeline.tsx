import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
    ClockIcon,
    UserIcon,
    ArrowRightIcon,
    SettingsIcon,
    ShieldAlertIcon,
    CreditCardIcon
} from "lucide-react";

export function OrganizationTimeline({ timeline }: { timeline: any[] }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="bg-white border-b border-slate-50 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <ClockIcon className="h-4 w-4" /> Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {timeline.length > 0 ? timeline.map((event) => (
            <div key={event.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
              <div className={`p-2 rounded-lg mt-0.5 ${
                event.action.includes("SUSPEND") || event.action.includes("ARCHIVE") ? "bg-red-50 text-red-600" :
                event.action.includes("ACTIVATE") ? "bg-green-50 text-green-600" :
                event.action.includes("BILLING") ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
              }`}>
                {event.action.includes("SUSPEND") ? <ShieldAlertIcon className="h-4 w-4" /> :
                 event.action.includes("ACTIVATE") ? <SettingsIcon className="h-4 w-4" /> :
                 event.action.includes("BILLING") ? <CreditCardIcon className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-black text-slate-900 truncate">
                        {event.action.replace(/_/g, " ")}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">
                        {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs font-medium text-slate-500">
                        by <span className="font-bold text-slate-700">{event.user?.name || "System"}</span>
                    </p>
                    {event.newData && (
                        <p className="text-[10px] font-bold text-slate-400 truncate">
                             — {JSON.stringify(event.newData).slice(0, 50)}...
                        </p>
                    )}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center">
                <p className="text-xs font-medium text-slate-400">No activity recorded for this organization.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
