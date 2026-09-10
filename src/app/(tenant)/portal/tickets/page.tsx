import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantMaintenanceService } from "@/features/tenant/services/tenant-maintenance-service";
import { MaintenanceList } from "@/features/tenant/components/maintenance-list";
import { MaintenanceFilters } from "@/features/tenant/components/maintenance-filters";
import { Button } from "@/components/ui/button";
import { PlusIcon, WrenchIcon } from "lucide-react";
import Link from "next/link";
import { TicketStatus } from "@prisma/client";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: TicketStatus;
    search?: string
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const requests = await tenantMaintenanceService.getRequests(session.user.id, {
    status: params.status,
    search: params.search,
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <WrenchIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tickets Center</h2>
            <p className="text-muted-foreground">
              Report issues and track their resolution progress.
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/portal/tickets/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Ticket
          </Link>
        </Button>
      </div>

      <MaintenanceFilters />

      <MaintenanceList requests={requests} />
    </div>
  );
}
