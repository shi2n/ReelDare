import { NextRequest, NextResponse } from "next/server";
import { updateBackendUser } from "@/lib/user-backend";
import { profileUpdateSchema, sanitizeString } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`profile:${ip}`, 30, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    const sessionUserId = cookieUserId || headerUserId;

    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const targetUserId = body.userId || sessionUserId;

    // Strict ownership verification: cannot modify another user's profile
    if (targetUserId !== sessionUserId) {
      return NextResponse.json({ error: "Forbidden: Cannot edit another user's profile" }, { status: 403 });
    }

    const parseResult = profileUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid profile data" },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const updates: any = {};

    if (data.username) {
      updates.username = sanitizeString(data.username.toLowerCase().replace(/\s+/g, "_"), 30);
    }
    if (body.email && typeof body.email === "string") {
      updates.email = sanitizeString(body.email.trim().toLowerCase(), 320);
    }
    if (data.socialLink !== undefined) {
      updates.socialLink = sanitizeString(data.socialLink, 300);
    }
    if (data.bio !== undefined) {
      updates.bio = sanitizeString(data.bio, 300);
    }
    if (data.avatar !== undefined) {
      updates.avatar = sanitizeString(data.avatar, 500);
    }
    if (body.preferences !== undefined) {
      updates.preferences = JSON.stringify(body.preferences);
    }

    const updatedUser = await updateBackendUser(sessionUserId, updates);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        preferences: updatedUser.preferences ? JSON.parse(updatedUser.preferences) : undefined,
      },
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
