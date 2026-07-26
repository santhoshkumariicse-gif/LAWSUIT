import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Prisma 7 Client instantiation
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 1. Create a mock Enterprise Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@lawguide.ai" },
    update: {},
    create: {
      email: 'admin@lawguide.ai',
      passwordHash: hashedPassword,
      role: 'SYSTEM_ADMIN', // Changed to strict enum
    },
  });

  // 2. Create a mock Citizen User
  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@example.com' },
    update: {},
    create: {
      email: 'citizen@example.com',
      passwordHash: hashedPassword,
      role: 'USER', // Changed to strict enum
    },
  });

  // 3. Create a Query history record for the citizen
  const query = await prisma.query.create({
    data: {
      userId: citizen.id,
      rawInput: "I bought a defective refrigerator.",
      inferredMatter: "consumer",
      results: {
        create: {
          analysisData: JSON.stringify({
            laws: ["Consumer Protection Act, 2019"],
            forum: "District Consumer Commission",
            docs: ["Invoice", "Complaint Copy"],
            steps: ["Collect evidence", "Send legal notice"],
            outcomes: ["Refund", "Replacement"],
            question: "When did you purchase it?"
          })
        }
      }
    }
  });

  // 4. Create a Document record for the citizen
  const document = await prisma.document.create({
    data: {
      userId: citizen.id,
      queryId: query.id,
      fileName: "invoice.pdf",
      fileSize: 102400,
      mimeType: "application/pdf",
      storageUrl: "https://storage.example.com/invoice.pdf",
      documentType: "invoice"
    }
  });

  console.log("Database seeded successfully!");
  console.log({ admin: admin.email, citizen: citizen.email, query: query.id, document: document.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
