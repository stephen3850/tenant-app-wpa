"use server";

import { auth } from "@/auth";
import { allocationService } from "../services/allocation-service";
import { ManualAllocationSchema } from "../schemas/payment-schemas";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

async function getOrgId() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return (session.user as any).organizationId as string;
}

export async function manualAllocateAction(input: any) {
  const organizationId = await getOrgId();
  const validated = ManualAllocationSchema.parse(input);

  await db.$transaction(async (tx) => {
    // In a real app, you might want to check if the payment has remaining balance
    // This example follows the structure requested.
    await allocationService.allocateAutomatically(tx, organizationId, "tenant_id_here", validated.paymentId, validated.amount);
  });

  revalidatePath("/finance/payments");
  return { success: true };
}
