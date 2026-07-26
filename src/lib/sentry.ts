import { env } from "./env";

/**
 * Mock Sentry integration for Error Tracking.
 * In a real application, you would initialize @sentry/nextjs here.
 */
export const Sentry = {
  init: () => {
    // Sentry.init({ dsn: env.SENTRY_DSN })
    console.log("[Sentry] Initialized with DSN:", env.SENTRY_DSN);
  },
  captureException: (error: any, context?: any) => {
    if (env.NODE_ENV === "production") {
      // Send to Sentry
      // Sentry.captureException(error, { extra: context })
    }
    console.warn("[Sentry Mock] Captured Exception:", error, context);
  },
  captureMessage: (message: string) => {
    if (env.NODE_ENV === "production") {
      // Sentry.captureMessage(message)
    }
    console.warn("[Sentry Mock] Captured Message:", message);
  }
};
