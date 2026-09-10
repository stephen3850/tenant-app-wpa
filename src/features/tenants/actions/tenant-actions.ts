"use server";

import { tenantService } from "../services/tenant-service";
import { TenantFormValues, TenantFilters } from "../schemas/tenant-schema";
import { revalidatePath } from "next/cache";
import { TenantStatus } from "@prisma/client";
import { serialize } from "@/lib/utils";

export async function getTenants(filters: TenantFilters) {
  try {
    const tenants = await tenantService.listTenants(filters);
    return serialize(tenants);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getTenant(id: string) {
  try {
    const tenant = await tenantService.getTenant(id);
    return serialize(tenant);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createTenant(values: TenantFormValues) {
  try {
    const tenant = await tenantService.createTenant(values);
    revalidatePath("/tenants");
    return { success: true, data: serialize(tenant) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createFullTenantAction(formData: any) {
  try {
    const tenant = await tenantService.createFullTenant(formData);
    revalidatePath("/tenants");
    revalidatePath("/dashboard");
    return { success: true, data: serialize(tenant) };
  } catch (error: any) {
    console.error("Failed to create full tenant:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTenant(id: string, values: Partial<TenantFormValues>) {
  try {
    const tenant = await tenantService.updateTenant(id, values);
    revalidatePath("/tenants");
    revalidatePath(`/tenants/${id}`);
    return { success: true, data: serialize(tenant) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTenantStatus(id: string, status: TenantStatus) {
  try {
    await tenantService.updateStatus(id, status);
    revalidatePath("/tenants");
    revalidatePath(`/tenants/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTenantStats() {
  try {
    return await tenantService.getTenantStats();
  } catch (error: any) {
    throw new Error(error.message);
  }
}
