import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { NewInvoiceForm } from "@/features/finance/components/new-invoice-form";
import { serialize } from "@/lib/utils";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  let tenant = null;
  if (params.tenantId) {
    tenant = await db.tenant.findUnique({
      where: { id: params.tenantId },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: { unit: true }
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NewInvoiceForm tenant={serialize(tenant)} />
    </div>
  );
}
