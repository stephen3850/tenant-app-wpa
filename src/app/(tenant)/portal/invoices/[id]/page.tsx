import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { tenantInvoiceService } from "@/features/tenant/services/tenant-invoice-service";
import { InvoiceDetails } from "@/features/tenant/components/invoice-details";

export default async function TenantInvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  try {
    const invoice = await tenantInvoiceService.getInvoiceDetails(session.user.id, id);
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InvoiceDetails invoice={invoice} />
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
