import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { config } from "@/core/config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Next.js Serverless Connection Pooling Optimization
// If we are in production, we append ?pgbouncer=true to the DATABASE_URL
// to instruct Prisma not to use prepared statements, which conflict with PgBouncer.
const getDatabaseUrl = () => {
  let url = config.db.url || "";
  if (config.isProd && url && !url.includes("pgbouncer=true")) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}pgbouncer=true&connection_limit=1`; // Limit connections in serverless cold starts
  }
  return url;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: config.isDev ? ["query", "error", "warn"] : ["error"],
  });

if (!config.isProd) globalForPrisma.prisma = prisma;
