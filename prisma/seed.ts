import 'dotenv/config';
import { PrismaClient } from "./generated-client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // 1. Create System Permissions
  const permissions = [
    { action: "manage", subject: "all", description: "Full access to all resources" },
    { action: "read", subject: "property", description: "Can view properties" },
    { action: "create", subject: "property", description: "Can create properties" },
    { action: "update", subject: "property", description: "Can update properties" },
    { action: "delete", subject: "property", description: "Can delete properties" },
    { action: "read", subject: "tenant", description: "Can view tenants" },
    { action: "create", subject: "tenant", description: "Can create tenants" },
    { action: "manage", subject: "lease", description: "Can manage leases" },
    { action: "read", subject: "invoice", description: "Can view invoices" },
    { action: "create", subject: "payment", description: "Can record payments" },
  ];

  const createdPermissions = [];
  for (const p of permissions) {
    let perm = await prisma.permission.findFirst({
      where: { action: p.action, subject: p.subject },
    });

    if (!perm) {
      perm = await prisma.permission.create({
        data: p,
      });
    }
    createdPermissions.push(perm);
  }

  // 2. Create System Roles
  const roles = [
    { name: "SUPER_ADMIN", description: "System Administrator" },
    { name: "PROPERTY_MANAGER", description: "Manages multiple properties" },
    { name: "LANDLORD", description: "Property owner" },
    { name: "ACCOUNTANT", description: "Financial management" },
    { name: "FIELD_OFFICER", description: "Property field operations" },
    { name: "TENANT", description: "Renter" },
  ];

  for (const r of roles) {
    let role = await prisma.role.findFirst({
      where: { name: r.name, organizationId: null },
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: r.name,
          description: r.description,
          organizationId: null,
        },
      });
    }

    // Assign all permissions to SUPER_ADMIN
    if (r.name === "SUPER_ADMIN") {
      for (const p of createdPermissions) {
        const existingRp = await prisma.rolePermission.findFirst({
          where: { roleId: role.id, permissionId: p.id },
        });

        if (!existingRp) {
          await prisma.rolePermission.create({
            data: { roleId: role.id, permissionId: p.id },
          });
        }
      }
    }
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
