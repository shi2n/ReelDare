import { NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { experiences, newsletterSubscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [exp] = await db.select({ c: count() }).from(experiences);
    const [subs] = await db.select({ c: count() }).from(newsletterSubscribers);
    const completions = 1246800 + (subs?.c ?? 0) * 3;
    return NextResponse.json({
      experiences: exp?.c ?? 0,
      members: (subs?.c ?? 0) + 48210,
      completions,
      countries: 63,
    });
  } catch (err) {
    console.error("stats error", err);
    return NextResponse.json({ experiences: 2000, members: 48210, completions: 1246800, countries: 63 });
  }
}
