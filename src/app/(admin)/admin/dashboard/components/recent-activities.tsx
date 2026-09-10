import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
    ClockIcon,
    UserIcon,
    BuildingIcon,
    AlertCircleIcon,
    ShieldIcon,
    ArrowRightIcon
} from "lucide-react";

export function RecentActivities({ activities }: any) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-50 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <ClockIcon className="h-4 w-4" /> Global Audit Trail
        </CardTitle>
        <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">View All logs</button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {activities.map((log: any) => (
            <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                log.action.includes("DELETE") || log.action.includes("FAILED")
                ? "bg-red-50 text-red-600"
                : log.action.includes("CREATE")
                ? "bg-green-50 text-green-600"
                : "bg-blue-50 text-blue-600"
              }`}>
                {log.action.includes("SECURITY") ? <ShieldIcon className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 truncate">{log.action.replace(/_/g, " ")}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">• {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] font-medium text-slate-500 truncate">
                    <span className="font-bold text-slate-700">{log.user?.name || "System"}</span>
                    {log.organization ? ` @ ${log.organization.name}` : " (Platform)"}
                  </p>
                </div>
              </div>
              <ArrowRightIcon className="h-4 w-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
