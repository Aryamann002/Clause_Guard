"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLOTS = [
  "Tomorrow 10:00 AM",
  "Tomorrow 2:00 PM",
  "Tomorrow 5:00 PM",
  "Day after 9:00 AM",
  "Day after 11:00 AM",
  "Day after 4:00 PM",
];

interface Lawyer {
  id: string;
  name: string;
  feePerSession: number;
  sessionDurationMins: number;
}

function BookingContent() {
  const params = useParams();
  const lawyerId = params.lawyerId as string;
  const searchParams = useSearchParams();
  const docId = searchParams.get("docId");
  const router = useRouter();

  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [slot, setSlot] = useState("");
  const [questions, setQuestions] = useState("");
  const [step, setStep] = useState<"book" | "pay" | "success" | "fail">(
    "book"
  );
  const [consultId, setConsultId] = useState("");
  const [callLink, setCallLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/lawyers")
      .then((r) => r.json())
      .then((json) => {
        const found = (json.data ?? []).find((l: Lawyer) => l.id === lawyerId);
        setLawyer(found || null);
      });
  }, [lawyerId]);

  const handleBook = async () => {
    if (!slot) return;
    setLoading(true);
    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lawyerId,
        documentId: docId || null,
        scheduledAt: new Date().toISOString(),
        preConsultQuestions: questions,
      }),
    });
    const json = await res.json();
    const data = json.data;
    setConsultId(data.consultationId);
    setCallLink(data.callLink);
    setLoading(false);
    setStep("pay");
  };

  const handlePay = async (fail = false) => {
    if (!lawyer) return;
    setLoading(true);
    const res = await fetch("/api/payments/mock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consultationId: consultId,
        amount: lawyer.feePerSession,
        simulateFailure: fail,
      }),
    });
    setLoading(false);
    if (res.ok) setStep("success");
    else setStep("fail");
  };

  if (!lawyer)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        {step === "book" && (
          <>
            <h1 className="text-2xl font-bold mb-1">Book a Consultation</h1>
            <p className="text-slate-400 text-sm mb-6">
              with {lawyer.name}
            </p>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 mb-5">
              <p className="text-slate-400 text-xs mb-3 font-medium">
                Select a time slot
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`py-2 px-3 rounded-lg text-sm border transition ${
                      slot === s
                        ? "bg-blue-900 border-blue-600 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 resize-none outline-none mb-5 min-h-[100px] focus:ring-2 focus:ring-blue-500"
              placeholder="Add your questions or concerns for the lawyer (optional)..."
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
            />

            {docId && (
              <div className="text-xs text-blue-400 bg-blue-950/40 border border-blue-800/50 rounded-lg p-3 mb-5">
                ✓ Your contract analysis will be automatically shared with{" "}
                {lawyer.name}.
              </div>
            )}

            <Button
              className="w-full bg-blue-600 hover:bg-blue-500 py-3"
              disabled={!slot || loading}
              onClick={handleBook}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                `Continue to Payment — ₹${lawyer.feePerSession}`
              )}
            </Button>
          </>
        )}

        {step === "pay" && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold mb-1">Mock Payment</h2>
            <p className="text-slate-400 text-sm mb-6">
              No real money is charged. This is a demo.
            </p>

            <div className="bg-slate-900 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Lawyer</span>
                <span>{lawyer.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Duration</span>
                <span>{lawyer.sessionDurationMins} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Slot</span>
                <span>{slot}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-400">Total</span>
                <span>₹{lawyer.feePerSession}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-emerald-700 hover:bg-emerald-600 py-3"
                onClick={() => handlePay(false)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "✓ Confirm Payment (Mock)"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-800 text-red-400 hover:bg-red-950 py-2 text-sm"
                onClick={() => handlePay(true)}
                disabled={loading}
              >
                Simulate Payment Failure
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-16">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Consultation Confirmed!
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Your session with {lawyer.name} is booked for {slot}.
            </p>
            <a
              href={callLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium mb-4"
            >
              Join Video Call →
            </a>
            <br />
            <button
              onClick={() => router.push("/")}
              className="text-slate-500 text-sm hover:text-slate-300 mt-3"
            >
              Back to home
            </button>
          </div>
        )}

        {step === "fail" && (
          <div className="text-center py-16">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your payment could not be processed. Please check your details
              and try again.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-500"
              onClick={() => setStep("pay")}
            >
              Retry Payment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
