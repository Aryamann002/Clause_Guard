"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, MessageSquare, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RiskMap } from "@/components/analysis/RiskMap";
import { ClauseList } from "@/components/analysis/ClauseList";
import { ClauseDetailPanel } from "@/components/analysis/ClauseDetailPanel";
import { useAppStore } from "@/hooks/useAppStore";
import { riskColor, cn } from "@/lib/utils";

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.docId as string;

  const { lang, setLang } = useAppStore();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClauseIndex, setSelectedClauseIndex] = useState<number | null>(null);

  useEffect(() => {
    // Instead of fetching from /api/documents/[id] (which relies on the SQLite DB),
    // we read the full analysis directly from the Zustand store that was set during upload.
    const result = useAppStore.getState().analysisResult as any;
    
    if (result && result.fullDocument && result.fullDocument.id === docId) {
      setDoc(result.fullDocument);
      setLoading(false);
    } else {
      setError("Document analysis session expired. Please upload the document again.");
      setLoading(false);
    }
  }, [docId]);

  function handleSelectClause(index: number) {
    setSelectedClauseIndex(index);
    const el = document.getElementById(`clause-item-${index}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar lang={lang} onLangChange={setLang} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-stone-500 font-serif">Loading your analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar lang={lang} onLangChange={setLang} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-crimson-600">
            <p className="font-semibold text-lg">{error || "Document not found."}</p>
            <Link href="/" className="text-teal-600 hover:underline text-sm mt-2 inline-block">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const meta = doc.analysisMeta;
  const selectedClause = selectedClauseIndex !== null ? doc.clauses[selectedClauseIndex] : null;

  
  const riskScorePercent = Math.round((doc.overallRiskScore || 0) * 100);
  const overallRisk = riskScorePercent >= 65 ? "HIGH" : riskScorePercent >= 35 ? "MEDIUM" : "LOW";
  const overallColor = riskColor(overallRisk);

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
              {doc.title}
            </h1>
            <p className="text-sm text-stone-400 mt-0.5">
              {meta?.totalClauses} clauses analyzed · India jurisdiction · Not legal advice
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
              Overall: {overallRisk}
            </span>
            <span className="text-xs bg-crimson-50 text-crimson-600 font-semibold px-3 py-1.5 rounded-full border border-crimson-200/30">
              {meta?.highRiskCount} High
            </span>
            <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-3 py-1.5 rounded-full border border-amber-200/30">
              {meta?.mediumRiskCount} Medium
            </span>
            <span className="text-xs bg-forest-50 text-forest-600 font-semibold px-3 py-1.5 rounded-full border border-forest-200/30">
              {meta?.lowRiskCount} Low
            </span>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
          {}
          <div className="space-y-4">
            {}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-stone-800 dark:text-stone-200 text-sm">Document summary</h2>
                {doc.summaryHi && (
                  <div className="flex items-center rounded-full border border-stone-200 dark:border-stone-800 overflow-hidden text-xs">
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
                {lang === "hi" && doc.summaryHi
                  ? doc.summaryHi
                  : doc.summaryEn}
              </p>
            </div>

            {}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                  Risk surface map
                </h2>
                <span className="text-xs text-stone-400">click a segment</span>
              </div>

              <RiskMap
                clauses={doc.clauses}
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
                clauses={doc.clauses}
                selectedIndex={selectedClauseIndex}
                onSelect={handleSelectClause}
                lang={lang}
              />
            </div>
          </div>

          {}
          <div className="lg:sticky lg:top-20 space-y-4" id="detail-panel-mobile">
            {selectedClause ? (
              <ClauseDetailPanel clause={selectedClause} />
            ) : (
              <div className="bg-white border border-dashed border-stone-300 rounded-xl p-8 text-center">
                <p className="text-stone-400 text-sm">Select a clause to view details</p>
              </div>
            )}

            {}
            <div className="bg-teal-600 rounded-xl p-5 text-white shadow-sm">
              <h3 className="font-serif font-bold text-lg mb-1">Still have questions?</h3>
              <p className="text-sm text-teal-100 mb-4 leading-relaxed">
                Our verified Indian lawyers can review this contract with you in a
                private 30-minute video call.
              </p>
              <Link
                href={`/lawyers?docId=${docId}`}
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
