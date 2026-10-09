import { NextRequest, NextResponse } from "next/server";
import { and, eq, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { experiences } from "@/db/schema";

export const dynamic = "force-dynamic";

const MOOD_TO_CATEGORY: Record<string, string[]> = {
  fun: ["fun", "travel", "physical"],
  crazy: ["crazy", "weird"],
  growth: ["growth", "money"],
  meaningful: ["family", "spiritual"],
  adventure: ["travel"],
  create: ["create"],
  kindness: ["kindness", "family"],
  bored: ["fun", "weird", "create", "growth"],
};

const TIME_ORDER = ["10min", "30min", "1hour", "3hours", "halfday", "day", "weekend", "multi"];

function buildConditions(sp: URLSearchParams) {
  const conds = [];
  const mood = sp.get("mood");
  const category = sp.get("category");
  const time = sp.get("time");
  const budget = sp.get("budget");
  const energy = sp.get("energy");
  const social = sp.get("social");
  const location = sp.get("location");

  if (category) {
    conds.push(eq(experiences.category, category));
  } else if (mood && MOOD_TO_CATEGORY[mood]) {
    const mapped = MOOD_TO_CATEGORY[mood];
    conds.push(sql`${experiences.category} IN (${sql.join(mapped.map((m) => sql`${m}`), sql`, `)})`);
  }
  if (time && time !== "any" && TIME_ORDER.includes(time)) {
    const idx = TIME_ORDER.indexOf(time);
    const allowed = TIME_ORDER.slice(0, Math.max(idx + 2, 2)); // flexible window
    conds.push(sql`${experiences.time} IN (${sql.join(allowed.map((t) => sql`${t}`), sql`, `)})`);
  }
  if (budget && budget !== "any") {
    const maxBudget = { free: 0, low: 1, mid: 2, high: 3 }[budget] ?? 4;
    conds.push(lte(experiences.budget, maxBudget));
  }
  if (energy && energy !== "any") {
    conds.push(eq(experiences.energy, energy));
  }
  if (social && social !== "any") {
    conds.push(sql`(${experiences.social} = ${social} OR ${experiences.social} = 'any')`);
  }
  if (location && location !== "anywhere") {
    conds.push(sql`(${experiences.location} = ${location} OR ${experiences.location} = 'anywhere')`);
  }
  return conds;
}

function dto(row: typeof experiences.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    mood: row.mood,
    difficulty: row.difficulty,
    budget: row.budget,
    time: row.time,
    energy: row.energy,
    location: row.location,
    social: row.social,
    safety: row.safety,
    reel: row.reel,
    completions: row.completions,
    tags: row.tags,
  };
}

import { RICH_EXPERIENCES } from "@/lib/experiences-catalog";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const category = sp.get("category");
    const mood = sp.get("mood");
    const rawExclude = sp.get("exclude") || "";
    const excludeIds = new Set(
      rawExclude
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n > 0)
    );

    let rows: any[] = [];

    // Try reading from DB if configured
    if (db) {
      try {
        const conds = buildConditions(sp);
        const where = conds.length ? and(...conds) : undefined;
        rows = await db
          .select()
          .from(experiences)
          .where(where)
          .orderBy(sql`RANDOM()`)
          .limit(20);
      } catch {}
    }

    // Convert rows to DTOs and filter out already seen IDs
    let pool = rows.map(dto).filter((exp) => !excludeIds.has(exp.id));

    // If DB is empty or all returned were in excludeIds, draw from RICH_EXPERIENCES
    if (pool.length === 0) {
      pool = RICH_EXPERIENCES.filter((exp) => {
        if (excludeIds.has(exp.id)) return false;
        if (category && category !== "all" && exp.category !== category) return false;
        if (mood && mood !== "any" && exp.mood !== mood) return false;
        return true;
      });
    }

    // If still empty because user spun everything in that category, relax category filter
    if (pool.length === 0) {
      pool = RICH_EXPERIENCES.filter((exp) => !excludeIds.has(exp.id));
    }

    // If user has literally spun every single experience in the entire catalog, reset cycle
    if (pool.length === 0) {
      pool = RICH_EXPERIENCES.filter((exp) => {
        if (category && category !== "all" && exp.category !== category) return false;
        return true;
      });
      if (pool.length === 0) pool = RICH_EXPERIENCES;
    }

    // Pick random non-repeating experience from pool
    const selected = pool[Math.floor(Math.random() * pool.length)];

    return NextResponse.json({ experience: selected });
  } catch (err) {
    console.error("wish error", err);
    // Absolute fallback
    const selected = RICH_EXPERIENCES[Math.floor(Math.random() * RICH_EXPERIENCES.length)];
    return NextResponse.json({ experience: selected });
  }
}
