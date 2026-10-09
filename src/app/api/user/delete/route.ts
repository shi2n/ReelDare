import { NextRequest, NextResponse } from "next/server";
import { findUserById, deleteBackendUser } from "@/lib/user-backend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`delete-user:${ip}`, 3, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again shortly." },
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

    // Permanently remove user and cascade delete evidence and wishes
    await deleteBackendUser(userId);

    const response = NextResponse.json({
      success: true,
      message: "Account and all associated records permanently removed.",
    });

    // Clear session cookies
    response.cookies.delete("tdbd_user_id");
    response.cookies.delete("tdbd_session");

    return response;
  } catch (err: any) {
    console.error("Account deletion error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
