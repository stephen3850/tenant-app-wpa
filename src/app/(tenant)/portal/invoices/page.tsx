import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantInvoiceService } from "@/features/tenant/services/tenant-invoice-service";
import { InvoiceList } from "@/features/tenant/components/invoice-list";

export default async function TenantInvoicesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  try {
    const invoices = await tenantInvoiceService.getInvoices(session.user.id, {});

    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">My Invoices</h2>
        </div>
        <InvoiceList initialInvoices={invoices} />
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-destructive">Error loading invoices</h2>
            <p className="text-muted-foreground">Please try again later or contact support.</p>
        </div>
    );
  }
}
