import winston from "winston";
import { Sentry } from "./sentry";

const { combine, timestamp, json, errors } = winston.format;

// Simple secret scrubber
const sanitizePayload = winston.format((info) => {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credential', 'hash'];
  const sanitized = { ...info };
  for (const key in sanitized) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  return sanitized;
});

const winstonLogger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    errors({ stack: true }),
    timestamp(),
    sanitizePayload(),
    json()
  ),
  defaultMeta: { service: "lawguide-ai" },
  transports: [
    new winston.transports.Console()
  ],
});

export const logger = {
  info: (component: string, action: string, data?: any) => {
    winstonLogger.info(action, { component, ...data });
  },
  error: (component: string, action: string, error: any, data?: any) => {
    const errorMsg = error instanceof Error ? error.message : String(error);
    winstonLogger.error(action, { component, error: errorMsg, ...data });
    
    // Capture to Sentry in production
    Sentry.captureException(error instanceof Error ? error : new Error(errorMsg), { 
      extra: { component, action, ...data } 
    });
  },
  warn: (component: string, action: string, data?: any) => {
    winstonLogger.warn(action, { component, ...data });
  },
  debug: (component: string, action: string, data?: any) => {
    winstonLogger.debug(action, { component, ...data });
  },
};
