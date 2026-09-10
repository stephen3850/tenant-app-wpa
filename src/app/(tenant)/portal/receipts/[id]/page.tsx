import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { tenantReceiptService } from "@/features/tenant/services/tenant-receipt-service";
import { ReceiptDetails } from "@/features/tenant/components/receipt-details";

export default async function TenantReceiptDetailsPage({ params }: any) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  try {
    const receipt = await tenantReceiptService.getReceiptDetails(session.user.id, id);
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ReceiptDetails receipt={receipt} />
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
