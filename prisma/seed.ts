import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lawyers = [
  {
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

async function main() {
  console.log("Seeding lawyers...");
  for (const lawyer of lawyers) {
    await prisma.lawyer.create({
      data: lawyer,
    });
  }
  console.log("✅ Seeded", lawyers.length, "lawyers.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
