import { getDisbursementHistory } from "@/actions/landlord-financial";
import { DisbursementHistoryList } from "@/features/landlord/components/disbursement-history-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DisbursementsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const disbursements = await getDisbursementHistory();

  return <DisbursementHistoryList disbursements={disbursements} />;
}
