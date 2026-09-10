import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RecordsDashboard } from "@/features/records/components/records-dashboard";

export default async function RecordsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Records & Compliance</h2>
      </div>
      <RecordsDashboard />
    </div>
  );
}
