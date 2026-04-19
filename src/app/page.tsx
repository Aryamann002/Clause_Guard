
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Map, Users, FileSearch } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UploadZone } from "@/components/analysis/UploadZone";
import { useAppStore } from "@/hooks/useAppStore";
import type { AnalysisResult } from "@/types";

const SAMPLE_CONTRACT = `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into between TechStartup Pvt. Ltd., a company incorporated under the Companies Act, 2013 ("Company") and the individual named below ("Employee").

1. POSITION AND DUTIES
The Employee is hired as Software Engineer. The Employee shall devote their full time and attention to the business of the Company and shall not engage in any other employment without prior written consent.

2. COMPENSATION
The Employee will receive a gross salary of INR 8,00,000 per annum, payable monthly. The Company reserves the right to revise compensation at its sole discretion with 30 days notice.

3. PROBATION PERIOD
The Employee will be on probation for a period of 6 months from the date of joining, during which the employment may be terminated with 7 days notice by either party without assigning any reason.

4. CONFIDENTIALITY
The Employee agrees to keep all information relating to the Company's business, clients, trade secrets, and technical information strictly confidential during and for a period of 3 years after termination of employment.

5. NON-COMPETE CLAUSE
The Employee shall not, for a period of 2 years after termination, engage directly or indirectly in any business that is competitive with the Company's business, within India.

6. INTELLECTUAL PROPERTY
All inventions, software, works of authorship, and other intellectual property created by the Employee, whether during working hours or otherwise, shall be the exclusive property of the Company.

7. TERMINATION
The Company may terminate this agreement with 30 days written notice or payment in lieu thereof. For misconduct or breach, termination may be immediate without notice or compensation.

8. DISPUTE RESOLUTION
All disputes arising out of this Agreement shall be settled by arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Bangalore.

9. GOVERNING LAW
This Agreement shall be governed by the laws of India and courts of Bangalore shall have exclusive jurisdiction.`;

export default function HomePage() {
  const router = useRouter();
  const { lang, setLang, setAnalysisResult } = useAppStore();
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const STEPS = [
    "Reading your document…",
    "Segmenting clauses…",
    "Running AI analysis…",
    "Mapping risks under Indian law…",
    "Preparing your results…",
  ];

  async function handleAnalyze() {
    setError("");

    if (!file && !pasteText.trim()) {
      setError("Please upload a file or paste your contract text.");
      return;
    }

    setLoading(true);

    
    let step = 0;
    const stepInterval = setInterval(() => {
      step = Math.min(step + 1, STEPS.length - 1);
      setLoadingStep(step);
    }, 5000);

    try {
      let res: Response;

      const form = new FormData();
      if (file) {
        form.append("file", file);
        form.append("title", file.name.replace(/\.pdf$/i, ""));
      } else {
        form.append("text", pasteText);
        form.append("title", "Pasted Contract");
      }
      res = await fetch("/api/documents/upload", { method: "POST", body: form });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Analysis failed. Please try again.");
      }

      const result: AnalysisResult = json;
      setAnalysisResult(result);
      toast.success("Analysis complete!", { icon: "✅" });
      router.push(`/analysis/${result.documentId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      toast.error(msg);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  }

  function loadSample() {
    setPasteText(SAMPLE_CONTRACT);
    setFile(null);
    textAreaRef.current?.focus();
    toast("Sample employment contract loaded!", { icon: "📄" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="flex-1">
        {}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-100 mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            India-focused contract review · AI + verified lawyers
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight mb-4 text-balance">
            Understand your contract{" "}
            <em className="text-teal-600 not-italic">before you sign</em>
          </h1>

          <p className="text-stone-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Upload any contract. Get plain-language explanations, clause-level
            risk analysis, and a visual risk map — grounded in Indian law.
          </p>

          {}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 text-left">
            <UploadZone
              file={file}
              onFile={(f) => { setFile(f); setPasteText(""); setError(""); }}
              onClear={() => setFile(null)}
            />

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-xs text-stone-400 font-medium">or paste text</span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>

            <textarea
              ref={textAreaRef}
              className="input-base resize-none min-h-[120px] text-sm"
              placeholder="Paste your contract text here…"
              value={pasteText}
              onChange={(e) => { setPasteText(e.target.value); setFile(null); setError(""); }}
              disabled={loading}
            />

            {error && (
              <div className="mt-3 bg-crimson-50 border border-crimson-400/20 rounded-lg px-4 py-3 text-sm text-crimson-600">
                {error}
              </div>
            )}

            {loading ? (
              <div className="mt-4 bg-teal-50 border border-teal-100 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin flex-shrink-0" />
                  <span className="text-sm font-semibold text-teal-700">
                    {STEPS[loadingStep]}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-teal-100">
                  <div
                    className="bg-teal-500 rounded-full transition-all duration-1000"
                    style={{ width: `${((loadingStep + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-teal-500 mt-2">
                  Usually takes 15–30 seconds
                </p>
              </div>
            ) : (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                >
                  Analyze contract
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={loadSample}
                  className="btn-secondary text-sm px-4"
                  title="Load a sample employment contract to try"
                >
                  Try sample
                </button>
              </div>
            )}
          </div>
        </section>

        {}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: FileSearch,
                title: "Clause-level analysis",
                desc: "Every clause explained in plain English with risk rating and confidence level",
              },
              {
                icon: Map,
                title: "Risk surface map",
                desc: "Visual overview of where risks are hiding across your entire document",
              },
              {
                icon: Users,
                title: "Talk to a lawyer",
                desc: "Still unsure? Book a verified Indian lawyer for a quick consult",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-stone-100 p-5"
              >
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-stone-800 text-sm mb-1">{title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-stone-400 mt-6 leading-relaxed">
            ⚠️ For educational purposes only · Not legal advice · India jurisdiction
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
