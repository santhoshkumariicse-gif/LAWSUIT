import { Queue } from "bullmq";
import Redis from "ioredis";
import { env } from "../env";

// Configure Redis connection
export const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const documentQueue = new Queue("DocumentProcessing", {
  connection,
});

export async function addDocumentJob(userId: string, documentId: string, fileUrl: string) {
  return await documentQueue.add("process-pdf", {
    userId,
    documentId,
    fileUrl,
  }, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
}
