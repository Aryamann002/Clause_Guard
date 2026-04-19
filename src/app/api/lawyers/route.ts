import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MOCK_LAWYERS = [
  {
    id: "lawyer_1",
    name: "Adv. Priya Nair",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    specialties: "Employment Law, Service Agreements",
    languages: "English, Hindi, Malayalam",
    yearsExperience: 9,
    feePerSession: 1500,
    sessionDurationMins: 30,
    rating: 4.8,
    totalConsults: 312,
  },
  {
    id: "lawyer_2",
    name: "Adv. Rohan Mehta",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohan",
    specialties: "Real Estate, Rental Agreements, Property Law",
    languages: "English, Hindi, Gujarati",
    yearsExperience: 14,
    feePerSession: 2000,
    sessionDurationMins: 45,
    rating: 4.9,
    totalConsults: 587,
  },
  {
    id: "lawyer_3",
    name: "Adv. Kavitha Sundaram",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavitha",
    specialties: "Consumer Protection, E-Commerce Contracts",
    languages: "English, Hindi, Tamil",
    yearsExperience: 7,
    feePerSession: 1200,
    sessionDurationMins: 30,
    rating: 4.7,
    totalConsults: 201,
  },
  {
    id: "lawyer_4",
    name: "Adv. Amit Bose",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
    specialties: "Business Contracts, Vendor Agreements, Startups",
    languages: "English, Hindi, Bengali",
    yearsExperience: 11,
    feePerSession: 2500,
    sessionDurationMins: 60,
    rating: 4.6,
    totalConsults: 445,
  },
  {
    id: "lawyer_5",
    name: "Adv. Fatima Shaikh",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
    specialties: "Financial Agreements, Loan Contracts, Banking Law",
    languages: "English, Hindi, Urdu",
    yearsExperience: 12,
    feePerSession: 1800,
    sessionDurationMins: 45,
    rating: 4.9,
    totalConsults: 398,
  },
  {
    id: "lawyer_6",
    name: "Adv. Vikram Singh",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    specialties: "IP & Technology, SaaS Agreements, NDAs",
    languages: "English, Hindi",
    yearsExperience: 8,
    feePerSession: 2000,
    sessionDurationMins: 30,
    rating: 4.7,
    totalConsults: 276,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get("specialty");
    const language = searchParams.get("language");
    const maxFee = searchParams.get("maxFee");

    // Bypass Prisma (SQLite doesn't work on Vercel Edge/Serverless)
    let filtered = [...MOCK_LAWYERS];

    if (specialty) {
      filtered = filtered.filter((l) =>
        (l.specialties ?? "").toLowerCase().includes(specialty.toLowerCase())
      );
    }

    if (language) {
      filtered = filtered.filter((l) =>
        (l.languages ?? "").toLowerCase().includes(language.toLowerCase())
      );
    }

    if (maxFee) {
      const max = parseInt(maxFee, 10);
      if (!isNaN(max)) {
        filtered = filtered.filter((l) => l.feePerSession <= max);
      }
    }

    const data = filtered.map((l) => ({
      ...l,
      specialties: (l.specialties ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      languages: (l.languages ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/lawyers error:", error);
    return NextResponse.json({ data: [], error: "Failed to fetch lawyers" }, { status: 500 });
  }
}
