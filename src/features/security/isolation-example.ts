import { auth } from "@/auth";
import { getTenantDb, BYPASS_TENANT_ISOLATION } from "@/lib/tenant-db";

/**
 * Example of how to use the tenant-aware DB in a Server Action or Service.
 */
export async function getInvoicesSecurely() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const organizationId = (session.user as any).organizationId;

  // 1. Get the isolated client
  const tdb = getTenantDb(organizationId);

  // 2. Query as usual. organizationId is automatically injected.
  // This query: tdb.invoice.findMany()
  // actually executes: db.invoice.findMany({ where: { organizationId } })
  const invoices = await tdb.invoice.findMany({
    orderBy: { createdAt: "desc" }
  });

  return invoices;
}

/**
 * Example of bypassing isolation for a system task.
 */
export async function globalSystemCleanup() {
    // Option A: Use the systemDb directly
    // import { systemDb } from "@/lib/tenant-db";
    // await systemDb.auditLog.deleteMany({ where: { createdAt: { lt: oldDate } } });

    // Option B: Use the bypass symbol on an isolated client (if needed)
    // const tdb = getTenantDb(someId);
    // await tdb.auditLog.count({
    //   [BYPASS_TENANT_ISOLATION as any]: true
    // } as any);
}
