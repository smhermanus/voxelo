import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
 
async function main() {
  await prisma.tenant.upsert({
    where: { phoneNumber: "+27600000000" }, // your Twilio number
    update: {},
    create: {
      name: "Joe's Plumbing Cape Town",
      phoneNumber: "+27600000000",
      greeting: "Hello, thanks for calling Joe's Plumbing. " +
        "I'm Joe's AI assistant. How can I help you today?",
      businessHours: {
        mon: { open: "08:00", close: "17:00" },
        tue: { open: "08:00", close: "17:00" },
        wed: { open: "08:00", close: "17:00" },
        thu: { open: "08:00", close: "17:00" },
        fri: { open: "08:00", close: "17:00" },
        sat: { open: "09:00", close: "13:00" },
        sun: null,
      },
      faqContent: `
        Joe's Plumbing - Cape Town's trusted plumbing service since 2010.
        Services: Burst pipes, geyser repair/replacement, blocked drains,
                  leak detection, bathroom installations, emergency callouts.
        Pricing: Standard callout R450. Emergency after-hours R750.
        Service area: Greater Cape Town including Atlantic Seaboard,
                      Southern Suburbs, Northern Suburbs.
        Emergency: For burst pipes or flooding, we have a 24/7 emergency line.
      `,
      ownerEmail: "joe@example.com",
    },
  });
  console.log("Demo tenant seeded.");
}
 
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
