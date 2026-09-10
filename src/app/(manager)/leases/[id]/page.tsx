import { getLease } from "@/features/leases/actions/lease-actions";
import { LeaseDetails } from "@/features/leases/components/lease-details";
import { TerminationDialog } from "@/features/leases/components/termination-dialog";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function LeaseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lease = await getLease(id);

  if (!lease) {
    notFound();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <Button asChild variant="ghost">
          <Link href="/leases">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leases
          </Link>
        </Button>
        <div className="flex gap-2">
          {lease.status === "ACTIVE" && (
            <>
              <Button asChild variant="outline">
                <Link href={`/leases/${id}/renew`}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Renew Lease
                </Link>
              </Button>
              <TerminationDialog onTerminate={async (values) => {
                "use server";
                // Termination logic
              }} />
            </>
          )}
          <Button asChild>
            <Link href={`/leases/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Lease
            </Link>
          </Button>
        </div>
      </div>

      <LeaseDetails lease={lease} />
    </div>
  );
}
