import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserService } from "@/services/UserService";
import { AppError } from "@/core/errors/AppError";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { status: "error", error: { code: "VALIDATION_ERROR", message: result.error.issues[0].message } },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const hashedPassword = await bcrypt.hash(password, 12);

    const userService = new UserService();
    const user = await userService.createUser({
      email,
      passwordHash: hashedPassword,
      role: "USER",
    });

    return NextResponse.json(
      { status: "success", data: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API_REGISTER_ERROR]", error);
    if (error instanceof AppError) {
      return NextResponse.json(
        { status: "error", error: { code: "API_ERROR", message: error.message } },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { status: "error", error: { code: "INTERNAL_ERROR", message: "Failed to create user" } },
      { status: 500 }
    );
  }
}
