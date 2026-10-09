"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import {
  User,
  Mail,
  Link as LinkIcon,
  ExternalLink,
  Trophy,
  Zap,
  Sparkles,
  ShieldCheck,
  Edit3,
  Dices,
  Bookmark,
  CheckCircle2,
  LogOut,
  ArrowRight,
  Star,
  Users,
  Camera,
  Download,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useUser, RANK_TIERS } from "@/lib/user";

export default function ProfilePage() {
  const {
    user,
    isLoggedIn,
    isReady,
    currentRank,
    nextRank,
    xpProgressPercent,
    updateProfile,
    logout,
    getLeaderboard,
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editSocial, setEditSocial] = useState(user?.socialLink || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "ranks" | "leaderboard">("overview");
  const [remoteLeaderboard, setRemoteLeaderboard] = useState<any[] | null>(null);
  const [isExportingData, setIsExportingData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleExportData = async () => {
    setIsExportingData(true);
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) throw new Error("Failed to export data");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reel-dare-data-${user?.username || "export"}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Unable to export data: " + (err?.message || "Unknown error"));
    } finally {
      setIsExportingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const res = await fetch("/api/user/delete", { method: "POST" });
      if (!res.ok) throw new Error("Failed to delete account");
      await logout();
      window.location.href = "/";
    } catch (err: any) {
      alert("Could not delete account: " + (err?.message || "Unknown error"));
      setIsDeletingAccount(false);
    }
  };

  useEffect(() => {
    if (user) {
      setEditUsername(user.username);
      setEditEmail(user.email);
      setEditSocial(user.socialLink);
      setEditBio(user.bio || "");
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.leaderboard) && data.leaderboard.length > 0) {
          setRemoteLeaderboard(data.leaderboard);
        }
      })
      .catch(() => {});
  }, []);

  if (!isReady) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-coal" aria-busy="true" />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <CustomCursor />
        <Nav />
        <main className="flex min-h-screen items-center justify-center bg-coal px-4 pt-20 text-cream">
          <div className="text-center">
            <Trophy className="mx-auto h-16 w-16 text-gold animate-pulse" />
            <h1 className="font-display mt-6 text-3xl font-semibold sm:text-4xl">
              No Profile Found
            </h1>
            <p className="mt-3 text-sm text-cream/70 sm:text-base">
              Create a free explorer profile to begin tracking tasks, earning XP, and climbing ranks.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-gold px-7 py-3.5 text-sm font-bold text-coal"
              >
                Create Profile & Claim XP
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      username: editUsername.trim(),
      email: editEmail.trim(),
      socialLink: editSocial.trim(),
      bio: editBio.trim(),
    });
    setIsEditing(false);
  };

  const leaderboard = (remoteLeaderboard || getLeaderboard()).map((entry) => ({
    ...entry,
    isCurrentUser: entry.isCurrentUser || (user && entry.username.toLowerCase() === user.username.toLowerCase()),
  }));
  const userLeaderboardIndex = leaderboard.findIndex((item) => item.isCurrentUser) + 1;

  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-coal pt-24 pb-20 text-cream">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute top-10 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          {/* Profile Header Card */}
          <div className="noise relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-coal-2 p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              {/* Left Column: Avatar & Basic Info */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar with Level Badge */}
                <div className="relative">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-3xl border-2 shadow-xl sm:h-28 sm:w-28 text-3xl font-black text-cream"
                    style={{
                      borderColor: currentRank.color,
                      backgroundColor: `${currentRank.color}20`,
                    }}
                  >
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-full w-full rounded-3xl object-cover"
                      />
                    ) : (
                      <span>{user.username.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-black shadow-lg"
                    style={{ backgroundColor: currentRank.color, color: "#211d19" }}
                  >
                    <span>Lvl {currentRank.level}</span>
                  </div>
                </div>

                {/* User Text Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-display text-2xl font-bold sm:text-3xl">
                      @{user.username}
                    </h1>
                    <span
                      className="rounded-full px-3 py-0.5 text-xs font-extrabold uppercase"
                      style={{
                        backgroundColor: `${currentRank.color}25`,
                        color: currentRank.color,
                        border: `1px solid ${currentRank.color}40`,
                      }}
                    >
                      {currentRank.badge} {currentRank.name}
                    </span>
                  </div>

                  <p className="mt-1.5 flex items-center gap-2 text-xs text-cream/60">
                    <Mail className="h-3.5 w-3.5 text-gold" />
                    <span>{user.email}</span>
                  </p>

                  {user.socialLink && (
                    <a
                      href={user.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-gold transition-colors hover:underline"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>{user.socialLink.replace(/^https?:\/\/(www\.)?/, "")}</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  )}

                  <p className="mt-3 max-w-lg text-sm text-cream/70 italic">
                    "{user.bio || "Collecting life experiences before I leave this earth."}"
                  </p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditUsername(user.username);
                    setEditEmail(user.email);
                    setEditSocial(user.socialLink);
                    setEditBio(user.bio || "");
                    setIsEditing(!isEditing);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  {isEditing ? "Close Editor" : "Edit Profile"}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-cream/40 transition-colors hover:border-rose-500/40 hover:text-rose-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Profile Edit Inline Form */}
            {isEditing && (
              <form
                onSubmit={handleSaveProfile}
                className="mt-8 rounded-2xl border border-gold/30 bg-coal p-6 transition-all"
              >
                <h3 className="font-display text-lg font-semibold text-cream">
                  Update Profile Details
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-cream/60 uppercase">Username</label>
                    <input
                      type="text"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cream/60 uppercase">Email</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-cream/60 uppercase">
                      Social Media Link (Instagram, Twitter/X, TikTok, etc.)
                    </label>
                    <input
                      type="text"
                      required
                      value={editSocial}
                      onChange={(e) => setEditSocial(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-cream/60 uppercase">Bio / Life Motto</label>
                    <input
                      type="text"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-cream/60 hover:text-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gold px-5 py-2 text-xs font-black text-coal transition-all hover:brightness-110"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* XP Progress Bar Section */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-wider text-gold uppercase">
                      Current XP
                    </span>
                    <span className="font-display text-2xl font-bold text-cream">
                      {user.xp.toLocaleString()} XP
                    </span>
                  </div>
                  <p className="text-xs text-cream/60">
                    {nextRank
                      ? `${(nextRank.minXp - user.xp).toLocaleString()} XP needed to reach ${nextRank.name}`
                      : "Maximum rank achieved! You are a Living Legend."}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-cream/40 uppercase">Global Rank</span>
                  <p className="font-display text-xl font-bold text-gold">
                    #{userLeaderboardIndex} of {leaderboard.length} Explorers
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-3.5 w-full overflow-hidden rounded-full bg-white/10 p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${xpProgressPercent}%`,
                    backgroundColor: currentRank.color,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[11px] font-semibold text-cream/40">
                <span>{currentRank.minXp} XP ({currentRank.name})</span>
                <span>{nextRank ? `${nextRank.minXp} XP (${nextRank.name})` : "MAX"}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-10 flex justify-center border-b border-white/10 pb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                  activeTab === "overview"
                    ? "bg-gold text-coal"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                Overview & Preferences
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("evidence" as any)}
                className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                  (activeTab as string) === "evidence"
                    ? "bg-gold text-coal"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                Verified Proof & Challenges ({user.completedEvidences?.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ranks")}
                className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                  activeTab === "ranks"
                    ? "bg-gold text-coal"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                All Rank Tiers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("leaderboard")}
                className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                  activeTab === "leaderboard"
                    ? "bg-gold text-coal"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                Global Leaderboard
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="mt-8 space-y-8">
              {/* Quick Stats Grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-coal-2 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-xs font-bold tracking-wider text-cream/40 uppercase">
                    Tasks Completed
                  </h4>
                  <p className="font-display mt-1 text-3xl font-bold text-cream">
                    {user.completedTasks}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-400 font-semibold">
                    +{user.completedTasks * 100} XP Earned
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-coal-2 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
                    <Dices className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-xs font-bold tracking-wider text-cream/40 uppercase">
                    Wheel Spins
                  </h4>
                  <p className="font-display mt-1 text-3xl font-bold text-cream">
                    {user.spinsCount}
                  </p>
                  <Link
                    href="/spin"
                    className="mt-1 text-[11px] text-gold font-bold hover:underline block"
                  >
                    + Spin again for wishes
                  </Link>
                </div>

                <div className="rounded-3xl border border-white/10 bg-coal-2 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-xs font-bold tracking-wider text-cream/40 uppercase">
                    Rank Status
                  </h4>
                  <p className="font-display mt-1 text-2xl font-bold text-cream">
                    Level {currentRank.level}
                  </p>
                  <p className="mt-1 text-[11px] text-cream/60 font-semibold">
                    {currentRank.name}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-coal-2 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-xs font-bold tracking-wider text-cream/40 uppercase">
                    Bucket List
                  </h4>
                  <p className="font-display mt-1 text-3xl font-bold text-cream">
                    My 100
                  </p>
                  <Link
                    href="/my-life"
                    className="mt-1 text-[11px] text-gold font-bold hover:underline block"
                  >
                    Manage list & regrets →
                  </Link>
                </div>
              </div>

              {/* Lifestyle & Questionnaire Preferences Card */}
              {user.preferences && (
                <div className="rounded-3xl border border-white/10 bg-coal-2 p-7">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-display text-base font-bold text-cream">
                          Your Onboarding Lifestyle Preferences
                        </h4>
                        <p className="text-xs text-cream/50">Used to personalize your wheel results</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold text-gold uppercase">
                      Personalized
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-[10px] font-bold tracking-wider text-cream/40 uppercase">Excited By</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {user.preferences.activities?.map((act) => (
                          <span key={act} className="rounded-lg bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold">
                            {act}
                          </span>
                        )) ?? <span className="text-xs text-cream/60">All Activities</span>}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-[10px] font-bold tracking-wider text-cream/40 uppercase">Typical Budget</p>
                      <p className="mt-2 text-xs font-bold text-cream">{user.preferences.budget || "Flexible"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-[10px] font-bold tracking-wider text-cream/40 uppercase">Time Available</p>
                      <p className="mt-2 text-xs font-bold text-cream">{user.preferences.time || "1 - 3 hours"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-[10px] font-bold tracking-wider text-cream/40 uppercase">Comfort Zone</p>
                      <p className="mt-2 text-xs font-bold text-cream">{user.preferences.comfortLevel || "Mild Thrill"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Earn More XP Banner */}
              <div className="rounded-3xl border border-gold/30 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-gold uppercase">
                      Level Up Strategy
                    </span>
                    <h3 className="font-display mt-2 text-2xl font-semibold text-cream">
                      How to Earn XP in Reel Dare
                    </h3>
                    <p className="mt-2 text-sm text-cream/70 max-w-xl">
                      Complete any wish from the Spin Circle with verified proof (+120 XP), check off an item on your My Life list (+100 XP),
                      or share a memory on the community wall (+150 XP).
                    </p>
                  </div>
                  <Link
                    href="/spin"
                    className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gold px-7 py-3.5 text-sm font-bold text-coal transition-all hover:brightness-110"
                  >
                    <Dices className="h-4 w-4" /> Spin Circle Now
                  </Link>
                </div>
              </div>

              {/* Privacy & Account Rights Card */}
              <div className="rounded-3xl border border-white/10 bg-coal-2 p-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <h3 className="font-display text-lg font-bold text-cream">
                      Data Privacy & Account Controls
                    </h3>
                    <p className="mt-1 text-xs text-cream/60">
                      You own your data. Download a complete JSON export of your profile, verified proofs, and bucket list, or permanently erase your account.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleExportData}
                      disabled={isExportingData}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-cream transition-all hover:bg-white/10 hover:border-gold/30 disabled:opacity-50"
                    >
                      <Download className="h-4 w-4 text-gold" />
                      {isExportingData ? "Preparing Export..." : "Download My Data (JSON)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 transition-all hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-4 w-4 text-rose-400" />
                      Delete Account
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-cream/40">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Compliant with GDPR & Digital Personal Data Protection (DPDP) Act. All data is protected with Row Level Security.</span>
                </div>
              </div>

              {/* Delete Account Confirmation Modal */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                  <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-coal-2 p-6 shadow-2xl">
                    <div className="flex items-center gap-3 text-rose-400">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <h4 className="font-display text-lg font-bold text-cream">
                        Permanently Delete Account?
                      </h4>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-cream/70">
                      This action <strong className="text-rose-400 font-bold">cannot be undone</strong>. All your completed tasks, verified challenge proof links, bucket list wishes, earned XP, and explorer profile will be permanently wiped from the database.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeletingAccount}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-cream/80 hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                      >
                        {isDeletingAccount ? "Deleting..." : "Yes, Purge My Data"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verified Evidence & Completed Wishes Tab */}
          {activeTab === "evidence" && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-cream">
                    Verified Challenge Evidence
                  </h3>
                  <p className="text-xs text-cream/60">
                    Real proof submitted by you. Every completed challenge is backed by authentic details.
                  </p>
                </div>
                <Link
                  href="/spin"
                  className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-coal hover:brightness-110"
                >
                  + Spin for new challenge
                </Link>
              </div>

              {!user.completedEvidences || user.completedEvidences.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-coal-2 p-12 text-center">
                  <Camera className="mx-auto h-12 w-12 text-gold/40" />
                  <h4 className="font-display mt-4 text-lg font-bold text-cream">
                    No Verified Proof Submitted Yet
                  </h4>
                  <p className="mx-auto mt-2 max-w-md text-xs text-cream/60">
                    When you spin the circle and complete a challenge, click "Submit Proof to Complete".
                    Provide what you did, time taken, and a link to your photo/video/reel to claim your +120 XP.
                  </p>
                  <Link
                    href="/spin"
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gold px-6 py-3 text-xs font-black text-coal shadow-md"
                  >
                    <Dices className="h-4 w-4" /> Go to Spin Circle
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.completedEvidences.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-3xl border border-emerald-500/30 bg-coal-2 p-6 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-black text-emerald-400 uppercase">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified · +{ev.xpEarned} XP
                        </span>
                        <span className="text-[11px] text-cream/40">{ev.completedDate}</span>
                      </div>

                      <h4 className="font-display mt-4 text-lg font-bold text-cream">
                        {ev.expTitle}
                      </h4>
                      <p className="mt-2 text-xs text-cream/80 italic leading-relaxed">
                        "{ev.whatYouDid}"
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px]">
                        <span className="text-cream/50">
                          ⏱️ Time: <strong className="text-cream">{ev.timeSpent}</strong>
                        </span>
                        {ev.evidenceLink && (
                          <a
                            href={ev.evidenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-gold hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Proof Link
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ranks Tab */}
          {activeTab === "ranks" && (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {RANK_TIERS.map((tier) => {
                const isCurrent = tier.level === currentRank.level;
                const isCompleted = user.xp >= tier.maxXp;
                return (
                  <div
                    key={tier.level}
                    className={`rounded-3xl border p-6 transition-all ${
                      isCurrent
                        ? "border-gold bg-gold/10 shadow-[0_10px_30px_rgba(212,168,67,0.15)]"
                        : "border-white/10 bg-coal-2"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{tier.badge}</span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase"
                        style={{ backgroundColor: tier.color, color: "#211d19" }}
                      >
                        Lvl {tier.level}
                      </span>
                    </div>

                    <h4 className="font-display mt-4 text-xl font-bold text-cream">
                      {tier.name}
                    </h4>

                    <p className="mt-1 text-xs font-semibold text-cream/50">
                      {tier.minXp.toLocaleString()} - {tier.maxXp.toLocaleString()} XP
                    </p>

                    <div className="mt-4 rounded-2xl bg-white/5 p-3 text-xs text-cream/80">
                      <span className="font-bold text-gold">Perk: </span>
                      {tier.perk}
                    </div>

                    {isCurrent && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-gold">
                        <CheckCircle2 className="h-4 w-4" /> Your Current Rank
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-coal-2 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-semibold text-cream">
                  Global Hall of Living
                </h3>
                <span className="text-xs text-cream/50">Top Explorers worldwide</span>
              </div>

              <div className="mt-4 divide-y divide-white/5">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.username}
                    className={`flex items-center justify-between py-4 px-3 rounded-2xl transition-colors ${
                      entry.isCurrentUser ? "bg-gold/10 border border-gold/30" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                          entry.rank === 1
                            ? "bg-amber-400 text-coal"
                            : entry.rank === 2
                            ? "bg-slate-300 text-coal"
                            : entry.rank === 3
                            ? "bg-amber-700 text-cream"
                            : "bg-white/10 text-cream/60"
                        }`}
                      >
                        {entry.rank}
                      </span>

                      {/* Avatar */}
                      <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={entry.avatar} alt={entry.username} className="h-full w-full object-cover" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-cream">@{entry.username}</span>
                          {entry.isCurrentUser && (
                            <span className="rounded-full bg-gold px-2 py-0.2 text-[10px] font-black text-coal uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        {entry.socialLink && (
                          <a
                            href={entry.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-cream/40 hover:text-gold"
                          >
                            {entry.socialLink.replace(/^https?:\/\/(www\.)?/, "")}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-base font-bold text-gold">
                        {entry.xp.toLocaleString()} XP
                      </span>
                      <p className="text-[10px] font-semibold text-cream/40 uppercase">
                        {entry.rankName} (Lvl {entry.level})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
