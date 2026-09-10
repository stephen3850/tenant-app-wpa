import { getOrganizations } from "@/actions/organization-management";
import { OrganizationsTable } from "./components/organizations-table";
import { OrganizationsFilters } from "./components/organizations-filters";
import { Button } from "@/components/ui/button";
import { PlusIcon, DownloadIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const filters = {
    search: params.search,
    status: params.status as any,
    plan: params.plan,
  };

  const organizations = await getOrganizations(filters);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Organizations</h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage and monitor all tenant organizations on the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="font-bold border-slate-200">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Organization
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Orgs</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{organizations.length}</p>
              </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Trials</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">
                      {organizations.filter(o => o.status === "TRIAL").length}
                  </p>
              </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">At Risk</p>
                  <p className="text-2xl font-black text-red-600 mt-1">
                      {organizations.filter(o => o.healthScore < 50).length}
                  </p>
              </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Suspended</p>
                  <p className="text-2xl font-black text-slate-500 mt-1">
                      {organizations.filter(o => o.status === "SUSPENDED").length}
                  </p>
              </CardContent>
          </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">
                    Organization Directory
                </CardTitle>
                <OrganizationsFilters />
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <OrganizationsTable organizations={organizations} />
        </CardContent>
      </Card>
    </div>
  );
}
