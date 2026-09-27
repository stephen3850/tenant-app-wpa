import { db } from "@/lib/db";

export class TenantReceiptRepository {
  async findManyByTenantId(tenantId: string, limit = 50) {
    return db.receipt.findMany({
      where: {
        payment: {
          tenantId: tenantId,
        },
      },
      include: {
        payment: {
          include: {
            allocations: {
              include: {
                invoice: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  async findById(id: string, tenantId: string, userEmail?: string, userId?: string) {
    return db.receipt.findFirst({
      where: {
        OR: [
          { id },
          { payment: { receiptNumber: id } },
          { payment: { transactionRef: id } }
        ],
        payment: {
          OR: [
            { tenantId },
            ...(userId ? [{ tenant: { userId } }] : []),
            ...(userEmail ? [{ tenant: { email: { equals: userEmail, mode: "insensitive" as const } } }] : [])
          ]
        },
      },
      include: {
        payment: {
          include: {
            tenant: true,
            allocations: {
              include: {
                invoice: {
                  include: {
                    lease: {
                      include: {
                        unit: {
                          include: {
                            property: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}

export const tenantReceiptRepository = new TenantReceiptRepository();
