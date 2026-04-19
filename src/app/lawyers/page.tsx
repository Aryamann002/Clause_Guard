
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { LawyerFilter } from "@/components/lawyers/LawyerFilter";
import { LawyersSkeleton } from "@/components/ui/Skeleton";
import { useAppStore } from "@/hooks/useAppStore";
import type { Lawyer } from "@/types";

export default function LawyersPage() {
  const router = useRouter();
  const { lang, setLang, setSelectedLawyer, analysisResult } = useAppStore();

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    specialty: "",
    language: "",
    maxFee: "",
  });

  
  useEffect(() => {
    fetchLawyers();
  }, [filters]);

  async function fetchLawyers() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.specialty) params.set("specialty", filters.specialty);
      if (filters.language) params.set("language", filters.language);
      if (filters.maxFee) params.set("maxFee", filters.maxFee);

      const res = await fetch(`/api/lawyers?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load lawyers.");
      setLawyers(json.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load lawyers.");
    } finally {
      setLoading(false);
    }
  }

  function handleBook(lawyer: Lawyer) {
    setSelectedLawyer(lawyer);
    router.push("/book");
  }

  const backHref = analysisResult
    ? `/results/${analysisResult.documentId}`
    : "/";

  return (
    <div className="min-h-screen flex flex-col bg-stone-25">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {analysisResult ? "Back to analysis" : "Back to home"}
        </Link>

        <div className="mb-6">
          <h1 className="font-serif font-bold text-2xl text-stone-900 mb-1">
            Verified Lawyers
          </h1>
          <p className="text-sm text-stone-500">
            Book a private audio/video consultation with a verified Indian lawyer
          </p>
        </div>

        {}
        <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex gap-1">
              <span className="w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
              <span className="w-5 h-5 bg-teal-100 text-teal-600 text-xs font-bold rounded-full flex items-center justify-center">2</span>
            </div>
          </div>
          <p className="text-sm text-teal-700">
            <strong>Step 1 done</strong> — You&apos;ve reviewed your contract with AI.{" "}
            <strong>Step 2</strong>: Book a lawyer if you still have questions.
            Your contract and AI summary will be automatically shared with them.
          </p>
        </div>

        <LawyerFilter filters={filters} onChange={setFilters} />

        {error && (
          <div className="bg-crimson-50 border border-crimson-200 rounded-xl px-4 py-3 text-sm text-crimson-600 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <LawyersSkeleton />
        ) : lawyers.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p className="text-lg font-medium mb-2">No lawyers found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lawyers.map((lawyer) => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} onBook={handleBook} />
            ))}
          </div>
        )}

        <p className="text-center text-xs text-stone-400 mt-8">
          ⚠️ Lawyer profiles are for demo purposes. No real consultation is scheduled.
        </p>
      </main>

      <Footer />
    </div>
  );
}
