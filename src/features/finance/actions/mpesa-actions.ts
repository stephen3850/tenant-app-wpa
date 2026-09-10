"use server";

import { auth } from "@/auth";
import { mpesaService } from "../services/mpesa-service";
import { revalidatePath } from "next/cache";

async function getOrgContext() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return (session.user as any).organizationId as string;
}

export async function initiateStkPushAction(params: {
  amount: number;
  phoneNumber: string;
  tenantId?: string;
  invoiceId?: string;
}) {
  const organizationId = await getOrgContext();

  // Format phone to 2547XXXXXXXX
  let phone = params.phoneNumber.replace(/\+/g, "");
  if (phone.startsWith("0")) phone = "254" + phone.slice(1);
  if (phone.startsWith("7")) phone = "254" + phone;

  const result = await mpesaService.initiateStkPush({
    ...params,
    phoneNumber: phone,
    organizationId,
  });

  return result;
}

export async function getMpesaMetricsAction() {
  const organizationId = await getOrgContext();
  return await mpesaService.getMetrics(organizationId);
}
