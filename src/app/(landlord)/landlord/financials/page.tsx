import { getLandlordFinancialDashboard } from "@/actions/landlord-financial";
import { LandlordFinancialDashboard } from "@/features/landlord/components/landlord-financial-dashboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordFinancialsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const data = await getLandlordFinancialDashboard();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <LandlordFinancialDashboard data={data} />
    </div>
  );
}
