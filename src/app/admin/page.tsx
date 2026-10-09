"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  CheckCircle,
  FileText,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
  Save,
  Shield,
  ArrowLeft,
  Sparkles,
  Camera,
  Heart,
  TrendingUp,
} from "lucide-react";
import { getRankForXp } from "@/lib/shared";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  socialLink: string;
  bio: string;
  avatar?: string;
  xp: number;
  completedTasks: number;
  spinsCount: number;
  preferences?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminEvidence {
  id: string;
  userId: string;
  expId: number;
  expTitle: string;
  category: string;
  whatYouDid: string;
  timeSpent: string;
  completedDate: string;
  evidenceLink: string;
  xpEarned: number;
  submittedAt: string;
}

interface AdminWish {
  id: string;
  userId: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalXP: number;
  totalCompletedTasks: number;
  totalEvidences: number;
  totalWishes: number;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [evidences, setEvidences] = useState<AdminEvidence[]>([]);
  const [wishes, setWishes] = useState<AdminWish[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "evidences" | "wishes">("users");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data?.success) {
        setStats(data.stats);
        setUsers(data.users || []);
        setEvidences(data.evidences || []);
        setWishes(data.wishes || []);
      } else {
        showToast("Could not load data from backend", "error");
      }
    } catch {
      showToast("Network error connecting to local server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          username: editingUser.username,
          email: editingUser.email,
          xp: Number(editingUser.xp),
          completedTasks: Number(editingUser.completedTasks),
          socialLink: editingUser.socialLink,
          bio: editingUser.bio,
        }),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        showToast(`User @${editingUser.username} updated successfully!`);
        setEditingUser(null);
        loadData();
      } else {
        showToast(data?.error || "Failed to update user", "error");
      }
    } catch {
      showToast("Failed to connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user @${username}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        showToast(`User @${username} deleted`);
        loadData();
      } else {
        showToast(data?.error || "Failed to delete user", "error");
      }
    } catch {
      showToast("Failed to connect to server", "error");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  const filteredEvidences = evidences.filter((ev) => {
    const q = search.toLowerCase();
    return (
      ev.expTitle.toLowerCase().includes(q) ||
      ev.whatYouDid.toLowerCase().includes(q) ||
      ev.userId.toLowerCase().includes(q)
    );
  });

  const filteredWishes = wishes.filter((w) => {
    const q = search.toLowerCase();
    return (
      w.title.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.userId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-coal text-cream font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] rounded-2xl px-5 py-3 text-sm font-bold shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-emerald-500 text-coal border border-emerald-300"
              : "bg-rose-600 text-white border border-rose-400"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-coal/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cream/70 hover:bg-gold hover:text-coal transition-colors"
              title="Return to Website"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 items-center rounded-md bg-gold/20 px-2 text-[10px] font-black text-gold uppercase tracking-wider">
                  Admin Panel
                </span>
                <span className="text-xs text-cream/40">Local & Cloud Database</span>
              </div>
              <h1 className="font-display text-lg font-bold text-cream">
                Reel Dare — Data Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-cream/80 hover:bg-white/10 hover:text-cream transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-xs font-black text-coal hover:brightness-110 transition-all shadow-md"
            >
              View Site Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-cream/40">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="h-4 w-4 text-gold" />
            </div>
            <p className="font-display mt-3 text-3xl font-bold text-cream">
              {stats?.totalUsers ?? users.length}
            </p>
            <p className="mt-1 text-[11px] text-cream/50">Registered explorers</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-cream/40">
              <span className="text-xs font-bold uppercase tracking-wider">Total XP</span>
              <Award className="h-4 w-4 text-gold" />
            </div>
            <p className="font-display mt-3 text-3xl font-bold text-gold">
              {stats?.totalXP?.toLocaleString("en-IN") ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-cream/50">Experience awarded</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-cream/40">
              <span className="text-xs font-bold uppercase tracking-wider">Tasks Done</span>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-display mt-3 text-3xl font-bold text-cream">
              {stats?.totalCompletedTasks ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-cream/50">Wishes completed</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-cream/40">
              <span className="text-xs font-bold uppercase tracking-wider">Proof Items</span>
              <Camera className="h-4 w-4 text-purple-400" />
            </div>
            <p className="font-display mt-3 text-3xl font-bold text-cream">
              {stats?.totalEvidences ?? evidences.length}
            </p>
            <p className="mt-1 text-[11px] text-cream/50">Photos/Videos verified</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-cream/40">
              <span className="text-xs font-bold uppercase tracking-wider">Pinned Goals</span>
              <Heart className="h-4 w-4 text-rose-400" />
            </div>
            <p className="font-display mt-3 text-3xl font-bold text-cream">
              {stats?.totalWishes ?? wishes.length}
            </p>
            <p className="mt-1 text-[11px] text-cream/50">My 100 bucket goals</p>
          </div>
        </div>

        {/* Tab Selection & Search */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "users"
                  ? "bg-gold text-coal shadow-lg shadow-gold/20"
                  : "bg-white/5 text-cream/60 hover:text-cream hover:bg-white/10"
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("evidences")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "evidences"
                  ? "bg-gold text-coal shadow-lg shadow-gold/20"
                  : "bg-white/5 text-cream/60 hover:text-cream hover:bg-white/10"
              }`}
            >
              Verified Proofs ({evidences.length})
            </button>
            <button
              onClick={() => setActiveTab("wishes")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "wishes"
                  ? "bg-gold text-coal shadow-lg shadow-gold/20"
                  : "bg-white/5 text-cream/60 hover:text-cream hover:bg-white/10"
              }`}
            >
              Custom Goals ({wishes.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/40" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-cream placeholder-cream/30 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* TAB 1: USERS LIST */}
        {activeTab === "users" && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-coal-2 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/5 text-cream/50 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Rank & Tier</th>
                    <th className="py-4 px-6">XP Points</th>
                    <th className="py-4 px-6">Completed</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-cream/80">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-cream/40">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const rank = getRankForXp(u.xp);
                      return (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <span
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-black shrink-0"
                                style={{ backgroundColor: `${rank.color}30`, color: rank.color }}
                              >
                                {rank.badge}
                              </span>
                              <div>
                                <p className="font-bold text-cream">@{u.username}</p>
                                {u.socialLink && (
                                  <a
                                    href={u.socialLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-gold hover:underline inline-flex items-center gap-0.5"
                                  >
                                    Social Link <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-mono text-cream/70 text-[11px]">{u.email}</td>
                          <td className="py-4 px-6">
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                              style={{
                                backgroundColor: `${rank.color}20`,
                                color: rank.color,
                                border: `1px solid ${rank.color}40`,
                              }}
                            >
                              {rank.name} (Lvl {rank.level})
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-gold">⚡ {u.xp} XP</td>
                          <td className="py-4 px-6 text-cream/70">
                            {u.completedTasks} {u.completedTasks === 1 ? "task" : "tasks"}
                          </td>
                          <td className="py-4 px-6 text-cream/40 text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingUser(u)}
                                className="rounded-lg bg-gold/15 p-2 text-gold hover:bg-gold hover:text-coal transition-all"
                                title="Edit User"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.username)}
                                className="rounded-lg bg-rose-500/15 p-2 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                                title="Delete User"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFIED PROOFS */}
        {activeTab === "evidences" && (
          <div className="mt-6 space-y-4">
            {filteredEvidences.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-coal-2 p-12 text-center text-cream/40">
                No proof submissions found. When users verify challenges on the wheel, their video/photo links appear here.
              </div>
            ) : (
              filteredEvidences.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-3xl border border-white/10 bg-coal-2 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gold/15 border border-gold/40 px-2.5 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">
                        +{ev.xpEarned} XP Awarded
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-cream/60 uppercase">
                        {ev.category}
                      </span>
                      <span className="text-[11px] text-cream/40">
                        Completed on {ev.completedDate} · Time: {ev.timeSpent}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-cream">{ev.expTitle}</h3>

                    <p className="text-xs text-cream/80 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-gold">What was done: </span>
                      {ev.whatYouDid}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <a
                      href={ev.evidenceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-black text-coal hover:brightness-110 transition-all shadow-md"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Video/Photo Proof
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM WISHES (MY 100) */}
        {activeTab === "wishes" && (
          <div className="mt-6 space-y-3">
            {filteredWishes.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-coal-2 p-12 text-center text-cream/40">
                No custom goals found. Wishes pinned by users in the "My Life" dashboard will appear here.
              </div>
            ) : (
              filteredWishes.map((w) => (
                <div
                  key={w.id}
                  className="rounded-2xl border border-white/10 bg-coal-2 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-lg border ${
                        w.completed
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : "border-cream/20 bg-white/5 text-cream/30"
                      }`}
                    >
                      {w.completed && <CheckCircle className="h-3.5 w-3.5" />}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${w.completed ? "line-through text-cream/50" : "text-cream"}`}>
                        {w.title}
                      </p>
                      <p className="text-[10px] text-cream/40">
                        Category: {w.category} · User: {w.userId}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      w.completed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/10 text-cream/50"
                    }`}
                  >
                    {w.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-gold/40 bg-coal-2 p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 text-cream/40 hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-cream">Edit User Profile</h3>
                <p className="text-xs text-cream/50 font-mono">ID: {editingUser.id}</p>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-cream/70 uppercase">Username</label>
                  <input
                    type="text"
                    required
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-cream/70 uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gold uppercase">XP Points</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingUser.xp}
                    onChange={(e) => setEditingUser({ ...editingUser, xp: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-gold/40 bg-gold/10 p-2.5 text-gold font-bold focus:border-gold focus:outline-none"
                  />
                  <span className="text-[10px] text-gold/70 mt-0.5 block">
                    Rank: {getRankForXp(editingUser.xp).name} (Lvl {getRankForXp(editingUser.xp).level})
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-cream/70 uppercase">Tasks Completed</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingUser.completedTasks}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, completedTasks: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-cream/70 uppercase">Social Profile Link</label>
                <input
                  type="text"
                  value={editingUser.socialLink}
                  onChange={(e) => setEditingUser({ ...editingUser, socialLink: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-cream/70 uppercase">Bio / Motto</label>
                <textarea
                  rows={2}
                  value={editingUser.bio}
                  onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 font-semibold text-cream/60 hover:text-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 font-black text-coal hover:brightness-110 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
