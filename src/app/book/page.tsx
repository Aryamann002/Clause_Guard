
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";


function generateSlots(): string[] {
  const slots: string[] = [];
  const now = new Date();
  
  const base = new Date(now);
  base.setDate(base.getDate() + 1);
  base.setHours(0, 0, 0, 0);

  const times = [10, 14, 17]; 
  let day = 0;
  while (slots.length < 6) {
    const d = new Date(base);
    d.setDate(base.getDate() + day);
    for (const hour of times) {
      if (slots.length >= 6) break;
      d.setHours(hour, 0, 0, 0);
      slots.push(d.toISOString());
    }
    day++;
  }
  return slots;
}

const SLOTS = generateSlots();

export default function BookingPage() {
  const router = useRouter();
  const {
    lang,
    setLang,
    selectedLawyer,
    setSelectedSlot,
    selectedSlotDatetime,
    preConsultQuestions,
    setPreConsultQuestions,
  } = useAppStore();

  
  const [pickedSlot, setPickedSlot] = useState<string | null>(
    selectedSlotDatetime || null
  );

  useEffect(() => {
    if (!selectedLawyer) {
      router.push("/lawyers");
    }
  }, [selectedLawyer, router]);

  if (!selectedLawyer) return null;

  function handleContinue() {
    if (!pickedSlot) return;
    setSelectedSlot(pickedSlot);
    router.push("/payment");
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-25">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <Link
          href="/lawyers"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to lawyers
        </Link>

        <div className="mb-8">
          <h1 className="font-serif font-bold text-2xl text-stone-900 mb-2">
            Schedule your session
          </h1>
          <p className="text-sm text-stone-500">
            Select a convenient time for your consultation with{" "}
            <span className="font-semibold text-stone-700">
              {selectedLawyer.name}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {}
          <div className="md:col-span-1">
            <div className="card p-4 sticky top-8">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold font-serif text-xl border border-teal-100 mb-3">
                {selectedLawyer.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n: string) => n[0])
                  .join("")}
              </div>
              <h2 className="font-bold text-stone-900">
                {selectedLawyer.name}
              </h2>
              <p className="text-xs text-stone-500 mb-3">
                {Array.isArray(selectedLawyer.specialties)
                  ? selectedLawyer.specialties[0]
                  : selectedLawyer.specialties}
              </p>

              <div className="space-y-2 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">Duration</span>
                  <span className="font-medium text-stone-700">
                    {selectedLawyer.sessionDurationMins} min
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">Fee</span>
                  <span className="font-bold text-teal-600">
                    ₹{selectedLawyer.feePerSession}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="md:col-span-2 space-y-6">
            {}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-400" />
                Available Slots
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SLOTS.map((slot) => {
                  const date = new Date(slot);
                  const isSelected = pickedSlot === slot;

                  return (
                    <button
                      key={slot}
                      onClick={() => setPickedSlot(slot)}
                      className={cn(
                        "text-left p-3 rounded-xl border transition-all duration-200",
                        isSelected
                          ? "bg-teal-50 border-teal-200 ring-1 ring-teal-200"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      )}
                    >
                      <div
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider mb-1",
                          isSelected ? "text-teal-600" : "text-stone-400"
                        )}
                      >
                        {date.toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-stone-700">
                        <Clock
                          className={cn(
                            "w-3.5 h-3.5",
                            isSelected ? "text-teal-500" : "text-stone-300"
                          )}
                        />
                        {date.toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-stone-400" />
                Additional context
              </h3>
              <textarea
                value={preConsultQuestions}
                onChange={(e) => setPreConsultQuestions(e.target.value)}
                placeholder="What specific questions do you have about your contract? This helps the lawyer prepare."
                className="w-full h-32 bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
              />
            </div>

            {}
            <button
              onClick={handleContinue}
              disabled={!pickedSlot}
              className={cn(
                "btn-primary w-full py-4 text-base font-semibold",
                !pickedSlot && "opacity-50 cursor-not-allowed"
              )}
            >
              Continue to Payment
            </button>

            <p className="text-center text-[10px] text-stone-400">
              No real booking will be scheduled. This is a hackathon demo.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
