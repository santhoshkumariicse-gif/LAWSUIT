import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../env";
import { logger } from "../logger";

const globalForPinecone = globalThis as unknown as {
  pinecone: Pinecone | undefined;
};

export const pinecone =
  globalForPinecone.pinecone ??
  new Pinecone({
    apiKey: env.PINECONE_API_KEY,
  });

if (env.NODE_ENV !== "production") globalForPinecone.pinecone = pinecone;

export const PINECONE_INDEX_NAME = "lawguide-knowledge-base";

export async function getIndex() {
  try {
    return pinecone.Index(PINECONE_INDEX_NAME);
  } catch (error) {
    logger.error("pinecone", "Failed to connect to index", error);
    throw new Error("Vector database connection failed.");
  }
}
