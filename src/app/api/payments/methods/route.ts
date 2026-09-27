import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PaymentMethod } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId") || undefined;
    const leaseId = searchParams.get("leaseId") || undefined;

    const tenant = await db.tenant.findFirst({
      where: { userId: session.user.id },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: { property: true },
          take: 1,
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant profile not found" }, { status: 404 });
    }

    const activeLease = tenant.leases[0];
    const propertyId = activeLease?.propertyId;
    const organizationId = tenant.organizationId;

    // Fetch payment accounts for this organisation
    const accounts = await db.paymentAccount.findMany({
      where: {
        organizationId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        provider: true,
        accountType: true,
        displayName: true,
        shortCode: true,
        isDefault: true,
      },
    });

    // Fetch property routes
    const routes = propertyId
      ? await db.paymentRoute.findMany({
          where: { organizationId, propertyId },
          include: {
            paymentAccount: {
              select: {
                id: true,
                provider: true,
                accountType: true,
                displayName: true,
                shortCode: true,
              },
            },
          },
        })
      : [];

    return NextResponse.json({
      organizationId,
      property: activeLease?.property
        ? {
            id: activeLease.property.id,
            name: activeLease.property.propertyName,
            paybillNumber: activeLease.property.paybillNumber,
            bankName: activeLease.property.bankName,
            accountNumber: activeLease.property.accountNumber,
          }
        : null,
      accounts,
      routes,
      tenantCode: tenant.tenantCode || tenant.id.slice(0, 8),
    });
  } catch (error: any) {
    console.error("[Get Payment Methods Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
