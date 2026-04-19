-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "passwordHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL DEFAULT 'IN',
    "rawText" TEXT NOT NULL,
    "summaryEn" TEXT,
    "summaryHi" TEXT,
    "overallRiskScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Clause" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "heading" TEXT,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "uncertaintyLevel" TEXT NOT NULL,
    "riskExplanationEn" TEXT NOT NULL,
    "riskExplanationHi" TEXT,
    "userImpactNotes" TEXT,
    CONSTRAINT "Clause_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClauseSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clauseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    CONSTRAINT "ClauseSource_clauseId_fkey" FOREIGN KEY ("clauseId") REFERENCES "Clause" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalysisMeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "aiModelUsed" TEXT NOT NULL,
    "totalClauses" INTEGER NOT NULL,
    "highRiskCount" INTEGER NOT NULL,
    "mediumRiskCount" INTEGER NOT NULL,
    "lowRiskCount" INTEGER NOT NULL,
    "analysisTimeMs" INTEGER NOT NULL,
    CONSTRAINT "AnalysisMeta_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lawyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "specialties" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "feePerSession" INTEGER NOT NULL,
    "sessionDurationMins" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "totalConsults" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "lawyerId" TEXT NOT NULL,
    "documentId" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "preConsultQuestions" TEXT,
    "callLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Consultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Consultation_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consultation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "consultationId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL,
    "paymentProvider" TEXT NOT NULL DEFAULT 'mock',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisMeta_documentId_key" ON "AnalysisMeta"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_consultationId_key" ON "Payment"("consultationId");
