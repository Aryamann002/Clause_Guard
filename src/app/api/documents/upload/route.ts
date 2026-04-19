import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf/extractText";
import { segmentClauses } from "@/lib/pdf/segmentClauses";
import { analyzeDocument } from "@/lib/ai/analyzeDocument";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE_MB = 10;

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pastedText = formData.get("text") as string | null;
    const title = (formData.get("title") as string) || "Untitled Contract";

    let rawText = "";

    if (file) {

      if (!file.name.endsWith(".pdf")) {
        return NextResponse.json(
          { error: "Only PDF files are supported." },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large. Max ${MAX_FILE_SIZE_MB}MB allowed.` },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      rawText = await extractTextFromPDF(buffer);
    } else if (pastedText && pastedText.trim().length > 50) {
      rawText = pastedText.trim();
    } else {
      return NextResponse.json(
        { error: "Please upload a PDF or paste contract text." },
        { status: 400 }
      );
    }


    const rawClauses = segmentClauses(rawText);
    if (rawClauses.length === 0) {
      return NextResponse.json(
        { error: "No readable clauses found in the document." },
        { status: 422 }
      );
    }


    let analysis;
    try {
      analysis = await analyzeDocument(rawClauses, title);
    } catch (aiError: unknown) {
      const message =
        aiError instanceof Error
          ? aiError.message
          : "AI analysis failed. Please retry.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const analysisTimeMs = Date.now() - startTime;

    const documentId = "doc_" + Date.now().toString();

    // Instead of saving to Prisma (which crashes on Netlify due to read-only SQLite dev.db),
    // we build the exact document structure and return it directly to the frontend.
    const mockDocument = {
      id: documentId,
      title,
      originalFilename: file?.name || "pasted-text.txt",
      rawText,
      summaryEn: analysis.summary_en,
      summaryHi: analysis.summary_hi || null,
      overallRiskScore: analysis.overall_risk_score,
      clauses: analysis.clauses.map((c) => ({
        index: c.index,
        heading: c.heading,
        text: c.text,
        category: c.category,
        riskLevel: c.risk_level,
        uncertaintyLevel: c.uncertainty_level,
        riskExplanationEn: c.risk_explanation_en,
        riskExplanationHi: c.risk_explanation_hi || null,
        userImpactNotes: c.user_impact_notes,
        sources: (c.sources || []).map((s) => ({
          title: s.title,
          url: s.url,
          sourceType: s.source_type,
        })),
      })),
      analysisMeta: {
        aiModelUsed: "gemini-2.5-flash",
        totalClauses: analysis.clauses.length,
        highRiskCount: analysis.clauses.filter((c) => c.risk_level === "HIGH").length,
        mediumRiskCount: analysis.clauses.filter((c) => c.risk_level === "MEDIUM").length,
        lowRiskCount: analysis.clauses.filter((c) => c.risk_level === "LOW").length,
        analysisTimeMs,
      },
    };

    const truncated = rawClauses.length >= 40;

    return NextResponse.json({
      documentId,
      truncated,
      clauseCount: analysis.clauses.length,
      fullDocument: mockDocument, // Pass the full document back
    });
  } catch (err: unknown) {
    console.error("[upload error]", err);
    const message =
      err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
