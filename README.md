<div align="center">
  <h1>⚖️ ClauseGuard</h1>
  <h3>AI Contract Simplifier for India</h3>
  <p><strong>Built with ❤️ by TEAM EL BICHO</strong></p>
</div>

<br/>

## 🚀 Overview

Legal contracts are incredibly complex and filled with jargon. Average citizens in India often sign documents without understanding the hidden risks or knowing which specific laws apply to them. 

**ClauseGuard** is an offline-capable, 100% serverless web application that instantly scans any contract, breaks down the risks, translates legalese into plain English (and Hindi), and maps it directly to the Indian Penal Code and Contract Acts using an advanced AI RAG pipeline.

---

## ✨ Key Features

- **🧠 Deep AI Risk Analysis:** powered by **Google Gemini 2.5 Flash** for rapid, intelligent clause-by-clause breakdown.
- **📚 Indian Law RAG Integration:** The highest-risk clauses are vector-embedded using `embedding-001` and cross-referenced against a dynamic Indian Law Knowledge Base (IPC, Contract Act, etc.) to provide legally grounded explanations.
- **🇮🇳 Multi-lingual Accessibility:** Automatic Hindi translations for summaries and individual high-risk clauses to maximize accessibility for Indian citizens.
- **⚡ 100% Serverless & Stateless:** No databases required! The entire application runs on Vercel's Edge/Serverless architecture using global `Zustand` memory states for instantaneous performance.
- **👨‍⚖️ Lawyer Booking:** Integrated (mocked) booking system to schedule 1-on-1 video consultations via Jitsi for unresolved contract queries.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 App Router, React, Tailwind CSS, Lucide Icons, Zustand (State Management)
- **Backend:** Next.js API Routes (Serverless, 60s maxDuration)
- **AI Engine:** Google Generative AI (`gemini-2.5-flash`), Google Embeddings (`embedding-001`)
- **Deployment:** Vercel

---

## ⚙️ How It Works (The AI Pipeline)

1. **Extraction:** User uploads a PDF or pastes raw text. The frontend parses the document into plain text.
2. **Segmentation:** Regex rules slice the wall of text into distinct, numbered clauses.
3. **Pass 1 (Deep Scan):** Gemini reads the whole document, creates a summary, and assigns a High/Medium/Low risk score to *every single clause*.
4. **Pass 2 (Deep RAG):** The top 5 riskiest clauses are mathematically embedded and cross-referenced with Indian Law. The context is fed back into Gemini to explain *why* the clause is illegal or risky under Indian Law.
5. **Pass 3 (Translation):** Explanations and summaries are seamlessly translated into Hindi.
6. **Delivery:** The massive AI payload is compiled in-memory and instantly rendered into a beautiful UI.

---

## 💻 Local Setup (Quick Start)

Because we stripped out the heavy PostgreSQL dependencies, getting ClauseGuard running locally is now incredibly easy.

```bash
# 1. Clone the repository and navigate inside
cd ClauseGuard

# 2. Install dependencies
npm install

# 3. Configure environment
# Copy the `.env.example` file and create a `.env` file
# Add your Google Gemini API Key:
GEMINI_API_KEY="your_gemini_api_key_here"

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚠️ Disclaimer
ClauseGuard is a Hackathon Prototype built for educational purposes only. It does not constitute real legal advice. 

*Always consult a qualified lawyer before signing legally binding documents.*
