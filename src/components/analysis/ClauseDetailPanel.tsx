
"use client";

import { useState } from "react";
import { ExternalLink, HelpCircle, FileText, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn, riskColor, confidenceLabel } from "@/lib/utils";
import type { Clause } from "@/types";

import { useAppStore } from "@/hooks/useAppStore";

interface ClauseDetailPanelProps {
  clause: Clause | null;
}

export function ClauseDetailPanel({ clause }: ClauseDetailPanelProps) {
  const { lang, setLang } = useAppStore();

  if (!clause) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center min-h-[260px]">
        <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-stone-400" />
        </div>
        <p className="text-sm font-medium text-stone-500 mb-1">No clause selected</p>
        <p className="text-xs text-stone-400 leading-relaxed max-w-[200px]">
          Click any clause in the list to view details and suggested questions
        </p>
      </div>
    );
  }

  const c = riskColor(clause.riskLevel);

  const RiskIcon =
    clause.riskLevel === "HIGH"
      ? AlertTriangle
      : clause.riskLevel === "MEDIUM"
      ? Info
      : CheckCircle2;

  return (
    <div className="card divide-y divide-stone-100 animate-slide-up overflow-hidden">
      {}
      <div className="px-4 py-3.5">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", c.bg, c.text)}>
            <RiskIcon className="w-3 h-3" />
            {clause.riskLevel} RISK
          </span>
          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full">
            {clause.category}
          </span>
          <span className="text-xs bg-azure-50 text-azure-600 px-2 py-1 rounded-full">
            {confidenceLabel(clause.uncertaintyLevel)}
          </span>
        </div>
        <h3 className="font-bold text-stone-900 text-sm leading-snug">{clause.heading}</h3>
      </div>

      {}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
          Original clause
        </p>
        <blockquote className="text-xs text-stone-600 leading-relaxed bg-stone-50 rounded-lg px-3 py-2.5 border-l-2 border-teal-400">
          {clause.text}
          {clause.text.endsWith("…") && (
            <span className="text-stone-400"> (truncated)</span>
          )}
        </blockquote>
      </div>

      {}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            What this means for you
          </p>
          {clause.riskExplanationHi && (
            <div className="flex items-center rounded-full border border-stone-200 overflow-hidden text-xs">
              <button
                onClick={() => setLang("en")}
                className={cn(
                  "px-2.5 py-0.5 font-medium transition-colors",
                  lang === "en" ? "bg-teal-600 text-white" : "text-stone-400 hover:bg-stone-50"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                className={cn(
                  "px-2.5 py-0.5 font-medium transition-colors",
                  lang === "hi" ? "bg-teal-600 text-white" : "text-stone-400 hover:bg-stone-50"
                )}
              >
                हिं
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          {lang === "hi" && clause.riskExplanationHi
            ? clause.riskExplanationHi
            : clause.riskExplanationEn}
        </p>
      </div>

      {}
      {(clause.suggestedQuestions?.length ?? 0) > 0 && (
        <div className="px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Ask your lawyer
          </p>
          <ul className="flex flex-col gap-1.5">
            {clause.suggestedQuestions?.map((q, i) => (
              <li
                key={i}
                className="text-xs text-stone-600 bg-stone-50 rounded-lg px-3 py-2 leading-relaxed"
              >
                <span className="text-teal-500 font-bold mr-1">→</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {}
      {clause.source_status === "UNVERIFIED" ? (
        <div className="px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
            Legal sources
          </p>
          <div className="flex items-start gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
            <Info className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-stone-500 leading-relaxed">
              <strong>AI Analysis</strong> — Not verified against specific statutory text.
            </p>
          </div>
        </div>
      ) : clause.sources && clause.sources.length > 0 ? (
        <div className="px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Verified sources
          </p>
          <ul className="flex flex-col gap-1.5">
            {clause.sources.map((src, i) => (
              <li key={i} className="text-xs">
                <span className="font-medium text-stone-700">{src.title}</span>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-azure-600 hover:underline mt-0.5 break-all"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    {src.url}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
