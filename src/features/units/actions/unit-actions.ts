"use server";

import { unitService } from "../services/unit-service";
import { UnitFormValues, UnitFilters } from "../schemas/unit-schema";
import { revalidatePath } from "next/cache";
import { OccupancyStatus } from "@prisma/client";
import { serialize } from "@/lib/utils";

export async function getUnits(filters: UnitFilters) {
  try {
    const units = await unitService.listUnits(filters);
    return serialize(units);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getUnit(id: string) {
  try {
    const unit = await unitService.getUnit(id);
    return serialize(unit);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createUnit(values: UnitFormValues) {
  try {
    const unit = await unitService.createUnit(values);
    revalidatePath("/units");
    revalidatePath(`/properties/${values.propertyId}`);
    revalidatePath("/landlord/properties");
    revalidatePath(`/landlord/properties/${values.propertyId}`);
    revalidatePath("/dashboard");
    revalidatePath("/landlord/dashboard");
    return { success: true, data: serialize(unit) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function bulkCreateUnitsAction(propertyId: string, units: any[]) {
  try {
    const result = await unitService.bulkCreateUnits(propertyId, units);
    revalidatePath("/units");
    revalidatePath(`/properties/${propertyId}`);
    revalidatePath("/landlord/properties");
    revalidatePath(`/landlord/properties/${propertyId}`);
    return { success: true, count: result.count };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUnit(id: string, values: Partial<UnitFormValues>) {
  try {
    const unit = await unitService.updateUnit(id, values);
    revalidatePath("/units");
    revalidatePath(`/units/${id}`);
    if (values.propertyId) {
      revalidatePath(`/properties/${values.propertyId}`);
      revalidatePath(`/landlord/properties/${values.propertyId}`);
    }
    revalidatePath("/landlord/properties");
    revalidatePath("/dashboard");
    revalidatePath("/landlord/dashboard");
    return { success: true, data: serialize(unit) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function archiveUnit(id: string) {
  try {
    await unitService.archiveUnit(id);
    revalidatePath("/units");
    revalidatePath(`/units/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function restoreUnit(id: string) {
  try {
    await unitService.restoreUnit(id);
    revalidatePath("/units");
    revalidatePath(`/units/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUnitOccupancy(id: string, status: OccupancyStatus) {
  try {
    await unitService.updateOccupancy(id, status);
    revalidatePath("/units");
    revalidatePath(`/units/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUnitStats() {
  try {
    return await unitService.getUnitStats();
  } catch (error: any) {
    throw new Error(error.message);
  }
}
