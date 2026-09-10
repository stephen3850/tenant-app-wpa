import { getMaintenanceTickets } from "@/actions/landlord-maintenance";
import { LandlordTicketOversight } from "@/features/landlord/components/landlord-ticket-oversight";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordTicketsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const tickets = await getMaintenanceTickets();

  return <LandlordTicketOversight tickets={tickets} />;
}
