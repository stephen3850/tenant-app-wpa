import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CircleIcon } from "lucide-react";

export function LeaseTimeline({ events }: { events: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lease History & Events</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {events.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No events recorded yet.</p>
          ) : (
            events.map((event, idx) => (
              <div key={event.id} className="relative flex items-center justify-between md:justify-start md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                   <CircleIcon className="h-2 w-2 fill-blue-500 text-blue-500" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                   <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900 text-sm uppercase tracking-tight">{event.type.replace(/_/g, ' ')}</div>
                      <time className="font-medium text-blue-500 text-xs">{format(new Date(event.eventDate), "MMM d, yyyy")}</time>
                   </div>
                   <div className="text-slate-500 text-xs">{event.description}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
