import { defineConfig } from "prisma/config";
import * as fs from "fs";
import * as path from "path";

// Simple fallback to parse .env since Next.js env resolution might not run here
let dbUrl = "postgresql://postgres:postgres@localhost:5432/lawguide_ai?schema=public";
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
  const match = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (match) dbUrl = match[1];
} catch (e) {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});
