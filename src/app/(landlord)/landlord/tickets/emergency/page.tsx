import { getEmergencyTickets } from "@/actions/landlord-maintenance";
import { LandlordTicketOversight } from "@/features/landlord/components/landlord-ticket-oversight";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangleIcon } from "lucide-react";

export default async function LandlordEmergencyPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const tickets = await getEmergencyTickets();

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 py-10">
       <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex items-center gap-6">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
             <AlertTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <div>
             <h1 className="text-3xl font-black text-red-900 tracking-tight">Emergency Monitor</h1>
             <p className="text-red-700 font-medium">Critical issues requiring immediate attention across your portfolio.</p>
          </div>
       </div>

       {tickets.length > 0 ? (
          <LandlordTicketOversight tickets={tickets} />
       ) : (
          <Card className="border-emerald-100 bg-emerald-50/20 py-20">
             <CardContent className="flex flex-col items-center text-center">
                <div className="bg-emerald-100 p-4 rounded-full mb-4">
                   <AlertTriangleIcon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900">All Systems Clear</h3>
                <p className="text-slate-500 max-w-sm mt-2 font-medium">There are currently no active emergency tickets in your properties.</p>
             </CardContent>
          </Card>
       )}
    </div>
  );
}
