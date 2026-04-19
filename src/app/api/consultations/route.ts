import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lawyerId, scheduledAt } = body;

    if (!lawyerId || !scheduledAt) {
      return NextResponse.json(
        { error: "lawyerId and scheduledAt are required." },
        { status: 400 }
      );
    }

    // Bypass Prisma
    const roomId = crypto.randomUUID().substring(0, 8);
    const callLink = `https://meet.jit.si/clauseguard-${roomId}`;
    const consultationId = "consult_" + crypto.randomUUID().substring(0, 8);

    return NextResponse.json({ 
      data: {
        id: consultationId,
        consultationId,
        callLink,
        status: "CONFIRMED",
        scheduledAt: scheduledAt || new Date().toISOString(),
        payment: {
          amount: 1500,
          status: "SUCCESS"
        }
      }
    });
  } catch (error) {
    console.error("POST /api/consultations error:", error);
    return NextResponse.json(
      { error: "Failed to create consultation." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
