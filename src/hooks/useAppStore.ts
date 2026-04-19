
"use client";

import { create } from "zustand";
import type { AnalysisResult, Lawyer } from "@/types";

interface AppStore {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult) => void;
  clearAnalysis: () => void;

  selectedLawyer: Lawyer | null;
  setSelectedLawyer: (lawyer: Lawyer) => void;

  selectedSlotDatetime: string | null;
  setSelectedSlot: (datetime: string) => void;

  preConsultQuestions: string;
  setPreConsultQuestions: (q: string) => void;

  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
}

export const useAppStore = create<AppStore>((set) => ({
  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),
  clearAnalysis: () => set({ analysisResult: null }),

  selectedLawyer: null,
  setSelectedLawyer: (lawyer) => set({ selectedLawyer: lawyer }),

  selectedSlotDatetime: null,
  setSelectedSlot: (datetime) => set({ selectedSlotDatetime: datetime }),

  preConsultQuestions: "",
  setPreConsultQuestions: (q) => set({ preConsultQuestions: q }),

  lang: "en",
  setLang: (lang) => set({ lang }),
}));
