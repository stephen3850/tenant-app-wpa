import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { paymentRouter } from "@/lib/payments/router";
import { paymentProviderFactory } from "@/lib/payments/provider-factory";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { maskPhoneNumber } from "@/lib/encryption";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { amount, phoneNumber, invoiceId, leaseId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // 1. Resolve tenant profile
    const tenant = await db.tenant.findFirst({
      where: { userId },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant profile not found" }, { status: 404 });
    }

    const organizationId = tenant.organizationId;
    const activeLease = tenant.leases[0];
    const resolvedLeaseId = leaseId || activeLease?.id;
    const resolvedPropertyId = activeLease?.propertyId;

    // 2. Format Phone Number
    let formattedPhone = phoneNumber.replace(/\+/g, "").trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) {
      formattedPhone = "254" + formattedPhone;
    }

    // 3. Resolve Payment Account via Payment Routing Engine
    const paymentAccount = await paymentRouter.resolvePaymentAccount({
      organizationId,
      propertyId: resolvedPropertyId,
      leaseId: resolvedLeaseId,
      invoiceId,
      paymentMethod: PaymentMethod.MPESA,
    });

    // 4. Create PENDING Payment & MpesaTransaction records before initiating request
    const pendingPayment = await db.payment.create({
      data: {
        organizationId,
        tenantId: tenant.id,
        leaseId: resolvedLeaseId,
        invoiceId,
        paymentAccountId: paymentAccount.id,
        amount,
        method: PaymentMethod.MPESA,
        status: PaymentStatus.PENDING,
        notes: `STK Push requested via ${paymentAccount.displayName}`,
      },
    });

    const accountRef = tenant.tenantCode || tenant.id.slice(0, 8);

    const mpesaTx = await db.mpesaTransaction.create({
      data: {
        organizationId,
        tenantId: tenant.id,
        invoiceId,
        paymentAccountId: paymentAccount.id,
        paymentId: pendingPayment.id,
        amount,
        phoneNumber: formattedPhone,
        accountReference: accountRef,
        status: "PENDING",
        transactionType: "STK_PUSH",
      },
    });

    // 5. Initiate STK Push via Provider Abstraction
    const provider = paymentProviderFactory.getProvider("MPESA");
    const result = await provider.initiatePayment(
      {
        amount,
        phoneNumber: formattedPhone,
        accountReference: accountRef,
        paymentAccountId: paymentAccount.id,
        organizationId,
        tenantId: tenant.id,
        invoiceId,
        leaseId: resolvedLeaseId,
        propertyId: resolvedPropertyId,
      },
      paymentAccount
    );

    if (result.success) {
      // Update Payment and MpesaTransaction with CheckoutRequestID
      await db.payment.update({
        where: { id: pendingPayment.id },
        data: {
          status: PaymentStatus.STK_REQUESTED,
        },
      });

      await db.mpesaTransaction.update({
        where: { id: mpesaTx.id },
        data: {
          merchantRequestId: result.merchantRequestId,
          checkoutRequestId: result.checkoutRequestId,
          status: "STK_REQUESTED",
        },
      });

      await createAuditLog({
        action: "STK_PUSH_INITIATED",
        entity: "Payment",
        entityId: pendingPayment.id,
        organizationId,
        userId,
        newData: {
          amount,
          phone: maskPhoneNumber(formattedPhone),
          paymentAccountId: paymentAccount.id,
          checkoutRequestId: result.checkoutRequestId,
        },
      });

      return NextResponse.json({
        success: true,
        paymentId: pendingPayment.id,
        checkoutRequestId: result.checkoutRequestId,
        message: result.customerMessage || "STK push initiated successfully",
      });
    } else {
      // Mark as failed
      await db.payment.update({
        where: { id: pendingPayment.id },
        data: { status: PaymentStatus.FAILED },
      });

      await db.mpesaTransaction.update({
        where: { id: mpesaTx.id },
        data: { status: "FAILED", resultDesc: result.responseDescription },
      });

      return NextResponse.json(
        { error: result.responseDescription || "Failed to initiate M-Pesa payment" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("[STK Push Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process STK push request" },
      { status: 500 }
    );
  }
}
