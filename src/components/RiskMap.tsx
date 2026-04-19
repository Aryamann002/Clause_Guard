"use client";
import { cn } from "@/lib/utils";

interface Clause {
  id: string;
  index: number;
  heading: string | null;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  category: string;
}

interface Props {
  clauses: Clause[];
  onSelect: (index: number) => void;
  selectedIndex: number | null;
}

const RISK_COLORS = {
  HIGH: "bg-red-500 hover:bg-red-400",
  MEDIUM: "bg-amber-400 hover:bg-amber-300",
  LOW: "bg-emerald-500 hover:bg-emerald-400",
};

const RISK_LABEL_COLORS = {
  HIGH: "text-red-400 bg-red-950 border-red-800",
  MEDIUM: "text-amber-400 bg-amber-950 border-amber-800",
  LOW: "text-emerald-400 bg-emerald-950 border-emerald-800",
};

export default function RiskMap({ clauses, onSelect, selectedIndex }: Props) {
  const counts = {
    HIGH: clauses.filter((c) => c.riskLevel === "HIGH").length,
    MEDIUM: clauses.filter((c) => c.riskLevel === "MEDIUM").length,
    LOW: clauses.filter((c) => c.riskLevel === "LOW").length,
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
      <h3 className="font-semibold text-white mb-1">Risk Surface Map</h3>
      <p className="text-slate-500 text-xs mb-4">
        Click any segment to view the clause
      </p>

      {}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["HIGH", "MEDIUM", "LOW"] as const).map((level) => (
          <span
            key={level}
            className={cn(
              "text-xs px-2 py-1 rounded-md border font-medium",
              RISK_LABEL_COLORS[level]
            )}
          >
            {counts[level]} {level}
          </span>
        ))}
      </div>

      {}
      <div className="flex gap-0.5 rounded-lg overflow-hidden h-4 mb-5">
        {clauses.map((c, i) => (
          <button
            key={c.id}
            title={`Clause ${i + 1}: ${c.category} — ${c.riskLevel}`}
            onClick={() => onSelect(i)}
            className={cn(
              "flex-1 transition-all duration-150",
              RISK_COLORS[c.riskLevel],
              selectedIndex === i
                ? "ring-2 ring-white ring-offset-1 ring-offset-slate-800"
                : ""
            )}
          />
        ))}
      </div>

      {}
      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
        {clauses.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onSelect(i)}
            className={cn(
              "text-left px-3 py-2 rounded-lg text-xs transition border",
              selectedIndex === i
                ? "bg-blue-900 border-blue-600 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            )}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full flex-shrink-0",
                  c.riskLevel === "HIGH"
                    ? "bg-red-400"
                    : c.riskLevel === "MEDIUM"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                )}
              />
              <span className="truncate">
                {c.heading || `Clause ${i + 1}`}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
