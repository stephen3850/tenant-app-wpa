import 'dotenv/config';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  }
}

main();
