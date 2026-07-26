import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { inferMatter, getAnalysis, practiceDeck } from "@/lib/legalEngine";

import { withApiSecurity, sanitizeInput } from "@/lib/apiSecurity";
import { AIGuardrailService } from "@/core/security/AIGuardrailService";

import { GoogleGenAI } from "@google/genai";
import { env } from "@/lib/env";
import { generateEmbedding } from "@/lib/rag/embeddings";
import { getIndex } from "@/lib/rag/pinecone";
import { redactPII } from "@/lib/compliance/pii";
import { logger } from "@/lib/logger";
import { redis } from "@/lib/redis";

// Initialize Gemini Client (Requires GEMINI_API_KEY in environment)
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY || "dummy" });

const AnalyzeInputSchema = z.object({
  issue_text: z.string().min(10).max(5000),
  include_practice_deck: z.boolean().optional().default(false),
  language: z.enum(["en", "hi"]).optional().default("en")
}).strict(); // Prevents prototype pollution and unknown fields

const AIOutputSchema = z.object({
  laws: z.array(z.string()),
  forum: z.string(),
  docs: z.array(z.string()),
  steps: z.array(z.string()),
  outcomes: z.array(z.string()),
  question: z.string().optional(),
  confidence_score: z.number().min(0).max(100),
  citations: z.array(z.string()).optional(),
  disclaimer: z.string(),
  follow_up_questions: z.array(z.string()).optional()
});

export const POST = withApiSecurity(async (req: Request) => {
  const apiStart = performance.now();
  const session = await getServerSession(authOptions);
  // Note: Middleware handles primary Auth blocking, but we double-check here for safety
  if (!session?.user) {
    return NextResponse.json({ status: "error", error: { code: "UNAUTHORIZED", message: "Missing JWT" } }, { status: 401 });
  }

  const body = await req.json();
  const result = AnalyzeInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { status: "error", error: { code: "VALIDATION_ERROR", message: result.error.issues[0].message } },
      { status: 400 }
    );
  }

  const raw_issue_text = sanitizeInput(result.data.issue_text);
  
  // Enterprise AI Guardrails (Phase 05)
  AIGuardrailService.validate(raw_issue_text);
  
  // DPDP Compliance: Scrub PII before processing
  const issue_text = redactPII(raw_issue_text);
  
  const include_practice_deck = result.data.include_practice_deck;
  const language = result.data.language;
  const userId = (session.user as any).id;

    // RAG Pipeline (Phase 05)
    let matter: any;
    let analysis: any;

    try {
      if (!env.GEMINI_API_KEY || !env.PINECONE_API_KEY) {
        throw new Error("Missing API Keys for RAG pipeline. Falling back to deterministic engine.");
      }

      // Semantic Cache Lookup
      // We generate a simple hash-like key from the sanitized input and language
      const cacheKey = `ai-cache:${language}:${Buffer.from(issue_text).toString('base64').substring(0, 32)}`;
      const cachedResponse = await redis.get(cacheKey);
      
      if (cachedResponse) {
        logger.info("analyze", "Cache hit! Returning pre-computed LLM analysis.", { cacheKey });
        const analysis = JSON.parse(cachedResponse);
        const totalLatency = performance.now() - apiStart;
        logger.info("analyze", "API Pipeline successfully completed from cache", { latency_ms: totalLatency, confidence_score: analysis.confidence_score });
        
        return NextResponse.json({
          status: "success",
          matter: "llm_inferred_matter",
          analysis,
        }, { status: 200 });
      }

      logger.info("analyze", "Cache miss. Executing full RAG pipeline.");

      // Step 1: Vectorize the user query
      const queryEmbedding = await generateEmbedding(issue_text);

      // Step 2: Retrieve relevant Indian legal documents from Pinecone
      const pineconeStart = performance.now();
      const index = await getIndex();
      const searchResults = await index.query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
      });
      const pineconeLatency = performance.now() - pineconeStart;
      logger.info("analyze", "Pinecone retrieval complete", { latency_ms: pineconeLatency });

      // Step 3: Construct the strict context string
      let retrievedContext = "";
      if (searchResults.matches && searchResults.matches.length > 0) {
        retrievedContext = searchResults.matches.map(match => {
          return `Document ID: ${match.id}\nTitle: ${match.metadata?.title}\nContent: ${match.metadata?.text}`;
        }).join("\n\n---\n\n");
      } else {
        retrievedContext = "No relevant legal context found.";
      }

      // Step 4: Strict RAG Prompting
      let systemInstruction = `You are a highly strictly-bounded legal AI for Indian Law.
You MUST rely ONLY on the provided Context to answer the user's issue.
If the context does not contain relevant laws to resolve the issue, state that you do not know and give a confidence score of 0.
Never guess or hallucinate laws.

Output ONLY a valid JSON object strictly adhering to this interface:
{
  "laws": ["string"],
  "forum": "string",
  "docs": ["string"],
  "steps": ["string"],
  "outcomes": ["string"],
  "question": "string",
  "confidence_score": number (0-100),
  "citations": ["string (Document ID and Title)"],
  "disclaimer": "This is AI-generated and not professional legal advice."
}`;

      if (language === "hi") {
        systemInstruction += `\n\nCRITICAL: The user has requested Hindi localization. You must translate ALL the string values in the JSON output into formal legal Hindi (Devanagari script). Keep the JSON keys exactly in English as specified in the interface.`;
      }

      systemInstruction += `\n\nContext:\n${retrievedContext}`;

      const llmStart = performance.now();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: issue_text, // User input is strictly separated from system rules
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1, // Highly deterministic for legal tasks
        }
      });
      const llmLatency = performance.now() - llmStart;
      logger.info("analyze", "Gemini LLM generation complete", { latency_ms: llmLatency });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from LLM");
      }

      let analysis;
      try {
        const rawJson = JSON.parse(text);
        analysis = AIOutputSchema.parse(rawJson); // Zod Validation
      } catch (e) {
        logger.error("analyze", "AI Hallucination / Invalid JSON Schema", e);
        throw new Error("The AI Engine returned an improperly formatted response.");
      }
      
      // Store in Redis cache for 24 hours (86400 seconds)
      await redis.set(cacheKey, JSON.stringify(analysis), "EX", 86400);
      logger.info("analyze", "Cached LLM analysis in Redis.", { cacheKey });

      const totalLatency = performance.now() - apiStart;
      logger.info("analyze", "API Pipeline successfully completed", { latency_ms: totalLatency, confidence_score: analysis.confidence_score });
      matter = "llm_inferred_matter"; // We could also ask the LLM to infer the matter category
      console.log("[AI_ENGINE] Successfully generated dynamic legal analysis via Google Gemini.");
      
    } catch (llmError) {
      console.warn(`[AI_ENGINE] External LLM failed: ${llmError}. Falling back to deterministic legal logic engine.`);
      
      // Deterministic Fallback Mechanism (Zero-Hallucination Guarantee)
      matter = inferMatter(issue_text);
      analysis = getAnalysis(matter, issue_text);
    }

    // Save to DB (Phase 05)
    const queryRecord = await prisma.query.create({
      data: {
        userId: userId,
        rawInput: issue_text,
        inferredMatter: matter,
        results: {
          create: {
            analysisData: JSON.stringify(analysis),
          },
        },
      },
    });

    const responseData: any = {
      query_id: queryRecord.id,
      matter_inferred: matter,
      analysis: analysis,
    };

    if (include_practice_deck) {
      responseData.practice_deck = practiceDeck(matter);
    }

    return NextResponse.json({ status: "success", data: responseData }, { status: 200 });
});
