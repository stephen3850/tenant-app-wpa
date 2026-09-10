import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Creating Super Admin...");

  const email = "admin@tms.com";
  const password = "Admin@123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Ensure SUPER_ADMIN role exists
  let superAdminRole = await prisma.role.findFirst({
    where: { name: "SUPER_ADMIN", organizationId: null },
  });

  if (!superAdminRole) {
    console.log("Creating SUPER_ADMIN role...");
    superAdminRole = await prisma.role.create({
      data: {
        name: "SUPER_ADMIN",
        description: "System Administrator",
        organizationId: null,
      },
    });
  }

  // 2. Create Super Admin User
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("User already exists. Updating password...");
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, status: "ACTIVE" },
    });
  } else {
    console.log("Creating new Super Admin user...");
    const user = await prisma.user.create({
      data: {
        name: "System Administrator",
        email,
        password: hashedPassword,
        status: "ACTIVE",
      },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    });
  }

  console.log("-----------------------------------------");
  console.log("Super Admin Login Credentials:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log("-----------------------------------------");
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
