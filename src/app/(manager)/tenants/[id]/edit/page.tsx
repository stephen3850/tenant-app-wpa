import { getTenant } from "@/features/tenants/actions/tenant-actions";
import { TenantForm } from "@/features/tenants/components/tenant-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditTenantPage({
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
    <div className="p-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Tenant: {tenant.firstName} {tenant.lastName}</CardTitle>
        </CardHeader>
        <CardContent>
          <TenantForm
            initialData={tenant as any}
            onSubmit={async (values) => {
              "use server";
              // Update logic
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
