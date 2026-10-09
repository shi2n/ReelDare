import { NextRequest, NextResponse } from "next/server";
import { findUserByEmailOrUsername, getUserEvidences } from "@/lib/user-backend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`login:${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const identifier = sanitizeString(body.identifier || "", 320);

    if (!identifier) {
      return NextResponse.json({ error: "Invalid email or username credentials" }, { status: 400 });
    }

    const user = await findUserByEmailOrUsername(identifier);
    // Generic error to prevent email/username enumeration attacks
    if (!user) {
      return NextResponse.json(
        { error: "Invalid account credentials. Please verify your details or sign up." },
        { status: 401 }
      );
    }

    const evidences = await getUserEvidences(user.id);

    const res = NextResponse.json({
      success: true,
      user: {
        ...user,
        preferences: user.preferences ? JSON.parse(user.preferences) : undefined,
        completedEvidences: evidences,
      },
    });

    res.cookies.set("tdbd_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
