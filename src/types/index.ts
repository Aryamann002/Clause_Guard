export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type UncertaintyLevel =
  | "HIGH_CONFIDENCE"
  | "MEDIUM_CONFIDENCE"
  | "LOW_CONFIDENCE";

export type ConsultationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface ClauseSource {
  id: string;
  title: string;
  url: string;
  sourceType: string;
}

export interface Clause {
  id: string;
  documentId: string;
  index: number;
  heading: string | null;
  text: string;
  category: string;
  riskLevel: RiskLevel;
  uncertaintyLevel: UncertaintyLevel;
  riskExplanationEn: string;
  riskExplanationHi: string | null;
  userImpactNotes: string | null;
  sources: ClauseSource[];
  suggestedQuestions?: string[];
  source_status?: "VERIFIED" | "UNVERIFIED";
}

export interface AnalysisMeta {
  id: string;
  documentId: string;
  aiModelUsed: string;
  totalClauses: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  analysisTimeMs: number;
}

export interface Document {
  id: string;
  userId: string | null;
  title: string;
  originalFilename: string;
  jurisdiction: string;
  rawText: string;
  summaryEn: string | null;
  summaryHi: string | null;
  overallRiskScore: number | null;
  createdAt: string;
  updatedAt: string;
  clauses: Clause[];
  analysisMeta: AnalysisMeta | null;
}

export interface Lawyer {
  id: string;
  name: string;
  profileImageUrl: string;
  specialties: string[];
  languages: string[];
  yearsExperience: number;
  feePerSession: number;
  sessionDurationMins: number;
  rating: number;
  totalConsults: number;
  isVerified: boolean;
}

export interface Consultation {
  id: string;
  userId: string | null;
  lawyerId: string;
  documentId: string | null;
  scheduledAt: string;
  status: ConsultationStatus;
  preConsultQuestions: string | null;
  callLink: string | null;
  createdAt: string;
  lawyer: Lawyer;
  document: Document | null;
  payment: Payment | null;
}

export interface Payment {
  id: string;
  consultationId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentProvider: string;
  createdAt: string;
}

export interface AnalysisResult {
  documentId: string;
  docType: string;
  summaryEn: string;
  summaryHi: string | null;
  overallRisk: string;
  clauses: Clause[];
  meta: {
    totalClauses: number;
    truncated: boolean;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
  };
}
