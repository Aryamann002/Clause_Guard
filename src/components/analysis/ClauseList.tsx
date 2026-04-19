
"use client";

import { cn, riskColor } from "@/lib/utils";
import type { Clause } from "@/types";

interface ClauseListProps {
  clauses: Clause[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  lang: "en" | "hi";
}

export function ClauseList({ clauses = [], selectedIndex, onSelect, lang }: ClauseListProps) {
  if (clauses.length === 0) {
    return (
      <div className="text-center py-8 text-stone-400 text-sm">
        No clauses found.
      </div>
    );
  }

  const RISK_PRIORITY: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  
  const sorted = [...clauses].sort(
    (a, b) =>
      (RISK_PRIORITY[a.riskLevel] ?? 3) - (RISK_PRIORITY[b.riskLevel] ?? 3)
  );

  return (
    <div className="flex flex-col gap-2 mt-4">
      {sorted.map((clause) => {
        
        const originalIndex = clauses.indexOf(clause);
        const c = riskColor(clause.riskLevel);
        const isSelected = selectedIndex === originalIndex;

        return (
          <button
            key={clause.index}
            id={`clause-item-${originalIndex}`}
            onClick={() => onSelect(originalIndex)}
            className={cn(
              "w-full text-left rounded-xl border px-4 py-3 transition-all duration-150 group",
              isSelected
                ? "border-teal-400 bg-teal-50 dark:bg-teal-900/20 shadow-sm"
                : "border-stone-100 bg-white dark:bg-stone-900 dark:border-stone-800 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm"
            )}
          >
            <div className="flex items-start gap-3">
              {}
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm text-stone-800 dark:text-stone-200 truncate">
                    {clause.heading}
                  </span>
                  <span className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-full flex-shrink-0">
                    {clause.category}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                      c.bg,
                      c.text
                    )}
                  >
                    {clause.riskLevel}
                  </span>
                </div>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {lang === "hi" && clause.riskExplanationHi
                    ? clause.riskExplanationHi
                    : clause.riskExplanationEn}
                </p>
              </div>

              {}
              <span
                className={cn(
                  "text-stone-300 text-sm flex-shrink-0 mt-0.5 transition-transform",
                  isSelected ? "text-teal-400 translate-x-0.5" : "group-hover:translate-x-0.5"
                )}
              >
                →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
