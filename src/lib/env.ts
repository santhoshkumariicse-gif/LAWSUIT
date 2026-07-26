import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "testing", "staging", "production"]).default("development"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is strictly required for session security."),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL."),
  DATABASE_URL: z.string().url("DATABASE_URL is required to connect to the database."),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required for the AI legal engine."),
  PINECONE_API_KEY: z.string().min(1, "PINECONE_API_KEY is required for Vector DB RAG."),
  REDIS_URL: z.string().url("REDIS_URL is required for BullMQ job queues."),
  SENTRY_DSN: z.string().url("SENTRY_DSN is required for error tracking observability."),
});

// We cast process.env to any because Zod will perform the actual runtime validation
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(_env.error.format());
  throw new Error("Invalid environment variables. Application failed to boot securely.");
}

export const env = _env.data;

export const config = {
  isDev: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "testing",
  isStaging: env.NODE_ENV === "staging",
  isProd: env.NODE_ENV === "production",
};
