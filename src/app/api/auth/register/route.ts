import { NextRequest, NextResponse } from "next/server";
import { findUserByEmailOrUsername, createBackendUser } from "@/lib/user-backend";
import { registerSchema, sanitizeString } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`register:${ip}`, 5, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please wait a moment." },
        { status: 429 }
      );
    }

    const raw = await req.json();

    // Validate using Zod schema
    const validationResult = registerSchema.safeParse({
      email: raw.email,
      username: raw.username,
      password: raw.password || "DefaultExplorer2026!",
      socialLink: raw.socialLink || "",
      bio: raw.bio || "Live more. Regret nothing.",
    });

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const data = validationResult.data;
    const cleanUsername = sanitizeString(data.username.toLowerCase(), 30);
    const cleanEmail = sanitizeString(data.email.toLowerCase(), 320);
    const cleanBio = sanitizeString(data.bio || "Live more. Regret nothing.", 300);
    const cleanSocial = sanitizeString(data.socialLink || "", 300);

    // Check duplicate
    const existingEmail = await findUserByEmailOrUsername(cleanEmail);
    if (existingEmail) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    const existingName = await findUserByEmailOrUsername(cleanUsername);
    if (existingName) {
      return NextResponse.json({ error: "This username is already taken" }, { status: 409 });
    }

    const newUser = await createBackendUser({
      username: cleanUsername,
      email: cleanEmail,
      socialLink: cleanSocial,
      bio: cleanBio,
      preferences: raw.preferences,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        ...newUser,
        preferences: newUser.preferences ? JSON.parse(newUser.preferences) : undefined,
        completedEvidences: [],
      },
    });

    // Set secure auth cookie
    res.cookies.set("tdbd_user_id", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
  }
}
