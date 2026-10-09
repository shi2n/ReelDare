import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; plan?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const plan = typeof body.plan === "string" ? body.plan.slice(0, 30) : "free";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
    }

    const inserted = await db
      .insert(newsletterSubscribers)
      .values({ email, plan })
      .onConflictDoNothing({ target: newsletterSubscribers.email })
      .returning({ id: newsletterSubscribers.id });

    if (inserted.length === 0) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    return NextResponse.json({ ok: true, duplicate: false });
  } catch (err) {
    console.error("newsletter error", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
