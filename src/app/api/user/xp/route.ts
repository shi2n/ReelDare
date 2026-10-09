import { NextRequest, NextResponse } from "next/server";
import { findUserById, updateBackendUser } from "@/lib/user-backend";
import { awardXpSchema, sanitizeString } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`xp:${ip}`, 30, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    const body = await req.json();

    // Enforce authentication: cannot manipulate another user's XP
    const authUserId = cookieUserId || headerUserId;
    const targetUserId = body.userId || authUserId;

    if (!authUserId || (body.userId && body.userId !== authUserId)) {
      return NextResponse.json({ error: "Unauthorized: Cannot award XP to another account" }, { status: 403 });
    }

    const parseResult = awardXpSchema.safeParse({
      xpEarned: Number(body.amount),
      reason: body.reason,
      taskTitle: body.taskTitle,
      expId: body.expId ? Number(body.expId) : undefined,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid XP payload" },
        { status: 400 }
      );
    }

    const { xpEarned, reason } = parseResult.data;
    const isSpin = Boolean(body.isSpin);

    const user = await findUserById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newXp = Math.min(1000000, Math.max(0, user.xp + xpEarned));
    const completedTasks = isSpin ? user.completedTasks : user.completedTasks + 1;
    const spinsCount = isSpin ? user.spinsCount + 1 : user.spinsCount;

    const updated = await updateBackendUser(targetUserId, {
      xp: newXp,
      completedTasks,
      spinsCount,
    });

    return NextResponse.json({
      success: true,
      user: updated,
      awarded: xpEarned,
      reason: sanitizeString(reason || "Challenge reward", 100),
    });
  } catch (err: any) {
    console.error("Award XP error:", err);
    return NextResponse.json({ error: "Failed to update XP" }, { status: 500 });
  }
}
