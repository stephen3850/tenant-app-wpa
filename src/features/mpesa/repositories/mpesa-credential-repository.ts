import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class MpesaCredentialRepository {
  async findByOrganizationId(organizationId: string) {
    return db.mpesaCredential.findUnique({
      where: { organizationId },
    });
  }

  async upsert(organizationId: string, data: any) {
    return db.mpesaCredential.upsert({
      where: { organizationId },
      update: data,
      create: { ...data, organizationId },
    });
  }
}

export const mpesaCredentialRepository = new MpesaCredentialRepository();
