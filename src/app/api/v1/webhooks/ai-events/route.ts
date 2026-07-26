import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    // This endpoint receives updates from the separated Microservice Worker
    // notifying the main Next.js app that a background job (like OCR) finished.
    const body = await req.json();
    
    if (body.event === "DOCUMENT_PROCESSED") {
      logger.info("ai-webhook", `Document ${body.documentId} processed successfully.`);
      // We could update the database here, or fire a WebSocket event to the client
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error("ai-webhook", "AI event webhook failed", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
