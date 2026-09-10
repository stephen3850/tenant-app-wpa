import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantReceiptService } from "@/features/tenant/services/tenant-receipt-service";
import { ReceiptList } from "@/features/tenant/components/receipt-list";

export default async function TenantReceiptsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  try {
    const receipts = await tenantReceiptService.getReceipts(session.user.id);

    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Payment Receipts</h2>
        </div>
        <ReceiptList receipts={receipts} />
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-destructive">Error loading receipts</h2>
            <p className="text-muted-foreground">Please try again later or contact support.</p>
        </div>
    );
  }
}
