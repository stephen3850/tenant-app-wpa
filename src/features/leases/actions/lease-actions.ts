"use server";

import { leaseService } from "../services/lease-service";
import { LeaseFormValues, LeaseFilterValues, TerminationValues } from "../schemas";
import { revalidatePath } from "next/cache";

export async function getLeases(filters: LeaseFilterValues) {
  try {
    return await leaseService.listLeases(filters);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getLease(id: string) {
  try {
    return await leaseService.getLease(id);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createLease(values: LeaseFormValues) {
  try {
    const lease = await leaseService.createLease(values);
    revalidatePath("/leases");
    revalidatePath(`/units/${values.unitId}`);
    return { success: true, data: lease };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function terminateLease(id: string, values: TerminationValues) {
  try {
    await leaseService.terminateLease(id, values);
    revalidatePath("/leases");
    revalidatePath(`/leases/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function renewLease(id: string, values: LeaseFormValues) {
  try {
    const newLease = await leaseService.renewLease(id, values);
    revalidatePath("/leases");
    revalidatePath(`/leases/${id}`);
    revalidatePath(`/leases/${newLease.id}`);
    return { success: true, data: newLease };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function restoreLeaseAction(id: string) {
  try {
    await leaseService.restoreLease(id);
    revalidatePath("/leases");
    revalidatePath("/archive");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function permanentDeleteLeaseAction(id: string) {
  try {
    await leaseService.permanentDeleteLease(id);
    revalidatePath("/archive");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getLeaseStats() {
  try {
    return await leaseService.getLeaseStats();
  } catch (error: any) {
    throw new Error(error.message);
  }
}
