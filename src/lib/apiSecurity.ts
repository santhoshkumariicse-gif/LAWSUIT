import { NextResponse } from "next/server";
import { logger } from "./logger";
import { redis } from "./redis";

const RATE_LIMIT_MAX = 20; // 20 requests
const RATE_LIMIT_WINDOW = 60; // 60 seconds
const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024; // 1 MB

export function withApiSecurity(handler: (req: Request, ...args: any[]) => Promise<NextResponse>) {
  return async (req: Request, ...args: any[]) => {
    try {
      // 1. Distributed Rate Limiting (Redis Token Bucket)
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const rateLimitKey = `rate-limit:${ip}`;
      
      const currentCount = await redis.incr(rateLimitKey);
      if (currentCount === 1) {
        // First request, set expiration window
        await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW);
      }

      if (currentCount > RATE_LIMIT_MAX) {
        logger.warn("apiSecurity", "Rate limit exceeded", { ip });
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      }

      // 2. Request Size Limits (Prevent DoS)
      const contentLength = req.headers.get("content-length");
      if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE) {
        logger.warn("apiSecurity", "Payload too large", { ip, contentLength });
        return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
      }

      // 3. Execute Handler
      const response = await handler(req, ...args);
      return response;

    } catch (error: any) {
      // 4. Global Error Catching & Stack Trace Masking
      logger.error("apiSecurity", "Unhandled API Exception", error);
      
      // NEVER expose database panics or stack traces to the client
      return NextResponse.json(
        { status: "error", error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." } },
        { status: 500 }
      );
    }
  };
}

export function sanitizeInput(input: string): string {
  // Strip control characters and trim
  return input.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
}
