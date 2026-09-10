import { formatDistanceToNow } from "date-fns";
import { User, SecurityActivity, SecurityActivityType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ActivityWithUser = SecurityActivity & {
  user: User;
};

export function IncidentActivityFeed({ activities }: { activities: ActivityWithUser[] }) {
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
              <div className="mt-2 text-sm p-3 rounded-lg border bg-muted/50">
                {activity.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function getActivityText(activity: SecurityActivity) {
  switch (activity.type) {
    case "INCIDENT_CREATED": return "recorded the incident";
    case "STATUS_CHANGE": return `changed status from ${activity.oldValue} to ${activity.newValue}`;
    case "COMMENT": return "added a comment";
    case "EVIDENCE_ADDED": return "attached evidence";
    case "ESCALATION": return "escalated the incident";
    default: return "performed an action";
  }
}
