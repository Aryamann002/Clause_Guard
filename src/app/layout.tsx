import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ClauseGuard — AI Contract Simplifier for India",
  description:
    "Upload any contract, get a plain-language summary, see risky clauses highlighted instantly — and talk to a verified Indian lawyer only if you need to.",
  keywords: [
    "contract analysis",
    "legal AI",
    "Indian law",
    "clause risk",
    "contract simplifier",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
