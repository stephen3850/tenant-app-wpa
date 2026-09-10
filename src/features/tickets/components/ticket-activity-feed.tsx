import { formatDistanceToNow } from "date-fns";
import { User, TicketActivity, TicketActivityType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ActivityWithUser = TicketActivity & {
  user: User;
};

export function TicketActivityFeed({ activities }: { activities: ActivityWithUser[] }) {
  return (
    <div className="space-y-6">
      {activities.map((activity, idx) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.image || ""} />
              <AvatarFallback>{activity.user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            {idx !== activities.length - 1 && (
              <div className="w-px flex-1 bg-border mt-2" />
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {activity.user.name}{" "}
                <span className="text-muted-foreground font-normal">
                  {getActivityText(activity)}
                </span>
              </p>
              <time className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </time>
            </div>
            {activity.content && (
              <div className={cn(
                "mt-2 text-sm p-3 rounded-lg border",
                activity.isInternal ? "bg-amber-50 border-amber-100" : "bg-muted/50"
              )}>
                {activity.content}
                {activity.isInternal && (
                  <span className="ml-2 text-[10px] font-bold text-amber-600 uppercase">Internal</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function getActivityText(activity: TicketActivity) {
  switch (activity.type) {
    case "COMMENT": return "added a comment";
    case "STATUS_CHANGE": return `changed status from ${activity.oldValue} to ${activity.newValue}`;
    case "ASSIGNMENT": return `assigned the ticket`;
    case "ESCALATION": return "escalated the ticket";
    case "REOPENED": return "reopened the ticket";
    case "CLOSED": return "closed the ticket";
    case "ARCHIVED": return "archived the ticket";
    default: return "performed an action";
  }
}
