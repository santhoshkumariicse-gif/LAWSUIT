import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { questionFeedback } from "@/lib/legalEngine";

const feedbackSchema = z.object({
  matter_type: z.string(),
  user_answer: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ status: "error", error: { code: "UNAUTHORIZED", message: "Missing JWT" } }, { status: 401 });
    }

    const body = await req.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { status: "error", error: { code: "VALIDATION_ERROR", message: result.error.issues[0].message } },
        { status: 400 }
      );
    }

    const { user_answer } = result.data;

    // AI Engine Inference (Phase 07)
    const feedback = questionFeedback(user_answer);
    
    const isFactual = !(/maybe|not sure|i think/.test(user_answer.toLowerCase())) && user_answer.trim().length >= 80;

    return NextResponse.json({
      status: "success",
      data: {
        feedback: feedback,
        is_factual: isFactual,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("[API_FEEDBACK_ERROR]", error);
    return NextResponse.json(
      { status: "error", error: { code: "INTERNAL_ERROR", message: "Unhandled engine exception." } },
      { status: 500 }
    );
  }
}
