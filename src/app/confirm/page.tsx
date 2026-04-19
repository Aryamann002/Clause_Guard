
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Video, Copy, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAppStore } from "@/hooks/useAppStore";
import type { Consultation } from "@/types";

export default function ConfirmPage() {
  const router = useRouter();
  const { lang, setLang, analysisResult } = useAppStore();

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [lawyerName, setLawyerName] = useState("your lawyer");

  useEffect(() => {
    const stored = sessionStorage.getItem("consultationResult");
    const name = sessionStorage.getItem("lawyerName");
    if (!stored) {
      router.push("/");
      return;
    }
    setConsultation(JSON.parse(stored));
    if (name) setLawyerName(name);
  }, [router]);

  function copyLink() {
    if (consultation?.callLink) {
      navigator.clipboard.writeText(consultation.callLink).then(() => {
        toast.success("Link copied!");
      });
    }
  }

  function joinCall() {
    toast("In production, this opens your Jitsi / Daily.co video room.", {
      icon: "🎥",
      duration: 4000,
    });
  }

  if (!consultation) return null;

  return (
    <div className="min-h-screen flex flex-col bg-stone-25">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-12 text-center">
        {}
        <div className="w-16 h-16 bg-forest-50 border border-forest-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-forest-600" strokeWidth={2} />
        </div>

        <h1 className="font-serif font-bold text-3xl text-stone-900 mb-2">
          Consultation confirmed!
        </h1>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
          Your session with <strong className="text-stone-700">{lawyerName}</strong> is
          booked. You&apos;ll receive confirmation details via email.
        </p>

        {}
        <div className="card p-5 mb-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
            Your private video call link
          </p>
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2.5">
            <code className="text-xs text-teal-700 flex-1 break-all font-mono">
              {consultation.callLink}
            </code>
            <button
              onClick={copyLink}
              className="text-teal-500 hover:text-teal-700 transition-colors flex-shrink-0 p-1"
              title="Copy link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            Share this link with your lawyer. Valid for your scheduled session only.
          </p>
        </div>

        {}
        <div className="card p-5 mb-6 text-left">
          <h2 className="font-semibold text-stone-700 text-sm mb-3">Booking details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-400">Booking ID</dt>
              <dd className="font-mono text-xs text-stone-600">{consultation.id.slice(0, 12)}…</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-400">Scheduled at</dt>
              <dd className="text-stone-700 font-medium text-xs">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "long",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata",
                }).format(new Date(consultation.scheduledAt))}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-400">Payment</dt>
              <dd className="text-forest-600 font-semibold">
                ✓ ₹{consultation.payment?.amount?.toLocaleString("en-IN") ?? 0} (mock)
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-400">Status</dt>
              <dd className="bg-forest-50 text-forest-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {consultation.status}
              </dd>
            </div>
          </dl>
        </div>

        {}
        <button
          onClick={joinCall}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 mb-3 text-base"
        >
          <Video className="w-4 h-4" />
          Join video call
        </button>

        {analysisResult && (
          <Link
            href={`/results/${analysisResult.documentId}`}
            className="btn-secondary w-full py-2.5 flex items-center justify-center gap-1.5 text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to contract analysis
          </Link>
        )}

        <p className="text-xs text-stone-400 mt-5 leading-relaxed">
          ⚠️ This is a demo booking. No real consultation has been scheduled and no money
          was charged.
        </p>
      </main>

      <Footer />
    </div>
  );
}
