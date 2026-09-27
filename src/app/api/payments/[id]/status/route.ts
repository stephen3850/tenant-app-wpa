import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { maskPhoneNumber } from "@/lib/encryption";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    // Search by payment ID or checkoutRequestId
    let payment = await db.payment.findFirst({
      where: {
        OR: [
          { id },
          { mpesaTransactions: { some: { checkoutRequestId: id } } },
        ],
      },
      include: {
        mpesaTransactions: true,
        receipt: true,
        paymentAccount: {
          select: {
            displayName: true,
            accountType: true,
            provider: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment transaction not found" }, { status: 404 });
    }

    // Verify tenant authorization or admin access
    const tenant = await db.tenant.findFirst({
      where: { userId },
    });

    if (tenant && payment.tenantId !== tenant.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const mpesaTx = payment.mpesaTransactions[0];

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: Number(payment.amount),
      method: payment.method,
      receiptNumber: payment.receiptNumber || mpesaTx?.mpesaReceiptNumber || null,
      transactionRef: payment.transactionRef || mpesaTx?.mpesaReceiptNumber || null,
      phoneNumber: maskPhoneNumber(mpesaTx?.phoneNumber),
      paymentAccount: payment.paymentAccount?.displayName || "M-Pesa",
      resultCode: mpesaTx?.resultCode ?? null,
      resultDesc: mpesaTx?.resultDesc ?? null,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (error: any) {
    console.error("[Payment Status API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
