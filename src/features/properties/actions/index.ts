"use server";

import { propertyService } from "../services/property-service";
import { PropertyFormValues, PropertyFilterValues } from "../schemas";
import { revalidatePath } from "next/cache";

export async function getPropertiesAction(filters: PropertyFilterValues = {}) {
  try {
    return { data: await propertyService.listProperties(filters) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createPropertyAction(values: PropertyFormValues) {
  try {
    const data = await propertyService.createProperty(values);
    revalidatePath("/properties");
    return { data, success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updatePropertyAction(id: string, values: PropertyFormValues) {
  try {
    const data = await propertyService.updateProperty(id, values);
    revalidatePath("/properties");
    revalidatePath(`/properties/${id}`);
    return { data, success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deletePropertyAction(id: string) {
  try {
    await propertyService.deleteProperty(id);
    revalidatePath("/properties");
    revalidatePath("/archive");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function permanentDeletePropertyAction(id: string) {
  try {
    await propertyService.permanentDeleteProperty(id);
    revalidatePath("/archive");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restorePropertyAction(id: string) {
  try {
    await propertyService.restoreProperty(id);
    revalidatePath("/properties");
    revalidatePath("/archive");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getPropertyStatsAction() {
  try {
    return { data: await propertyService.getDashboardStats() };
  } catch (error: any) {
    return { error: error.message };
  }
}
