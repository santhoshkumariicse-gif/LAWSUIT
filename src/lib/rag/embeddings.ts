import { GoogleGenAI } from "@google/genai";
import { env } from "../env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY || "dummy" });

/**
 * Generate a dense vector embedding for a given legal text or user query.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "text-embedding-004",
    contents: text,
  });

  if (!response.embeddings || !response.embeddings[0].values) {
    throw new Error("Failed to generate embedding.");
  }

  return response.embeddings[0].values;
}
