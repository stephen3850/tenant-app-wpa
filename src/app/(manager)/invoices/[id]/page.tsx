import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { InvoiceDetails } from "@/features/tenant/components/invoice-details";
import { serialize } from "@/lib/utils";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  const invoice = await db.invoice.findUnique({
    where: { id: id },
    include: {
      lease: {
        include: {
          unit: {
            include: {
              property: true
            }
          },
          tenant: true
        }
      },
      lineItems: true
    }
  });

  if (!invoice) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Invoice not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <InvoiceDetails invoice={serialize(invoice)} />
    </div>
  );
}
