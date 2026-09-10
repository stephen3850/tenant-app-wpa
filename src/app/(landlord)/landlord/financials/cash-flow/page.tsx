import { getCashFlowReport } from "@/actions/landlord-financial";
import { LandlordCashFlowReport } from "@/features/landlord/components/landlord-cash-flow-report";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CashFlowPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const data = await getCashFlowReport();

  return <LandlordCashFlowReport data={data} />;
}
