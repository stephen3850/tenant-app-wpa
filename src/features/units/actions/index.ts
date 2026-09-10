"use server";

import { unitService } from "../services/unit-service";
import { UnitFormValues, UnitFilterValues } from "../schemas";
import { revalidatePath } from "next/cache";

export async function getUnitsAction(filters: UnitFilterValues = {}) {
  try {
    return { data: await unitService.listUnits(filters) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createUnitAction(values: UnitFormValues) {
  try {
    const data = await unitService.createUnit(values);
    revalidatePath("/units");
    revalidatePath(`/properties/${values.propertyId}`);
    return { data, success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateUnitAction(id: string, values: UnitFormValues) {
  try {
    const data = await unitService.updateUnit(id, values);
    revalidatePath("/units");
    revalidatePath(`/units/${id}`);
    revalidatePath(`/properties/${values.propertyId}`);
    return { data, success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteUnitAction(id: string) {
  try {
    const unit = await unitService.getUnit(id);
    await unitService.archiveUnit(id);
    revalidatePath("/units");
    if (unit) revalidatePath(`/properties/${unit.propertyId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function permanentDeleteUnitAction(id: string) {
  try {
    await unitService.permanentDeleteUnit(id);
    revalidatePath("/archive");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreUnitAction(id: string) {
  try {
    const unit = await unitService.restoreUnit(id);
    revalidatePath("/units");
    revalidatePath("/archive");
    if (unit) revalidatePath(`/properties/${unit.propertyId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getUnitStatsAction() {
  try {
    return { data: await unitService.getUnitStats() };
  } catch (error: any) {
    return { error: error.message };
  }
}
