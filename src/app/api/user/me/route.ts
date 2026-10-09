import { NextRequest, NextResponse } from "next/server";
import { findUserById, getUserEvidences, getUserCustomWishes } from "@/lib/user-backend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    const userId = headerUserId || cookieUserId;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    const [evidences, wishes] = await Promise.all([
      getUserEvidences(user.id),
      getUserCustomWishes(user.id),
    ]);

    return NextResponse.json({
      user: {
        ...user,
        preferences: user.preferences ? JSON.parse(user.preferences) : undefined,
        completedEvidences: evidences,
        customWishes: wishes,
      },
    });
  } catch (err: any) {
    console.error("Get /api/user/me error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
