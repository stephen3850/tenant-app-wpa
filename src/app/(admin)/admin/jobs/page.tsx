import { getJobs, getScheduledTasks } from "@/features/integrations/actions/job-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobList } from "./components/job-list";
import { ScheduledTaskList } from "./components/scheduled-task-list";
import { JobFilters } from "./components/job-filters";

export default async function JobsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const { items, total, page, pageSize } = await getJobs(params);
  const tasks = await getScheduledTasks();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Jobs & Automation Center</h1>
        <p className="text-slate-500 font-medium">Monitor background tasks, process retries, and manage scheduled workflows.</p>
      </div>

      <Tabs defaultValue="jobs" className="space-y-8">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit h-auto flex flex-wrap">
          <TabsTrigger value="jobs" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">Active Jobs</TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white">Scheduled Tasks</TabsTrigger>
          <TabsTrigger value="failed" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white text-rose-600">Failed Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <JobFilters />
          <JobList jobs={items} total={total} page={page} pageSize={pageSize} />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledTaskList tasks={tasks} />
        </TabsContent>

        <TabsContent value="failed">
          <JobList jobs={items.filter((j: any) => j.status === 'FAILED')} total={total} page={page} pageSize={pageSize} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
