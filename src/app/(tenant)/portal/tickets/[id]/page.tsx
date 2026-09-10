import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { tenantMaintenanceService } from "@/features/tenant/services/tenant-maintenance-service";
import { MaintenanceDetail } from "@/features/tenant/components/maintenance-detail";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  try {
    const ticket = await tenantMaintenanceService.getRequestDetails(session.user.id, id);
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-blue-600" asChild>
            <Link href="/portal/tickets">
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Back to Tickets Center
            </Link>
          </Button>

          <MaintenanceDetail ticket={ticket} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Ticket Detail Error:", error);
    notFound();
  }
}
