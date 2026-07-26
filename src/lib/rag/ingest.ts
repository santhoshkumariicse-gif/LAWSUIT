import { getIndex } from "./pinecone";
import { generateEmbedding } from "./embeddings";
import { logger } from "../logger";

export interface LegalDocument {
  id: string; // e.g., "bns-sec-302"
  title: string; // e.g., "Section 302 of Bharatiya Nyaya Sanhita"
  text: string; // The raw text of the law/judgment
  sourceUrl?: string;
  documentType: "ACT" | "SECTION" | "JUDGMENT" | "NOTIFICATION";
}

/**
 * MOCK Ingestion Pipeline. 
 * In a real environment, this processes PDFs/HTML, chunks them, and upserts them.
 */
export async function ingestLegalDocument(doc: LegalDocument) {
  try {
    const index = await getIndex();
    
    // Generate the vector embedding for the document text
    const embedding = await generateEmbedding(doc.text);

    // Upsert into Pinecone
    await index.upsert([
      {
        id: doc.id,
        values: embedding,
        metadata: {
          title: doc.title,
          text: doc.text,
          sourceUrl: doc.sourceUrl || "",
          documentType: doc.documentType,
        },
      }
    ] as any);

    logger.info("rag", `Successfully ingested document: ${doc.id}`);
  } catch (error) {
    logger.error("rag", `Failed to ingest document: ${doc.id}`, error);
    throw error;
  }
}
