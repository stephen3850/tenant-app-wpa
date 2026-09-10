import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantMaintenanceService } from "@/features/tenant/services/tenant-maintenance-service";
import { CreateRequestForm } from "@/features/tenant/components/create-request-form";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewTicketPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const categories = await tenantMaintenanceService.getCategories(session.user.id);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-blue-600" asChild>
          <Link href="/portal/tickets">
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Tickets
          </Link>
        </Button>
        <CreateRequestForm categories={categories} />
      </div>
    </div>
  );
}
