
"use client";

import { Star, Clock, Users, MapPin } from "lucide-react";
import { formatINR } from "@/lib/utils";
import type { Lawyer } from "@/types";

interface LawyerCardProps {
  lawyer: Lawyer;
  onBook: (lawyer: Lawyer) => void;
}

export function LawyerCard({ lawyer, onBook }: LawyerCardProps) {
  return (
    <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      onClick={() => onBook(lawyer)}
    >
      {}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600 font-bold font-serif text-lg border border-teal-100">
          {lawyer.name.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-stone-900 text-sm">{lawyer.name}</h3>
            {lawyer.isVerified && (
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded-full border border-teal-100">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {lawyer.specialties.join(" · ")}
          </p>
          <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
            <MapPin className="w-3 h-3" />
            Remote
          </div>
        </div>
      </div>

      {}
      <div className="flex flex-wrap gap-1 mb-3">
        {lawyer.languages.map((l) => (
          <span
            key={l}
            className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full"
          >
            {l}
          </span>
        ))}
      </div>

      {}
      <div className="flex items-center gap-4 mb-4 text-xs text-stone-500">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <strong className="text-stone-700">{lawyer.rating}</strong>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <strong className="text-stone-700">{lawyer.yearsExperience}</strong> yrs
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <strong className="text-stone-700">{lawyer.totalConsults.toLocaleString("en-IN")}</strong> consults
        </span>
      </div>

      {}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-base font-bold text-teal-600">
            {formatINR(lawyer.feePerSession)}
          </span>
          <span className="text-xs text-stone-400 ml-1">
            / {lawyer.sessionDurationMins} min
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBook(lawyer); }}
          className="btn-primary text-xs px-4 py-2 group-hover:bg-teal-400"
        >
          Book session →
        </button>
      </div>
    </div>
  );
}
