import { getArrearsReport } from "@/actions/landlord-financial";
import { LandlordArrearsReport } from "@/features/landlord/components/landlord-arrears-report";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ArrearsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const data = await getArrearsReport();

  return <LandlordArrearsReport data={data} />;
}
