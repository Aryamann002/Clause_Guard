
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAppStore } from "@/hooks/useAppStore";
import { formatINR, cn } from "@/lib/utils";
import type { Consultation } from "@/types";

export default function PaymentPage() {
  const router = useRouter();
  const {
    lang, setLang,
    selectedLawyer,
    selectedSlotDatetime,
    preConsultQuestions,
    analysisResult,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Consultation | null>(null);

  useEffect(() => {
    if (!selectedLawyer || !selectedSlotDatetime) router.push("/lawyers");
  }, [selectedLawyer, selectedSlotDatetime, router]);

  if (!selectedLawyer || !selectedSlotDatetime) return null;

  async function processPayment(simulateFail: boolean) {
    setError("");
    setLoading(true);

    
    await new Promise((r) => setTimeout(r, 1800));

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId: selectedLawyer!.id,
          documentId: analysisResult?.documentId || null,
          scheduledAt: selectedSlotDatetime,
          preConsultQuestions: preConsultQuestions || "",
          paymentSuccess: !simulateFail,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.code === "PAYMENT_FAILED") {
          setError("Payment declined. Your card was not charged. Please try again.");
          return;
        }
        throw new Error(json.error || "Booking failed.");
      }

      setResult(json.data);
      toast.success("Booking confirmed!", { icon: "🎉" });

      
      sessionStorage.setItem("consultationResult", JSON.stringify(json.data));
      sessionStorage.setItem("lawyerName", selectedLawyer!.name);
      router.push("/confirm");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-25">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <Link
          href="/book"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>

        <div className="text-center mb-6">
          <h1 className="font-serif font-bold text-2xl text-stone-900 mb-1">
            Complete your booking
          </h1>
          <p className="text-sm text-stone-400">Mock payment — no real charges</p>
        </div>

        {}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-stone-700 text-sm mb-3">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Lawyer</span>
              <span className="font-medium">{selectedLawyer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Duration</span>
              <span className="font-medium">{selectedLawyer.sessionDurationMins} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Slot</span>
              <span className="font-medium text-xs">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata",
                }).format(new Date(selectedSlotDatetime))}
              </span>
            </div>
            <div className="border-t border-stone-100 pt-2 mt-2 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-teal-600 text-lg">
                {formatINR(selectedLawyer.feePerSession)}
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="card p-5 mb-4">
          <div className="flex items-center gap-2 mb-4 text-xs text-stone-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure demo payment — no real data collected</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-stone-400" />
                <span className="text-sm text-stone-500 font-mono tracking-wider">
                  •••• •••• •••• 4242
                </span>
              </div>
              <div className="flex gap-1">
                <span className="text-[10px] font-bold text-white bg-[#1A1F71] px-1.5 py-0.5 rounded">VISA</span>
                <span className="text-[10px] font-bold text-white bg-[#EB001B] px-1.5 py-0.5 rounded">MC</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400 font-mono">
                12/27
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400 font-mono">
                •••
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-3 bg-crimson-50 border border-crimson-200 rounded-lg px-4 py-3 text-sm text-crimson-600">
              {error}
            </div>
          )}
        </div>

        {}
        <button
          onClick={() => processPayment(false)}
          disabled={loading}
          className={cn(
            "btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mb-3",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay {formatINR(selectedLawyer.feePerSession)} securely
            </>
          )}
        </button>

        <button
          onClick={() => processPayment(true)}
          disabled={loading}
          className="w-full text-center text-xs text-stone-400 hover:text-stone-600 transition-colors underline py-2"
        >
          Simulate payment failure
        </button>

        <p className="text-center text-xs text-stone-400 mt-4">
          ⚠️ Demo only — no real payment is processed
        </p>
      </main>

      <Footer />
    </div>
  );
}
