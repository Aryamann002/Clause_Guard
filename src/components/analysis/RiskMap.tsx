
"use client";

import { useRef } from "react";
import type { Clause, RiskLevel } from "@/types";
import { riskColor } from "@/lib/utils";

interface RiskMapProps {
  clauses: Clause[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const RISK_ORDER: RiskLevel[] = ["HIGH", "MEDIUM", "LOW"];

export function RiskMap({ clauses = [], selectedIndex, onSelect }: RiskMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  const high = clauses.filter((c) => c.riskLevel === "HIGH").length;
  const medium = clauses.filter((c) => c.riskLevel === "MEDIUM").length;
  const low = clauses.filter((c) => c.riskLevel === "LOW").length;

  if (clauses.length === 0) return null;

  return (
    <div>
      {}
      <div className="flex items-center gap-4 mb-3">
        {[
          { label: "High risk", count: high, level: "HIGH" as RiskLevel },
          { label: "Medium risk", count: medium, level: "MEDIUM" as RiskLevel },
          { label: "Low risk", count: low, level: "LOW" as RiskLevel },
        ].map(({ label, count, level }) => {
          const c = riskColor(level);
          return (
            <div key={level} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
              <span className="text-xs text-stone-500">
                <span className={`font-bold ${c.text}`}>{count}</span>{" "}
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {}
      <div
        ref={mapRef}
        className="flex gap-0.5 h-8 rounded-lg overflow-hidden"
        role="group"
        aria-label="Contract risk map"
      >
        {clauses.map((clause, i) => {
          const barColor = riskColor(clause.riskLevel).bar;
          const isSelected = selectedIndex === i;
          return (
            <button
              key={clause.index}
              onClick={() => onSelect(i)}
              className="flex-1 transition-all duration-150 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/60"
              style={{
                backgroundColor: barColor,
                opacity: isSelected ? 1 : 0.75,
                transform: isSelected ? "scaleY(1.15)" : "scaleY(1)",
              }}
              title={`${clause.heading} — ${clause.riskLevel} RISK`}
              aria-pressed={isSelected}
            />
          );
        })}
      </div>

      <p className="text-xs text-stone-400 mt-2">
        {clauses.length} clauses · click a segment to inspect
      </p>
    </div>
  );
}
