import { NextRequest, NextResponse } from "next/server";
import {
  getAllUsersAdmin,
  getAllEvidencesAdmin,
  getAllWishesAdmin,
  updateBackendUser,
  deleteBackendUser,
} from "@/lib/user-backend";
import { adminUserUpdateSchema, sanitizeString } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [users, evidences, wishes] = await Promise.all([
      getAllUsersAdmin(),
      getAllEvidencesAdmin(),
      getAllWishesAdmin(),
    ]);

    const totalXP = users.reduce((sum, u) => sum + (u.xp || 0), 0);
    const totalCompletedTasks = users.reduce((sum, u) => sum + (u.completedTasks || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalXP,
        totalCompletedTasks,
        totalEvidences: evidences.length,
        totalWishes: wishes.length,
      },
      users,
      evidences,
      wishes,
    });
  } catch (err: any) {
    console.error("Admin GET users error:", err);
    return NextResponse.json({ error: "Failed to retrieve users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = adminUserUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid update payload" },
        { status: 400 }
      );
    }

    const { userId, ...updates } = parseResult.data;
    const sanitizedUpdates: any = {};

    if (updates.username) sanitizedUpdates.username = sanitizeString(updates.username.toLowerCase(), 30);
    if (updates.email) sanitizedUpdates.email = sanitizeString(updates.email.toLowerCase(), 320);
    if (updates.bio !== undefined) sanitizedUpdates.bio = sanitizeString(updates.bio, 300);
    if (updates.socialLink !== undefined) sanitizedUpdates.socialLink = sanitizeString(updates.socialLink, 300);
    if (updates.xp !== undefined) sanitizedUpdates.xp = updates.xp;
    if (updates.completedTasks !== undefined) sanitizedUpdates.completedTasks = updates.completedTasks;

    const updated = await updateBackendUser(userId, sanitizedUpdates);
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error("Admin PATCH user error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const spUserId = req.nextUrl.searchParams.get("userId");
    const body = await req.json().catch(() => ({}));
    const rawUserId = spUserId || body.userId;
    const userId = sanitizeString(rawUserId || "", 100);

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const success = await deleteBackendUser(userId);
    return NextResponse.json({ success });
  } catch (err: any) {
    console.error("Admin DELETE user error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
