import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { withApiSecurity } from "@/lib/apiSecurity";

export const DELETE = withApiSecurity(async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  logger.info("compliance", `Initiating DPDP Right to be Forgotten for user ${userId}`);

  // Perform a transactional cascade delete to ensure no orphan records remain
  await prisma.$transaction(async (tx) => {
    // Delete all user queries
    await tx.query.deleteMany({
      where: { userId: userId }
    });

    // Delete practice sessions
    await tx.practiceSession.deleteMany({
      where: { userId: userId }
    });

    // Delete uploaded documents
    await tx.document.deleteMany({
      where: { userId: userId }
    });

    // Finally, delete the user record
    await tx.user.delete({
      where: { id: userId }
    });
  });

  logger.info("compliance", `Successfully deleted all data for user ${userId}`);

  return NextResponse.json({ success: true, message: "Account and all associated data deleted securely." }, { status: 200 });
});
