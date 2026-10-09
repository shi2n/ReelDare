import { NextRequest, NextResponse } from "next/server";
import {
  getUserCustomWishes,
  addBackendCustomWish,
  toggleBackendCustomWish,
  deleteBackendCustomWish,
} from "@/lib/user-backend";
import { customWishSchema, sanitizeString } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    const spUserId = req.nextUrl.searchParams.get("userId");
    const userId = spUserId || headerUserId || cookieUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishes = await getUserCustomWishes(userId);
    return NextResponse.json({ wishes });
  } catch (err: any) {
    console.error("Get wishes error:", err);
    return NextResponse.json({ error: "Failed to load custom bucket list" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`wishes:${ip}`, 30, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    const sessionUserId = cookieUserId || headerUserId;

    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = customWishSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid wish data" },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const item = await addBackendCustomWish({
      userId: sessionUserId,
      title: sanitizeString(data.title, 200),
      category: sanitizeString(data.category, 50),
    });

    return NextResponse.json({ success: true, wish: item });
  } catch (err: any) {
    console.error("Add wish error:", err);
    return NextResponse.json({ error: "Failed to add goal" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    if (!cookieUserId && !headerUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const wishId = sanitizeString(body.wishId || "", 100);
    if (!wishId) {
      return NextResponse.json({ error: "Wish ID is required" }, { status: 400 });
    }

    const updated = await toggleBackendCustomWish(wishId);
    return NextResponse.json({ success: true, wish: updated });
  } catch (err: any) {
    console.error("Toggle wish error:", err);
    return NextResponse.json({ error: "Failed to update goal status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieUserId = req.cookies.get("tdbd_user_id")?.value;
    const headerUserId = req.headers.get("x-user-id");
    if (!cookieUserId && !headerUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const spWishId = req.nextUrl.searchParams.get("wishId");
    const body = await req.json().catch(() => ({}));
    const rawWishId = spWishId || body.wishId;
    const wishId = sanitizeString(rawWishId || "", 100);

    if (!wishId) {
      return NextResponse.json({ error: "Wish ID is required" }, { status: 400 });
    }

    const success = await deleteBackendCustomWish(wishId);
    return NextResponse.json({ success });
  } catch (err: any) {
    console.error("Delete wish error:", err);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
