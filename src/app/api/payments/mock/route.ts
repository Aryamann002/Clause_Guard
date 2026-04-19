import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { consultationId, simulateFailure } = await req.json();

  const shouldFail = simulateFailure === true;

  if (shouldFail) {
    return NextResponse.json(
      {
        error:
          "Payment declined. Please check your payment details and retry.",
      },
      { status: 402 }
    );
  }

  const paymentId = "pay_" + crypto.randomUUID().substring(0, 8);

  return NextResponse.json({ paymentId, status: "SUCCESS" });
}
