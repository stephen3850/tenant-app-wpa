import { formatDistanceToNow } from "date-fns";
import { User, CaseActivity, CaseActivityType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ActivityWithUser = CaseActivity & {
  user: User;
};

export function CaseActivityFeed({ activities }: { activities: ActivityWithUser[] }) {
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

function getActivityText(activity: CaseActivity) {
  switch (activity.type) {
    case "COMMENT": return "added a comment";
    case "STATUS_CHANGE": return `changed status from ${activity.oldValue} to ${activity.newValue}`;
    case "ASSIGNMENT": return `assigned the case`;
    case "ESCALATION": return "escalated the case";
    case "EVIDENCE_ADDED": return "added evidence";
    case "DECISION": return "recorded a decision";
    case "REOPENED": return "reopened the case";
    case "CLOSED": return "closed the case";
    case "ARCHIVED": return "archived the case";
    default: return "performed an action";
  }
}
