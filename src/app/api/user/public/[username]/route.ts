import { NextRequest, NextResponse } from "next/server";
import { findUserByEmailOrUsername, getUserEvidences, getUserCustomWishes } from "@/lib/user-backend";
import { getRankForXp } from "@/lib/shared";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const user = await findUserByEmailOrUsername(username);
    if (!user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const [evidences, wishes] = await Promise.all([
      getUserEvidences(user.id),
      getUserCustomWishes(user.id),
    ]);

    const rank = getRankForXp(user.xp);

    // Return strictly sanitized public profile data — NO email, NO password hash, NO auth data
    const publicProfile = {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      bio: user.bio || "Living without regrets on Reel Dare.",
      avatar: user.avatar || null,
      accentColor: user.accentColor || "#a855f7",
      socialLink: user.socialLink || "",
      instagram: user.instagram || "",
      xp: user.xp,
      completedTasks: user.completedTasks,
      spinsCount: user.spinsCount,
      rank: {
        level: rank.level,
        name: rank.name,
        badge: rank.badge,
        color: rank.color,
      },
      completedChallengesCount: evidences.length,
      createdAt: user.createdAt,
      recentEvidences: evidences.slice(0, 5).map((e) => ({
        id: e.id,
        expTitle: e.expTitle,
        category: e.category,
        completedDate: e.completedDate,
        xpEarned: e.xpEarned,
      })),
    };

    return NextResponse.json({ profile: publicProfile });
  } catch (err: any) {
    console.error("Public profile API error:", err);
    return NextResponse.json({ error: "Failed to fetch public profile" }, { status: 500 });
  }
}
