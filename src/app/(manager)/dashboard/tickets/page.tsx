import { auth } from "@/auth";
import { ticketRepository } from "@/features/tickets/repositories/ticket-repository";
import { TicketList } from "@/features/tickets/components/ticket-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TicketsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const tickets = await ticketRepository.findMany(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
        <Button asChild>
          <Link href="/dashboard/tickets/new">
            <PlusIcon className="mr-2 h-4 w-4" /> New Ticket
          </Link>
        </Button>
      </div>
      <TicketList tickets={tickets as any} />
    </div>
  );
}
