"use server";

import { leaseService } from "../services/lease-service";
import { revalidatePath } from "next/cache";

export async function createLeaseAction(data: any) {
  try {
    const res = await leaseService.createLease(data);
    revalidatePath("/rentals/leases");
    revalidatePath("/dashboard");
    revalidatePath("/landlord/dashboard");
    revalidatePath("/landlord/tenancies");
    return { data: res, success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getLeasesAction() {
  try {
    const data = await leaseService.listLeases();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function terminateLeaseAction(id: string) {
  try {
    await leaseService.terminateLease(id);
    revalidatePath("/rentals/leases");
    revalidatePath("/dashboard");
    revalidatePath("/landlord/dashboard");
    revalidatePath("/landlord/tenancies");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
