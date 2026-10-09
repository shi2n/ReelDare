import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { experiences } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dayKey = new Date().toISOString().slice(0, 10);
    const rows = await db
      .select()
      .from(experiences)
      .orderBy(sql`md5(${experiences.id}::text || ${dayKey})`)
      .limit(1);
    if (rows.length === 0) return NextResponse.json({ experience: null });
    return NextResponse.json({ experience: rows[0] });
  } catch (err) {
    console.error("daily error", err);
    return NextResponse.json({ experience: null });
  }
}
