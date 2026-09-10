import { PrismaClient, Organization, Property } from "../prisma/generated-client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database...");
  const orgs = await prisma.organization.findMany();
  console.log("Organizations:", orgs.length);
  orgs.forEach((o: Organization) => console.log(` - ${o.name} (${o.id})`));

  const properties = await prisma.property.findMany();
  console.log("Properties:", properties.length);
  properties.forEach((p: Property) => console.log(` - ${p.propertyName} [${p.propertyCode}] (Org: ${p.organizationId})`));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
