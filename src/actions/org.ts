"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { checkPermission } from "@/lib/permissions";

export async function getOrganization() {
  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;

  if (!organizationId) return null;

  return await db.organization.findUnique({
    where: { id: organizationId },
    include: {
      users: {
        include: {
          userRoles: {
            include: { role: true }
          }
        }
      }
    }
  });
}

export async function updateOrganization(values: any) {
  await checkPermission("update", "organization");

  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;

  const oldData = await db.organization.findUnique({ where: { id: organizationId } });

  const updated = await db.organization.update({
    where: { id: organizationId },
    data: {
      name: values.name,
      address: values.address,
      logo: values.logo,
    },
  });

  await createAuditLog({
    action: "UPDATE",
    entity: "Organization",
    entityId: organizationId,
    oldData,
    newData: updated,
  });

  revalidatePath("/settings/organization");
  return { success: "Organization updated!" };
}
