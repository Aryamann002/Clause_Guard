"use client";
import {
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  title: string;
  url: string;
  sourceType: string;
}

interface ClauseData {
  index: number;
  heading: string | null;
  text: string;
  category: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  uncertaintyLevel:
    | "HIGH_CONFIDENCE"
    | "MEDIUM_CONFIDENCE"
    | "LOW_CONFIDENCE";
  riskExplanationEn: string;
  riskExplanationHi?: string | null;
  userImpactNotes?: string | null;
  sources: Source[];
}

const RISK_CONFIG = {
  HIGH: {
    label: "High Risk",
    icon: <AlertTriangle className="w-4 h-4" />,
    classes: "bg-red-950 border-red-700 text-red-300",
  },
  MEDIUM: {
    label: "Medium Risk",
    icon: <Info className="w-4 h-4" />,
    classes: "bg-amber-950 border-amber-700 text-amber-300",
  },
  LOW: {
    label: "Low Risk",
    icon: <CheckCircle className="w-4 h-4" />,
    classes: "bg-emerald-950 border-emerald-700 text-emerald-300",
  },
};

const CONFIDENCE_LABELS = {
  HIGH_CONFIDENCE: { label: "High Confidence", color: "text-emerald-400" },
  MEDIUM_CONFIDENCE: { label: "Medium Confidence", color: "text-amber-400" },
  LOW_CONFIDENCE: {
    label: "Low Confidence — Seek Advice",
    color: "text-red-400",
  },
};

export default function ClauseDetailPanel({
  clause,
  showHindi,
}: {
  clause: ClauseData;
  showHindi: boolean;
}) {
  const risk = RISK_CONFIG[clause.riskLevel];
  const confidence = CONFIDENCE_LABELS[clause.uncertaintyLevel];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-4">
      {}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-slate-400 text-xs mb-1">
            Clause {clause.index + 1} · {clause.category}
          </p>
          <h3 className="font-semibold text-white">
            {clause.heading || `Clause ${clause.index + 1}`}
          </h3>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
            risk.classes
          )}
        >
          {risk.icon} {risk.label}
        </span>
      </div>

      {}
      <div className="bg-slate-900 rounded-xl p-3 text-sm text-slate-300 leading-relaxed border border-slate-700 max-h-32 overflow-y-auto">
        {clause.text}
      </div>

      {}
      <p className={cn("text-xs font-medium", confidence.color)}>
        AI Confidence: {confidence.label}
      </p>

      {}
      <div>
        <p className="text-slate-400 text-xs font-medium mb-1.5">
          {showHindi ? "जोखिम की व्याख्या" : "Risk Explanation"}
        </p>
        <p className="text-slate-200 text-sm leading-relaxed">
          {showHindi && clause.riskExplanationHi
            ? clause.riskExplanationHi
            : clause.riskExplanationEn}
        </p>
      </div>

      {}
      {clause.userImpactNotes && (
        <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3">
          <p className="text-xs text-blue-400 font-medium mb-1">
            What this means for you
          </p>
          <p className="text-slate-300 text-sm">{clause.userImpactNotes}</p>
        </div>
      )}

      {}
      {clause.sources.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs font-medium mb-2">
            Legal References
          </p>
          <div className="space-y-1.5">
            {clause.sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 hover:underline"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
