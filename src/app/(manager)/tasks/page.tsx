import { Metadata } from "next";
import {
  Plus,
  Calendar,
  LayoutGrid,
  List,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Building,
  ArrowRight,
  Zap,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Tasks | TMS",
  description: "Manage operational work across your organization.",
};

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  // Fetch Tasks
  const tasksData = await db.task.findMany({
    include: {
      property: true,
      assignee: true,
      _count: {
        select: { subtasks: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const taskList = serialize(tasksData);

  // Fetch KPI Counts
  const [total, open, completed, overdue] = await Promise.all([
    db.task.count(),
    db.task.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS', 'WAITING'] } } }),
    db.task.count({ where: { status: 'COMPLETED' } }),
    db.task.count({ where: { status: 'OVERDUE' } }),
  ]);

  const kpis = [
    { title: "Total Tasks", value: total.toString(), icon: List, color: "text-blue-600" },
    { title: "Open Tasks", value: open.toString(), icon: Clock, color: "text-orange-600" },
    { title: "Completed", value: completed.toString(), icon: CheckCircle2, color: "text-green-600" },
    { title: "Overdue", value: overdue.toString(), icon: AlertCircle, color: "text-red-600" },
    { title: "Due Today", value: "0", icon: Calendar, color: "text-purple-600" },
  ];

  const columns = [
    { id: "pending", title: "Pending", status: "PENDING" },
    { id: "in-progress", title: "In Progress", status: "IN_PROGRESS" },
    { id: "waiting", title: "Waiting", status: "WAITING" },
    { id: "completed", title: "Completed", status: "COMPLETED" },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Urgent</Badge>;
      case "HIGH": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">High</Badge>;
      case "MEDIUM": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Medium</Badge>;
      case "LOW": return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Completed</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">In Progress</Badge>;
      case "WAITING": return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">Waiting</Badge>;
      case "PENDING": return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">Pending</Badge>;
      case "OVERDUE": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Overdue</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage operational work across properties, tenants, maintenance teams, and staff.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button variant="outline" size="sm">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Projects
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8 w-full"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-[600px] grid-cols-3">
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="board">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Board View
            </TabsTrigger>
            <TabsTrigger value="automations">
              <Zap className="mr-2 h-4 w-4" />
              Automations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                          No tasks found. Click "New Task" to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      taskList.map((task: any) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{task.title}</span>
                              <span className="text-xs text-muted-foreground">{task.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{task.property?.propertyName || "N/A"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px]">
                                  {task.assignee?.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{task.assignee?.name || "Unassigned"}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                          <TableCell className="text-sm">
                            {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="board" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
              {columns.map((column) => {
                const columnTasks = taskList.filter((t: any) => t.status === column.status);
                return (
                  <div key={column.id} className="bg-slate-50 rounded-lg p-4 flex flex-col gap-4 min-w-[280px]">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        {column.title}
                        <Badge variant="secondary" className="rounded-full px-2 py-0 h-5">
                          {columnTasks.length}
                        </Badge>
                      </h3>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {columnTasks.map((task: any) => (
                        <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-3 flex flex-col gap-2">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase">{task.type}</span>
                              {getPriorityBadge(task.priority)}
                            </div>
                            <p className="text-sm font-medium leading-snug">{task.title}</p>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Building className="h-3 w-3" />
                              {task.property?.propertyName || "N/A"}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No date"}
                              </div>
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[8px]">
                                  {task.assignee?.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="automations" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Lease Expiry", desc: "Create task 30 days before lease ends", icon: Clock },
                { title: "Rent Overdue", desc: "Create task when rent is 5 days late", icon: AlertCircle },
                { title: "Maintenance", desc: "Convert incoming requests to tasks", icon: Building },
                { title: "Inspections", desc: "Schedule move-in/out inspections", icon: Calendar },
                { title: "Statement Gen", desc: "Notify when owner statements are ready", icon: FileText },
                { title: "Vacant Units", desc: "Create marketing tasks for new vacancies", icon: LayoutGrid },
              ].map((auto) => (
                <Card key={auto.title} className="relative overflow-hidden group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <auto.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
                    </div>
                    <CardTitle className="text-base mt-4">{auto.title} Automation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">{auto.desc}</p>
                    <Button variant="outline" size="sm" className="w-full">Configure</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
