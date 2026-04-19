
"use client";

interface Filters {
  specialty: string;
  language: string;
  maxFee: string;
}

interface LawyerFilterProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const SPECIALTIES = ["", "Employment", "Real Estate", "Business", "Consumer", "Finance"];
const LANGUAGES   = ["", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "Marathi"];
const FEE_OPTIONS = [
  { label: "Any fee", value: "" },
  { label: "Under ₹1,000", value: "1000" },
  { label: "Under ₹1,500", value: "1500" },
  { label: "Under ₹2,000", value: "2000" },
];

export function LawyerFilter({ filters, onChange }: LawyerFilterProps) {
  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  const selectClass =
    "bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 outline-none focus:border-teal-400 cursor-pointer transition-colors";

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <select
        className={selectClass}
        value={filters.specialty}
        onChange={(e) => update("specialty", e.target.value)}
        aria-label="Filter by specialty"
      >
        <option value="">All specialties</option>
        {SPECIALTIES.filter(Boolean).map((s) => (
          <option key={s} value={s}>{s} law</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.language}
        onChange={(e) => update("language", e.target.value)}
        aria-label="Filter by language"
      >
        <option value="">All languages</option>
        {LANGUAGES.filter(Boolean).map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.maxFee}
        onChange={(e) => update("maxFee", e.target.value)}
        aria-label="Filter by fee"
      >
        {FEE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {(filters.specialty || filters.language || filters.maxFee) && (
        <button
          onClick={() => onChange({ specialty: "", language: "", maxFee: "" })}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors px-2"
        >
          Clear filters ×
        </button>
      )}
    </div>
  );
}
