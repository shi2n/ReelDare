import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { experiences } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
    const rows = await db
      .select({
        id: experiences.id,
        title: experiences.title,
        category: experiences.category,
        difficulty: experiences.difficulty,
        time: experiences.time,
        budget: experiences.budget,
        completions: experiences.completions,
        trending: experiences.trending,
      })
      .from(experiences)
      .orderBy(desc(experiences.completions))
      .limit(200);

    let filtered = rows;
    if (q) {
      const terms = q.split(/\s+/);
      const synonym: Record<string, string[]> = {
        fun: ["fun", "crazy", "weird"],
        cheap: ["free", "low"],
        free: ["free"],
        scary: ["crazy", "uncomfortable", "scary"],
        friends: ["friends", "together", "social"],
        romantic: ["partner", "love", "date"],
        parents: ["parents", "family", "mother", "father"],
        film: ["reel", "film", "video", "captur", "content"],
        today: ["10min", "30min", "1hour"],
        weird: ["weird", "random", "ridiculous"],
        adventure: ["travel", "adventure", "trip"],
        creative: ["create", "make", "paint", "write"],
      };
      const expanded = new Set<string>();
      for (const t of terms) {
        expanded.add(t);
        for (const [k, vals] of Object.entries(synonym)) {
          if (k.startsWith(t) || t.startsWith(k)) vals.forEach((v) => expanded.add(v));
        }
        if (synonym[t]) synonym[t].forEach((v) => expanded.add(v));
      }
      filtered = rows.filter((r) => {
        const hay = `${r.title} ${r.category}`.toLowerCase();
        let score = 0;
        expanded.forEach((t) => {
          if (hay.includes(t)) score += t.length;
        });
        return score > 0;
      });
    }

    return NextResponse.json({ experiences: filtered.slice(0, 6) });
  } catch (err) {
    console.error("trending error", err);
    return NextResponse.json({ experiences: [] }, { status: 200 });
  }
}
