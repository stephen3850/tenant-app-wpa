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

    return db.visitorLog.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async logExit(id: string) {
    return db.visitorLog.update({
      where: { id },
      data: { exitTime: new Date() },
    });
  }

  async getLogs() {
    const session = await auth();
    const organizationId = (session?.user as any).organizationId;

    return db.visitorLog.findMany({
      where: { organizationId },
      orderBy: { entryTime: "desc" },
    });
  }
}

export const visitorService = new VisitorService();
