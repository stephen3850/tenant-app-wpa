import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTenantDb } from "@/lib/tenant-db";
import { serialize } from "@/lib/utils";
import { DocumentsView } from "@/features/documents/components/documents-view";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { tenantId?: string; propertyId?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const db = getTenantDb(organizationId);

  const [docs, propDocs] = await Promise.all([
    db.document.findMany({
      include: { tenant: true },
      orderBy: { createdAt: 'desc' }
    }),
    db.propertyDocument.findMany({
      include: { property: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  let allDocuments = [
    ...docs.map(d => ({
      id: d.id,
      tenantId: d.tenantId,
      category: d.category,
      name: d.name,
      linkedTo: `${d.tenant.firstName} ${d.tenant.lastName}`,
      property: "N/A",
      nextReview: d.expiryDate,
      uploaded: d.createdAt,
      idNumber: d.id.slice(-6).toUpperCase(),
      type: 'tenant'
    })),
    ...propDocs.map(d => ({
      id: d.id,
      propertyId: d.propertyId,
      category: d.category,
      name: d.name,
      linkedTo: d.property.propertyName,
      property: d.property.propertyName,
      nextReview: null,
      uploaded: d.createdAt,
      idNumber: d.id.slice(-6).toUpperCase(),
      type: 'property'
    }))
  ];

  if (searchParams.tenantId) {
    allDocuments = allDocuments.filter(d => d.tenantId === searchParams.tenantId);
  }
  if (searchParams.propertyId) {
    allDocuments = allDocuments.filter(d => d.propertyId === searchParams.propertyId);
  }

  allDocuments.sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime());
  const serializedDocs = serialize(allDocuments);

  return (
    <div className="p-3 bg-[#F8F9FB] min-h-screen">
       <DocumentsView initialDocs={serializedDocs} />
    </div>
  );
}
