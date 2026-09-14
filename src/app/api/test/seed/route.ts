import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Ensure Roles exist
    const roleNames = ["SUPER_ADMIN", "PROPERTY_MANAGER", "LANDLORD", "TENANT"];
    const roles: Record<string, any> = {};

    for (const name of roleNames) {
      let role = await db.role.findFirst({
        where: { name, organizationId: null },
      });

      if (!role) {
        role = await db.role.create({
          data: {
            name,
            description: `System ${name} role`,
            organizationId: null,
          },
        });
      }
      roles[name] = role;
    }

    // 2. Create Test Organization
    const orgSlug = "test-org-" + Math.random().toString(36).substring(7);
    const org = await db.organization.create({
      data: {
        name: "Testing Organization",
        slug: orgSlug,
        status: "ACTIVE",
      },
    });

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 3. Create Admin User
    const admin = await db.user.create({
      data: {
        name: "Test Admin",
        email: `admin@${orgSlug}.com`,
        password: hashedPassword,
        organizationId: org.id,
        status: "ACTIVE",
      },
    });
    await db.userRole.create({
      data: { userId: admin.id, roleId: roles["PROPERTY_MANAGER"].id },
    });

    // 4. Create Landlord User
    const landlord = await db.user.create({
      data: {
        name: "Test Landlord",
        email: `landlord@${orgSlug}.com`,
        password: hashedPassword,
        organizationId: org.id,
        status: "ACTIVE",
      },
    });
    await db.userRole.create({
      data: { userId: landlord.id, roleId: roles["LANDLORD"].id },
    });

    // 5. Create Tenant User
    const tenantUser = await db.user.create({
      data: {
        name: "Test Tenant",
        email: `tenant@${orgSlug}.com`,
        password: hashedPassword,
        organizationId: org.id,
        status: "ACTIVE",
      },
    });
    await db.userRole.create({
      data: { userId: tenantUser.id, roleId: roles["TENANT"].id },
    });

    return NextResponse.json({
      success: true,
      organization: org.name,
      slug: org.slug,
      users: [
        { role: "ADMIN", email: admin.email, password: "password123" },
        { role: "LANDLORD", email: landlord.email, password: "password123" },
        { role: "TENANT", email: tenantUser.email, password: "password123" },
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
