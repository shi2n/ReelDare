import { NextRequest, NextResponse } from "next/server";
import { getBackendLeaderboard } from "@/lib/user-backend";
import { getRankForXp, COMMUNITY_LEADERBOARD } from "@/lib/shared";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const rawUsers = await getBackendLeaderboard(50);

    // Map backend users to leaderboard format
    const dbUsers = rawUsers.map((u) => {
      const rankTier = getRankForXp(u.xp);
      return {
        id: u.id,
        username: u.username,
        socialLink: u.socialLink,
        avatar: u.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
        xp: u.xp,
        level: rankTier.level,
        rankName: rankTier.name,
        completedTasks: u.completedTasks,
      };
    });

    // Merge with baseline community accounts (avoiding duplicate usernames)
    const existingUsernames = new Set(dbUsers.map((u) => u.username.toLowerCase()));
    const baseline = COMMUNITY_LEADERBOARD.filter(
      (c) => !existingUsernames.has(c.username.toLowerCase())
    ).map((c, i) => ({
      id: "baseline-" + i,
      username: c.username,
      socialLink: c.socialLink,
      avatar: c.avatar,
      xp: c.xp,
      level: c.level,
      rankName: c.rankName,
      completedTasks: c.completedTasks,
    }));

    const combined = [...dbUsers, ...baseline];
    combined.sort((a, b) => b.xp - a.xp);

    const ranked = combined.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json({ leaderboard: ranked });
  } catch (err: any) {
    console.error("Leaderboard API error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
