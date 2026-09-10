import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

const connectionString = process.env.DATABASE_URL;
console.log("Connection String Length:", connectionString?.length || 0);

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);
const db = new PrismaClient({ adapter });

async function main() {
  const user = await db.user.findUnique({
    where: { email: "admin@tms.com" },
    include: {
      userRoles: {
        include: {
          role: true
        }
      }
    }
  });

  if (user) {
    console.log("Admin user found:");
    console.log(`ID: ${user.id}`);
    console.log(`Roles: ${user.userRoles.map(ur => ur.role.name).join(", ")}`);
  } else {
    console.log("Admin user NOT found.");
  }
}

main().catch(console.error).finally(() => process.exit());
