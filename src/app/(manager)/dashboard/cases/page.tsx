import { auth } from "@/auth";
import { caseRepository } from "@/features/cases/repositories/case-repository";
import { CaseList } from "@/features/cases/components/case-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon, Gavel } from "lucide-react";
import { redirect } from "next/navigation";
import { CasesDashboard } from "@/features/cases/components/cases-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CasesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const cases = await caseRepository.findMany(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Case Management</h2>
        <Button asChild>
          <Link href="/dashboard/cases/new">
            <PlusIcon className="mr-2 h-4 w-4" /> New Case
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Case List</TabsTrigger>
          <TabsTrigger value="dashboard">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
            <CaseList cases={cases as any} />
        </TabsContent>
        <TabsContent value="dashboard" className="space-y-4">
            <CasesDashboard organizationId={user.organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
