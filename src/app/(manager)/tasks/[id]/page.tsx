import { Metadata } from "next";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Paperclip,
  MessageSquare,
  History,
  Building,
  User,
  Calendar,
  Flag,
  CheckSquare,
  Plus,
  Send
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Task Details | TMS",
  description: "View and manage task details.",
};

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  const taskData = await db.task.findUnique({
    where: { id: id },
    include: {
      property: true,
      unit: true,
      tenant: true,
      assignee: true,
      creator: true,
      subtasks: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      },
      attachments: true
    }
  });

  if (!taskData) notFound();

  const task = serialize(taskData);

  const completedSubtasks = task.subtasks?.filter((s: any) => s.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TASK-{task.id.slice(-4).toUpperCase()}</span>
            <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">Edit Task</Button>
          <Button className="bg-green-600 hover:bg-green-700">Complete Task</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-700">{task.description || "No description provided."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Checklist</CardTitle>
              <span className="text-xs font-medium text-muted-foreground">{completedSubtasks} of {totalSubtasks} items completed</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} className="h-2" />
              <div className="space-y-3 mt-4">
                {task.subtasks?.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No subtasks added.</p>
                ) : (
                  task.subtasks?.map((sub: any) => (
                    <div key={sub.id} className="flex items-center gap-3">
                      <Checkbox id={`sub-${sub.id}`} defaultChecked={sub.isCompleted} />
                      <label
                        htmlFor={`sub-${sub.id}`}
                        className={`text-sm ${sub.isCompleted ? "line-through text-muted-foreground" : "text-slate-900"}`}
                      >
                        {sub.title}
                      </label>
                    </div>
                  ))
                )}
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 p-0 h-auto">
                  <Plus className="mr-1 h-3 w-3" /> Add item
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Internal Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  {task.comments?.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-4">No comments yet.</p>
                  ) : (
                    task.comments?.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{comment.user?.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-slate-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold">{comment.user?.name}</span>
                            <span className="text-[10px] text-muted-foreground">{format(new Date(comment.createdAt), "MMM d, HH:mm")}</span>
                          </div>
                          <p className="text-sm text-slate-700">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <Textarea placeholder="Add a comment or @mention a team member..." className="min-h-[100px]" />
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="mr-2 h-4 w-4" />
                      Attach
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Send className="mr-2 h-4 w-4" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
                <div className="flex items-center">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none capitalize">
                    {task.status.toLowerCase().replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Priority</span>
                <div className="flex items-center">
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none capitalize">
                    {task.priority.toLowerCase()}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Assigned To</span>
                <div className="flex items-center gap-2 pt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{task.assignee?.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{task.assignee?.name || "Unassigned"}</span>
                    <span className="text-[10px] text-muted-foreground">{task.assignee?.email || "No email"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Due Date</span>
                <div className="flex items-center gap-2 pt-1 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Property & Unit</span>
                  <span className="text-sm font-medium">{task.property?.propertyName || "N/A"}</span>
                  <span className="text-xs text-muted-foreground">{task.unit?.unitNumber ? `Unit ${task.unit.unitNumber}` : "No Unit"}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Tenant</span>
                  <span className="text-sm font-medium">{task.tenant?.firstName ? `${task.tenant.firstName} ${task.tenant.lastName}` : "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Attachments</CardTitle>
              <Badge variant="secondary">{task.attachments?.length || 0}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {task.attachments?.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">No attachments.</p>
                ) : (
                  task.attachments?.map((att: any) => (
                    <div key={att.id} className="flex items-center justify-between p-2 border rounded text-xs hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{att.name}</span>
                      </div>
                      <span className="text-muted-foreground flex-shrink-0">{Math.round(att.size / 1024)} KB</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
