import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { tenantDocumentService } from "@/features/tenant/services/tenant-document-service";
import { DocumentList } from "@/features/tenant/components/document-list";
import { DocumentFilters } from "@/features/tenant/components/document-filters";
import { UploadTenantDocumentDialog } from "@/features/tenant/components/upload-document-dialog";
import { DocumentCategory, DocumentStatus } from "@prisma/client";

export default async function TenantDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: DocumentCategory;
    status?: DocumentStatus;
    search?: string
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const documents = await tenantDocumentService.getTenantDocuments(session.user.id, {
    category: params.category,
    status: params.status,
    search: params.search,
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Document Center</h2>
          <p className="text-muted-foreground">
            Access, manage, and upload your official records and identity documents.
          </p>
        </div>
        <UploadTenantDocumentDialog />
      </div>

      <DocumentFilters />

      <DocumentList documents={documents} />
    </div>
  );
}
