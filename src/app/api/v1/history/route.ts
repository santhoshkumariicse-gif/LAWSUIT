import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

import { withApiSecurity } from "@/lib/apiSecurity";

export const GET = withApiSecurity(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ status: "error", error: { code: "UNAUTHORIZED", message: "Missing JWT" } }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";
  const matter = searchParams.get("matter");

  const whereClause: any = { userId };
  if (matter) {
    whereClause.inferredMatter = matter;
  }

  const totalRecords = await prisma.query.count({ where: whereClause });
  const queries = await prisma.query.findMany({
    where: whereClause,
    orderBy: { createdAt: sort },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      inferredMatter: true,
      createdAt: true,
    }
  });

  const data = queries.map((q: any) => ({
    query_id: q.id,
    matter_inferred: q.inferredMatter,
    created_at: q.createdAt,
  }));

  return NextResponse.json({
    status: "success",
    data: data,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(totalRecords / limit),
      total_records: totalRecords,
    }
  }, { status: 200 });
});
