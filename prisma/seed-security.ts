import { PrismaClient } from "./generated-client";

const prisma = new PrismaClient();

async function main() {
  const systemOrgId = "SYSTEM"; // Or fetch a real org ID if needed

  const categories = [
    { name: "Unauthorized Access", description: "Attempts to enter restricted areas" },
    { name: "Theft/Larceny", description: "Missing property or equipment" },
    { name: "Vandalism", description: "Damage to property" },
    { name: "Physical Altercation", description: "Fights or disruptive behavior" },
    { name: "Suspicious Activity", description: "Unusual behavior or abandoned items" },
    { name: "Medical Emergency", description: "Injuries or health crises" },
    { name: "Fire Alarm", description: "Smoke, fire, or alarm activation" },
    { name: "Noise Complaint", description: "Excessive noise or parties" },
    { name: "Parking Violation", description: "Unauthorized parking or blocked access" },
    { name: "Maintenance Hazard", description: "Safety risks like spills or broken glass" },
  ];

  for (const cat of categories) {
    await prisma.securityIncidentCategory.upsert({
      where: { organizationId_name: { organizationId: systemOrgId, name: cat.name } },
      update: {},
      create: {
        ...cat,
        organizationId: systemOrgId,
        isSystem: true,
      },
    });
  }

  console.log("Security incident categories seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
