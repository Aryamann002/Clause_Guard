import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const doc = await prisma.document.findUnique({
    where: { id: params.id },
    include: {
      clauses: {
        orderBy: { index: "asc" },
        include: { sources: true },
      },
      analysisMeta: true,
    },
  });

  if (!doc)
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  return NextResponse.json(doc);
}
