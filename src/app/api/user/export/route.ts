import { NextRequest, NextResponse } from "next/server";
import { findUserById, getUserEvidences, getUserCustomWishes } from "@/lib/user-backend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`export:${ip}`, 5, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before exporting again." },
        { status: 429 }
      );
    }

    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    const userId = headerUserId || cookieUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [evidences, wishes] = await Promise.all([
      getUserEvidences(user.id),
      getUserCustomWishes(user.id),
    ]);

    const exportData = {
      app: "Reel Dare",
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        socialLink: user.socialLink,
        bio: user.bio,
        xp: user.xp,
        completedTasks: user.completedTasks,
        spinsCount: user.spinsCount,
        createdAt: user.createdAt,
        preferences: user.preferences ? JSON.parse(user.preferences) : null,
      },
      verifiedProofs: evidences.map((e) => ({
        id: e.id,
        expTitle: e.expTitle,
        category: e.category,
        whatYouDid: e.whatYouDid,
        timeSpent: e.timeSpent,
        completedDate: e.completedDate,
        evidenceLink: e.evidenceLink,
        xpEarned: e.xpEarned,
        submittedAt: e.submittedAt,
      })),
      customBucketList: wishes.map((w) => ({
        id: w.id,
        title: w.title,
        category: w.category,
        completed: w.completed,
        createdAt: w.createdAt,
      })),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="reel-dare-user-data-${user.username}.json"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("Data export error:", err);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
