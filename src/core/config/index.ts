import { env } from "@/lib/env";

interface AppConfig {
  env: string;
  isDev: boolean;
  isTest: boolean;
  isStaging: boolean;
  isProd: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  db: {
    url: string;
  };
  redis: {
    url: string;
  };
  auth: {
    secret: string;
    url: string;
  };
  ai: {
    geminiKey: string;
    pineconeKey: string;
  };
}

const baseConfig = {
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "testing",
  isStaging: env.NODE_ENV === "staging",
  isProd: env.NODE_ENV === "production",
  db: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },
  ai: {
    geminiKey: env.GEMINI_API_KEY,
    pineconeKey: env.PINECONE_API_KEY,
  },
};

const getEnvConfig = (): AppConfig => {
  switch (env.NODE_ENV) {
    case "development":
      return {
        ...baseConfig,
        logLevel: "debug",
      };
    case "testing":
      return {
        ...baseConfig,
        logLevel: "error", // Minimal logging in tests
      };
    case "staging":
      return {
        ...baseConfig,
        logLevel: "info",
      };
    case "production":
      return {
        ...baseConfig,
        logLevel: "warn",
      };
    default:
      return {
        ...baseConfig,
        logLevel: "info",
      };
  }
};

export const config = getEnvConfig();
