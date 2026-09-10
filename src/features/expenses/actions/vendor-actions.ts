"use server";

import { auth } from "@/auth";
import { vendorService } from "../services/vendor-service";
import { VendorSchema } from "../schemas/vendor-schemas";
import { revalidatePath } from "next/cache";

async function getOrgId() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return (session.user as any).organizationId as string;
}

export async function createVendorAction(input: any) {
  const organizationId = await getOrgId();
  const validated = VendorSchema.parse(input);
  const result = await vendorService.createVendor(organizationId, validated);
  revalidatePath("/expenses/vendors");
  return result;
}

export async function updateVendorAction(id: string, input: any) {
  const organizationId = await getOrgId();
  const validated = VendorSchema.parse(input);
  const result = await vendorService.updateVendor(organizationId, id, validated);
  revalidatePath("/expenses/vendors");
  return result;
}
