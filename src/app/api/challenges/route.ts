import { NextRequest, NextResponse } from "next/server";
import {
  getRandomChallenge,
  getChallengesByCategory,
  getCategoryStats,
  getChallengeById,
} from "@/lib/challenges";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const id = sp.get("id");

    if (id) {
      const task = getChallengeById(id);
      if (!task) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
      }
      return NextResponse.json({ challenge: task });
    }

    const rawCat = sp.get("category");
    const category =
      rawCat === "public_acts" ? "public_acts" : "shameful_acts";

    // Stats request
    if (sp.get("stats") === "true") {
      const stats = getCategoryStats(category);
      return NextResponse.json({
        category,
        stats,
      });
    }

    // Spin request
    const isSpin = sp.get("spin") === "true";
    const rawExclude = sp.get("exclude") || "";
    const excludeIds = rawExclude
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const filters = {
      difficulty: sp.get("difficulty") || undefined,
      location: sp.get("location") || undefined,
      duration: sp.get("duration") || undefined,
      minReelPotential: sp.get("minReel") ? Number(sp.get("minReel")) : undefined,
      maxEmbarrassment: sp.get("maxEmbarrassment") ? Number(sp.get("maxEmbarrassment")) : undefined,
    };

    if (isSpin) {
      const result = getRandomChallenge(category, excludeIds, filters);
      return NextResponse.json(result);
    }

    // Paginated list
    const page = Math.max(1, Number(sp.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(sp.get("limit") || 20)));
    const all = getChallengesByCategory(category);

    const filtered = all.filter((task) => {
      if (filters.difficulty && filters.difficulty !== "all") {
        if (task.difficulty.toLowerCase() !== filters.difficulty.toLowerCase()) return false;
      }
      if (filters.location && filters.location !== "all") {
        if (task.location.toLowerCase() !== filters.location.toLowerCase()) return false;
      }
      return true;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const challenges = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      category,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      challenges,
    });
  } catch (err: any) {
    console.error("Challenges API error:", err);
    return NextResponse.json({ error: "Failed to retrieve challenges" }, { status: 500 });
  }
}
