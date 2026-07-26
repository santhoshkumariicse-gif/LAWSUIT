import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import { env } from "../lib/env";
import { logger } from "../lib/logger";
import { generateEmbedding } from "../lib/rag/embeddings";
import { getIndex } from "../lib/rag/pinecone";

const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const documentWorker = new Worker("DocumentProcessing", async (job: Job) => {
  const { userId, documentId, fileUrl } = job.data;
  logger.info("worker", `Started processing document ${documentId} for user ${userId}`);

  try {
    // Phase 8: Decoupled Heavy Operations
    // 1. Download file from S3 / storage (Simulated)
    logger.info("worker", `Downloading file from ${fileUrl}...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // 2. OCR and Parse PDF (Simulated heavy CPU task)
    logger.info("worker", `Running OCR and extracting text...`);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const extractedText = `Simulated extracted legal text from document ${documentId}.`;

    // 3. Generate Embeddings (Network & CPU intensive)
    const embedding = await generateEmbedding(extractedText);

    // 4. Upsert into Vector DB
    const index = await getIndex();
    await index.upsert([
      {
        id: documentId,
        values: embedding,
        metadata: {
          title: `Document ${documentId}`,
          text: extractedText,
          userId: userId,
          documentType: "UPLOADED_EVIDENCE"
        },
      }
    ] as any);

    logger.info("worker", `Successfully completed document ${documentId}.`);

    // We would fire a webhook here to the main app if running in a separate microservice
    
  } catch (error) {
    logger.error("documentWorker", "Background document processing failed", error);
    throw error;
  }
}, { connection });

documentWorker.on("completed", (job) => {
  logger.info("worker", `Job ${job.id} completed successfully`);
});

documentWorker.on("failed", (job, err) => {
  logger.error("worker", `Job ${job?.id} failed`, err);
});
