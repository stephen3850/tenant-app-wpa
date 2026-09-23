import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Checking database connection...");
    await prisma.$connect();
    console.log("SUCCESS: Database connected.");

    const userCount = await prisma.user.count();
    console.log(`SUCCESS: Found ${userCount} users in database.`);

    const orgCount = await prisma.organization.count();
    console.log(`SUCCESS: Found ${orgCount} organizations in database.`);

  } catch (error) {
    console.error("FAILURE: Could not connect to database.");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
