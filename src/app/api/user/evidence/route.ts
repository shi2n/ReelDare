import { NextRequest, NextResponse } from "next/server";
import { addBackendEvidence, getUserEvidences, findUserById } from "@/lib/user-backend";
import { evidenceSubmitSchema, sanitizeString } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    const spUserId = req.nextUrl.searchParams.get("userId");
    const userId = spUserId || headerUserId || cookieUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const list = await getUserEvidences(userId);
    return NextResponse.json({ evidences: list });
  } catch (err: any) {
    console.error("Get evidence error:", err);
    return NextResponse.json({ error: "Failed to load evidence" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`evidence:${ip}`, 20, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait a moment." }, { status: 429 });
    }

    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    const sessionUserId = cookieUserId || headerUserId;

    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = evidenceSubmitSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid submission data" },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const user = await findUserById(sessionUserId);
    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    const newEvidence = await addBackendEvidence({
      userId: sessionUserId,
      expId: data.expId,
      expTitle: sanitizeString(data.expTitle, 200),
      category: sanitizeString(data.category, 50),
      whatYouDid: sanitizeString(data.whatYouDid, 1000),
      timeSpent: sanitizeString(data.timeSpent, 50),
      completedDate: sanitizeString(data.completedDate, 50),
      evidenceLink: sanitizeString(data.evidenceLink, 1000),
      xpEarned: data.xpEarned,
    });

    return NextResponse.json({
      success: true,
      evidence: newEvidence,
    });
  } catch (err: any) {
    console.error("Submit evidence error:", err);
    return NextResponse.json({ error: "Failed to submit challenge proof" }, { status: 500 });
  }
}
