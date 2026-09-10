import { db } from "@/lib/db";
import { auth } from "@/auth";

export class VisitorService {
  async logEntry(data: {
    visitorName: string;
    idNumber?: string;
    phoneNumber?: string;
    purpose?: string;
  }) {
    const session = await auth();
    const organizationId = (session?.user as any).organizationId;

    return db.securityVisitor.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async logExit(id: string) {
    return db.securityVisitor.update({
      where: { id },
      data: { checkOutTime: new Date() },
    });
  }

  async getLogs() {
    const session = await auth();
    const organizationId = (session?.user as any).organizationId;

    return db.securityVisitor.findMany({
      where: { organizationId },
      orderBy: { checkInTime: "desc" },
    });
  }
}

export const visitorService = new VisitorService();
