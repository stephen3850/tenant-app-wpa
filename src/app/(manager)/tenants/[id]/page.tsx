import { getTenant } from "@/features/tenants/actions/tenant-actions";
import { TenantProfile } from "@/features/tenants/components/tenant-profile";
import { notFound } from "next/navigation";

export default async function TenantDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getTenant(id);

  if (!tenant) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <TenantProfile tenant={tenant} />
    </div>
  );
}
