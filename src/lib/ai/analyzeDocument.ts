import { GoogleGenerativeAI } from "@google/generative-ai";
import { RawClause } from "../pdf/segmentClauses";
import { retrieveContext } from "./rag";
import { translateToHindi } from "./translateToHindi";


function getModel() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });
}


function cleanJsonResponse(raw: string): string {
  return raw.replace(/```json/g, "").replace(/```/g, "").trim();
}

export interface ClauseAnalysis {
  index: number;
  heading: string | null;
  text: string;
  category: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  uncertainty_level: "HIGH_CONFIDENCE" | "MEDIUM_CONFIDENCE" | "LOW_CONFIDENCE";
  risk_explanation_en: string;
  risk_explanation_hi?: string;
  user_impact_notes: string;
  suggested_questions?: string[];
  source_status?: "VERIFIED" | "UNVERIFIED";
  sources: Array<{ title: string; url: string; source_type: string }>;
}

export interface DocumentAnalysis {
  summary_en: string;
  summary_hi?: string;
  overall_risk_score: number;
  clauses: ClauseAnalysis[];
}

const SYSTEM_PROMPT = `You are ClauseGuard, an legal AI assistant for Indian law.
Rules:
- risk_level: HIGH|MEDIUM|LOW
- uncertainty_level: HIGH_CONFIDENCE|MEDIUM_CONFIDENCE|LOW_CONFIDENCE
- overall_risk_score: 0.0 to 1.0`;

export async function analyzeDocument(
  clauses: RawClause[],
  documentTitle: string
): Promise<DocumentAnalysis> {
  const model = getModel();

  const clauseList = clauses
    .map((c, i) => `[CLAUSE ${i + 1}]\n${c.heading ? `Heading: ${c.heading}\n` : ""}${c.text}`)
    .join("\n\n---\n\n");

  console.log(`[analyzeDocument] Pass 1: Initial analysis...`);
  const prompt = `Analyze this Indian contract: "${documentTitle}". 
Return JSON:
{
  "summary_en": "summary",
  "overall_risk_score": 0.5,
  "clauses": [
    {
      "index": 0,
      "heading": "heading",
      "text": "original text",
      "category": "Category",
      "risk_level": "LOW|MEDIUM|HIGH",
      "uncertainty_level": "HIGH_CONFIDENCE",
      "risk_explanation_en": "explanation",
      "user_impact_notes": "notes"
    }
  ]
}
CONTRACT:
${clauseList}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const parsed: DocumentAnalysis = JSON.parse(cleanJsonResponse(raw));

  console.log(`[analyzeDocument] Pass 2: RAG and Hindi...`);


  // Translate main summary only
  parsed.summary_hi = await translateToHindi(parsed.summary_en).catch(() => undefined);

  for (let i = 0; i < parsed.clauses.length; i++) {
    const clause = parsed.clauses[i];
    console.log(`[analyzeDocument] Processing clause ${i + 1}/${parsed.clauses.length}...`);
    
    clause.sources = [];
    clause.source_status = "UNVERIFIED";
    clause.suggested_questions = ["Is this clause standard?", "How to negotiate?"];

    // RAG for top 5 high/medium risk clauses
    if (i < 5 && (clause.risk_level === "HIGH" || clause.risk_level === "MEDIUM")) {
      try {
        const context = await retrieveContext(clause.text, clause.category);
        if (context && context.length > 0) {
          const contextText = context.map(c => `[${c.act_name}]: ${c.text}`).join("\n");
          const refinePrompt = `Refine this analysis using Indian law context:
Clause: ${clause.text}
Context: ${contextText}
Return JSON: {"grounded_explanation": "...", "sources": [{"title": "...", "url": "..."}]}`;

          const refResult = await model.generateContent(refinePrompt);
          const refined = JSON.parse(cleanJsonResponse(refResult.response.text()));
          clause.risk_explanation_en = refined.grounded_explanation;
          clause.source_status = "VERIFIED";
          clause.sources = (refined.sources || []).map((s: any) => ({
            title: s.title,
            url: s.url || "",
            source_type: "act"
          }));
        }
      } catch (err) {
        console.error(`Refinement failed for clause ${i}:`, err);
      }
    }

    // Clause-level Hindi translation
    try {
      clause.risk_explanation_hi = await translateToHindi(clause.risk_explanation_en);
    } catch (err) {
      console.error(`Translation failed for clause ${i}:`, err);
    }

    // Add a 2-second delay to respect Gemini's free tier rate limits (15 RPM)
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`[analyzeDocument] Done.`);
  return parsed;
}
