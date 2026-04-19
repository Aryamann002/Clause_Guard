
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RiskMap } from "@/components/analysis/RiskMap";
import { ClauseList } from "@/components/analysis/ClauseList";
import { ClauseDetailPanel } from "@/components/analysis/ClauseDetailPanel";
import { ResultsSkeleton } from "@/components/ui/Skeleton";
import { useAppStore } from "@/hooks/useAppStore";
import { riskColor, cn } from "@/lib/utils";
import type { AnalysisResult } from "@/types";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const { analysisResult, lang, setLang } = useAppStore();
  const [result, setResult] = useState<AnalysisResult | null>(analysisResult);
  const [selectedClauseIndex, setSelectedClauseIndex] = useState<number | null>(null);

  useEffect(() => {
    
    
    if (!result && !analysisResult) {
      
      router.push("/");
    } else if (analysisResult && !result) {
      setResult(analysisResult);
    }
  }, [analysisResult, result, router]);

  function handleSelectClause(index: number) {
    setSelectedClauseIndex(index);
    
    const el = document.getElementById(`clause-item-${index}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (!result) return <ResultsSkeleton />;

  const meta = result.meta ?? {
    totalClauses: result.clauses?.length ?? 0,
    truncated: false,
    highRiskCount: result.clauses?.filter(c => c.riskLevel === "HIGH").length ?? 0,
    mediumRiskCount: result.clauses?.filter(c => c.riskLevel === "MEDIUM").length ?? 0,
    lowRiskCount: result.clauses?.filter(c => c.riskLevel === "LOW").length ?? 0,
  };
  const selectedClause =
    selectedClauseIndex !== null ? result.clauses[selectedClauseIndex] : null;

  const overallColor = riskColor(result.overallRisk);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Analyze another
            </Link>
            <h1 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
              {result.docType}
            </h1>
            <p className="text-sm text-stone-400 mt-0.5">
              {meta.totalClauses} clauses analyzed · India jurisdiction · Not legal advice
              {meta.truncated && " · Document was truncated — first 35,000 chars analyzed"}
            </p>
          </div>

          {}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border",
                overallColor.bg, overallColor.text, overallColor.border + "/30"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Overall: {result.overallRisk}
            </span>
            <span className="text-xs bg-crimson-50 text-crimson-600 font-semibold px-3 py-1.5 rounded-full">
              {meta.highRiskCount} High
            </span>
            <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-3 py-1.5 rounded-full">
              {meta.mediumRiskCount} Medium
            </span>
            <span className="text-xs bg-forest-50 text-forest-600 font-semibold px-3 py-1.5 rounded-full">
              {meta.lowRiskCount} Low
            </span>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
          {}
          <div className="space-y-4">
            {}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-stone-800 dark:text-stone-200 text-sm">Document summary</h2>
                {result.summaryHi && (
                  <div className="flex items-center rounded-full border border-stone-200 overflow-hidden text-xs">
                    <button
                      onClick={() => setLang("en")}
                      className={cn(
                        "px-2.5 py-0.5 font-medium transition-colors",
                        lang === "en"
                          ? "bg-teal-600 text-white"
                          : "text-stone-400 hover:bg-stone-50"
                      )}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLang("hi")}
                      className={cn(
                        "px-2.5 py-0.5 font-medium transition-colors",
                        lang === "hi"
                          ? "bg-teal-600 text-white"
                          : "text-stone-400 hover:bg-stone-50"
                      )}
                    >
                      हिंदी
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {lang === "hi" && result.summaryHi
                  ? result.summaryHi
                  : result.summaryEn}
              </p>
            </div>

            {}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-stone-800 text-sm">
                  Risk surface map
                </h2>
                <span className="text-xs text-stone-400">click a segment</span>
              </div>

              <RiskMap
                clauses={result.clauses}
                selectedIndex={selectedClauseIndex}
                onSelect={(i) => {
                  handleSelectClause(i);
                  
                  if (window.innerWidth < 1024) {
                    setTimeout(() => {
                      document
                        .getElementById("detail-panel-mobile")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                }}
              />

              <ClauseList
                clauses={result.clauses}
                selectedIndex={selectedClauseIndex}
                onSelect={handleSelectClause}
                lang={lang}
              />
            </div>
          </div>

          {}
          <div className="lg:sticky lg:top-20 space-y-4" id="detail-panel-mobile">
            <ClauseDetailPanel clause={selectedClause} />

            {}
            <div className="bg-teal-600 rounded-xl p-5 text-white">
              <h3 className="font-serif font-bold text-lg mb-1">Still have questions?</h3>
              <p className="text-sm text-teal-100 mb-4 leading-relaxed">
                Our verified Indian lawyers can review this contract with you in a
                private 30-minute video call.
              </p>
              <Link
                href="/lawyers"
                className="flex items-center justify-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-bold rounded-lg px-4 py-2.5 text-sm transition-colors w-full"
              >
                <MessageSquare className="w-4 h-4" />
                Talk to a verified lawyer
              </Link>
            </div>

            {}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-700 leading-relaxed">
                ⚠️ This AI analysis is for educational purposes only and is not legal
                advice. Consult a qualified lawyer before signing.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
