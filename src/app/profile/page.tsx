"use client";

import { useEffect, useState, useRef } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import {
  User,
  Mail,
  Camera,
  Upload,
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
  Download,
  Trash2,
  AlertTriangle,
  Share2,
  ExternalLink,
  Flame,
  Award,
  Layers,
  Heart,
  Smile,
  Compass,
  X,
  Palette,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useUser, RANK_TIERS } from "@/lib/user";

// Pre-designed abstract/illustrated avatars users can select if they don't want a custom photo
const DEFAULT_AVATARS = [
  { id: "cosmic-1", name: "Neon Cyber", bg: "from-purple-600 via-pink-600 to-rose-600", emoji: "⚡" },
  { id: "cosmic-2", name: "Solar Flare", bg: "from-amber-500 via-orange-600 to-red-600", emoji: "🔥" },
  { id: "cosmic-3", name: "Acid Lime", bg: "from-emerald-500 via-lime-500 to-teal-500", emoji: "🦖" },
  { id: "cosmic-4", name: "Vapor Wave", bg: "from-cyan-500 via-blue-600 to-indigo-600", emoji: "🌊" },
  { id: "cosmic-5", name: "Shadow Phantom", bg: "from-violet-800 via-purple-900 to-slate-900", emoji: "🥷" },
  { id: "cosmic-6", name: "Cosmic Star", bg: "from-fuchsia-600 via-pink-500 to-amber-400", emoji: "⭐" },
];

const ACCENT_COLORS = [
  { id: "purple", label: "Electric Violet", hex: "#a855f7" },
  { id: "pink", label: "Hot Magenta", hex: "#ec4899" },
  { id: "orange", label: "Fire Orange", hex: "#f97316" },
  { id: "lime", label: "Neon Lime", hex: "#84cc16" },
  { id: "cyan", label: "Cyber Cyan", hex: "#06b6d4" },
  { id: "gold", label: "Championship Gold", hex: "#eab308" },
];

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

  // Tab State: overview | achievements | challenges | my100 | ranks | leaderboard
  const [activeTab, setActiveTab] = useState<
    "overview" | "achievements" | "challenges" | "my100" | "ranks" | "leaderboard"
  >("overview");

  // Edit Profile Modal
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName || user?.username || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [editInstagram, setEditInstagram] = useState(user?.instagram || "");
  const [editAccentColor, setEditAccentColor] = useState(user?.accentColor || "#a855f7");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarError, setAvatarError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Share profile state
  const [shareCopied, setShareCopied] = useState(false);

  // My 100 / Saved Wishes state from localStorage
  const [savedWishes, setSavedWishes] = useState<any[]>([]);

  // Remote leaderboard
  const [remoteLeaderboard, setRemoteLeaderboard] = useState<any[] | null>(null);

  // Account settings
  const [isExportingData, setIsExportingData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state when user updates
  useEffect(() => {
    if (user) {
      setEditDisplayName(user.displayName || user.username);
      setEditBio(user.bio || "");
      // If user had existing social link with instagram, parse handle
      if (user.instagram) {
        setEditInstagram(user.instagram);
      } else if (user.socialLink && user.socialLink.includes("instagram.com")) {
        const parsed = user.socialLink
          .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
          .replace(/\/$/, "");
        setEditInstagram(parsed);
      }
      setEditAccentColor(user.accentColor || "#a855f7");
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  // Load saved challenges and leaderboard
  useEffect(() => {
    try {
      const rawSaved = localStorage.getItem("tdbd-saved-challenges") || "[]";
      const parsedChallenges = JSON.parse(rawSaved);
      if (Array.isArray(parsedChallenges)) {
        setSavedWishes(parsedChallenges);
      }
    } catch {}

    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.leaderboard) && data.leaderboard.length > 0) {
          setRemoteLeaderboard(data.leaderboard);
        }
      })
      .catch(() => {});
  }, []);

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 3MB for browser data URL)
    if (file.size > 3 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 3MB.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSelectDefaultAvatar = (avatarEmoji: string, bgGradient: string) => {
    // Generate SVG / styled avatar as base64 or identifier
    const svgAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%237c3aed"/><stop offset="100%" stop-color="%23db2777"/></linearGradient></defs><rect width="200" height="200" rx="40" fill="url(%23g)"/><text x="100" y="125" font-size="72" text-anchor="middle">${encodeURIComponent(avatarEmoji)}</text></svg>`;
    setAvatarPreview(svgAvatar);
  };

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setAvatarError("");
    setSaveSuccessMsg("");

    // Normalize Instagram handle: remove spaces and leading @
    const cleanInstagram = editInstagram.trim().replace(/^@+/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");

    // Validate Instagram username format (alphanumeric, dots, underscores, max 30 chars)
    if (cleanInstagram && !/^[a-zA-Z0-9._]{1,30}$/.test(cleanInstagram)) {
      setAvatarError("Invalid Instagram username format. Use only letters, numbers, dots, and underscores.");
      setIsSaving(false);
      return;
    }

    const generatedSocialLink = cleanInstagram
      ? `https://www.instagram.com/${cleanInstagram}/`
      : user?.socialLink || "";

    const updates = {
      displayName: editDisplayName.trim() || user?.username,
      bio: editBio.trim(),
      instagram: cleanInstagram,
      socialLink: generatedSocialLink,
      avatar: avatarPreview || "",
      accentColor: editAccentColor,
    };

    try {
      updateProfile(updates);
      setSaveSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccessMsg("");
      }, 1000);
    } catch (err: any) {
      setAvatarError(err?.message || "Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Share profile
  const handleShareProfile = () => {
    if (!user || typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/p/${encodeURIComponent(user.username)}`;
    if (navigator.share) {
      navigator.share({
        title: `${user.displayName || user.username}'s Reel Dare Profile`,
        text: `Check out @${user.username}'s dares, XP, and rank on Reel Dare!`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  // Export User Data
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

  // Delete Account
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

  if (!isReady) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-[#0b0d14]" aria-busy="true" />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <CustomCursor />
        <Nav />
        <main className="flex min-h-screen items-center justify-center bg-[#0b0d14] px-4 pt-20 text-slate-100">
          <div className="text-center max-w-md mx-auto">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 border border-purple-500/30">
              <Trophy className="h-10 w-10 text-purple-400 animate-pulse" />
            </div>
            <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-white">
              No Profile Found
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign up or log in to create your personal Reel Dare identity card, track challenges, earn XP, and rank globally.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:brightness-110"
              >
                Create Profile & Claim 150 XP
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Instagram profile link generation
  const activeInstagramHandle = user.instagram
    ? user.instagram.replace(/^@/, "")
    : user.socialLink?.includes("instagram.com")
    ? user.socialLink.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")
    : null;

  const instagramHref = activeInstagramHandle
    ? `https://www.instagram.com/${activeInstagramHandle}/`
    : null;

  // Real Leaderboard computation
  const leaderboard = (remoteLeaderboard || getLeaderboard()).map((entry) => ({
    ...entry,
    isCurrentUser:
      entry.isCurrentUser ||
      (user && entry.username.toLowerCase() === user.username.toLowerCase()),
  }));
  const userLeaderboardIndex = leaderboard.findIndex((item) => item.isCurrentUser) + 1;

  // Dynamic achievement badges calculation based on real user actions
  const achievementsList = [
    {
      id: "first_dare",
      title: "First Blood",
      description: "Completed your first live dare or challenge.",
      badge: "⚔️",
      unlocked: user.completedTasks >= 1,
      xpRequirement: "1 completed task",
    },
    {
      id: "comfort_zone",
      title: "Comfort Zone Shattered",
      description: "Completed 5 dares and embraced the thrill.",
      badge: "💥",
      unlocked: user.completedTasks >= 5,
      xpRequirement: "5 completed tasks",
    },
    {
      id: "wheel_spinner",
      title: "Fate Roller",
      description: "Spun the life roulette wheel 10 times.",
      badge: "🎲",
      unlocked: user.spinsCount >= 10,
      xpRequirement: "10 wheel spins",
    },
    {
      id: "xp_hunter",
      title: "XP Vanguard",
      description: "Accumulated over 1,000 lifetime dare XP.",
      badge: "⚡",
      unlocked: user.xp >= 1000,
      xpRequirement: "1,000 XP reached",
    },
    {
      id: "shame_slayer",
      title: "Fearless Spirit",
      description: "Submitted proof for an awkward or public dare.",
      badge: "🦁",
      unlocked: (user.completedEvidences?.length ?? 0) >= 1,
      xpRequirement: "1 verified proof submission",
    },
    {
      id: "master_explorer",
      title: "Living Legend",
      description: "Reached 2,500 XP and unlocked high rank perks.",
      badge: "👑",
      unlocked: user.xp >= 2500,
      xpRequirement: "2,500 XP reached",
    },
  ];

  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-[#0b0d14] pt-24 pb-20 text-slate-100 selection:bg-purple-500 selection:text-white">
        {/* Dynamic Glow Aura */}
        <div
          className="pointer-events-none fixed top-12 left-1/2 h-[450px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
          style={{ backgroundColor: user.accentColor || "#a855f7" }}
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          {/* ============================================================== */}
          {/* PROFILE IDENTITY CARD (HEADER) */}
          {/* ============================================================== */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#121522]/90 p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            {/* Top Identity Gradient Accent Line */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, ${user.accentColor || "#a855f7"}, #ec4899, #06b6d4, #84cc16)`,
              }}
            />

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              {/* Left Column: Avatar & Personal Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {/* Avatar with Custom Ring & Level Pill */}
                <div className="relative group">
                  <div
                    className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center overflow-hidden rounded-3xl border-2 p-1 shadow-2xl transition-all duration-300 group-hover:scale-105"
                    style={{ borderColor: user.accentColor || currentRank.color }}
                  >
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-full w-full rounded-[1.35rem] object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-3xl font-black text-white">
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Level Pill */}
                  <div
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-2 flex items-center gap-1 rounded-full px-3 py-0.5 text-[11px] font-black text-slate-950 shadow-xl"
                    style={{ backgroundColor: currentRank.color }}
                  >
                    <span>Lvl {currentRank.level}</span>
                  </div>
                </div>

                {/* Identity Information */}
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {user.displayName || user.username}
                    </h1>
                    <span className="text-xs font-semibold text-slate-400">
                      @{user.username}
                    </span>
                    <span
                      className="rounded-full px-3 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-sm"
                      style={{
                        backgroundColor: `${currentRank.color}20`,
                        color: currentRank.color,
                        border: `1px solid ${currentRank.color}40`,
                      }}
                    >
                      {currentRank.badge} {currentRank.name}
                    </span>
                  </div>

                  {/* Instagram Username Link */}
                  {instagramHref && activeInstagramHandle ? (
                    <div className="mt-2 flex items-center justify-center sm:justify-start">
                      <a
                        href={instagramHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-300 transition-all hover:border-pink-400 hover:bg-pink-500/20"
                      >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>@{activeInstagramHandle}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </div>
                  ) : null}

                  {/* Bio */}
                  <p className="mt-3 max-w-lg text-sm text-slate-300 italic">
                    "{user.bio || "Live more. Regret nothing."}"
                  </p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={handleShareProfile}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 transition-all hover:border-purple-400 hover:bg-purple-500/10 shadow-sm"
                >
                  <Share2 className="h-3.5 w-3.5 text-purple-400" />
                  {shareCopied ? "Link Copied!" : "Share Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-[0_8px_20px_rgba(168,85,247,0.35)] transition-all hover:brightness-110"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-400 transition-colors hover:border-rose-500/40 hover:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* LEVEL & XP PROGRESSION BAR */}
            {/* ============================================================== */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-extrabold tracking-wider text-amber-400 uppercase">
                      Current XP
                    </span>
                    <span className="font-display text-2xl font-black text-white">
                      {user.xp.toLocaleString()} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {nextRank
                      ? `${(nextRank.minXp - user.xp).toLocaleString()} XP needed to unlock ${nextRank.name}`
                      : "Max rank reached! You are an eternal legend."}
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Leaderboard Standing
                  </span>
                  <p className="font-display text-lg font-black text-purple-300">
                    #{userLeaderboardIndex || 1} Global
                  </p>
                </div>
              </div>

              {/* Segmented Neon Progress Bar */}
              <div className="mt-4 h-3.5 w-full overflow-hidden rounded-full bg-slate-900 border border-white/10 p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  style={{
                    width: `${Math.max(5, xpProgressPercent)}%`,
                    background: `linear-gradient(90deg, ${currentRank.color}, #a855f7, #ec4899)`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-500">
                <span>{currentRank.minXp} XP ({currentRank.name})</span>
                <span>{nextRank ? `${nextRank.minXp} XP (${nextRank.name})` : "MAX"}</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PROFILE NAVIGATION TABS */}
          {/* ============================================================== */}
          <div className="mt-8 flex justify-center overflow-x-auto pb-2 scrollbar-none">
            <div className="flex gap-2 rounded-2xl border border-white/10 bg-[#121522]/80 p-1.5 backdrop-blur-xl">
              {[
                { id: "overview", label: "Overview", icon: Layers },
                { id: "achievements", label: "Achievements", icon: Award },
                {
                  id: "challenges",
                  label: `Completed (${user.completedEvidences?.length ?? user.completedTasks})`,
                  icon: ShieldCheck,
                },
                { id: "my100", label: `My 100 (${savedWishes.length})`, icon: Bookmark },
                { id: "ranks", label: "Rank Tiers", icon: Trophy },
                { id: "leaderboard", label: "Leaderboard", icon: Users },
              ].map((tab) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      active
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: OVERVIEW */}
          {/* ============================================================== */}
          {activeTab === "overview" && (
            <div className="mt-8 space-y-8">
              {/* Gamified Achievement Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Tasks Completed */}
                <div className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-b from-[#181c2e] to-[#121522] p-6 shadow-lg transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Tasks Completed
                  </h4>
                  <p className="font-display mt-1 text-3xl font-black text-white">
                    {user.completedTasks}
                  </p>
                  <p className="mt-1 text-xs font-bold text-emerald-400">
                    +{user.completedTasks * 100} XP Earned
                  </p>
                </div>

                {/* 2. Wheel Spins */}
                <div className="group relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#181c2e] to-[#121522] p-6 shadow-lg transition-all duration-300 hover:border-cyan-500/50 hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
                    <Dices className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Wheel Spins
                  </h4>
                  <p className="font-display mt-1 text-3xl font-black text-white">
                    {user.spinsCount}
                  </p>
                  <Link
                    href="/spin"
                    className="mt-1 text-xs font-bold text-cyan-400 hover:underline block"
                  >
                    + Spin the wheel →
                  </Link>
                </div>

                {/* 3. Rank Status */}
                <div className="group relative overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-b from-[#181c2e] to-[#121522] p-6 shadow-lg transition-all duration-300 hover:border-pink-500/50 hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Current Level
                  </h4>
                  <p className="font-display mt-1 text-3xl font-black text-white">
                    Level {currentRank.level}
                  </p>
                  <p className="mt-1 text-xs font-bold text-pink-300">
                    {currentRank.name}
                  </p>
                </div>

                {/* 4. My 100 */}
                <div className="group relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#181c2e] to-[#121522] p-6 shadow-lg transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                    <Bookmark className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    My 100 Bucket List
                  </h4>
                  <p className="font-display mt-1 text-3xl font-black text-white">
                    {savedWishes.length} Saved
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("my100")}
                    className="mt-1 text-xs font-bold text-amber-400 hover:underline block text-left"
                  >
                    View your wishlist →
                  </button>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="rounded-3xl border border-white/10 bg-[#121522] p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Recent Activity
                    </h3>
                    <p className="text-xs text-slate-400">
                      Your journey, submissions, and XP milestones.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {user.completedEvidences && user.completedEvidences.length > 0 ? (
                    user.completedEvidences.slice(0, 5).map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                            <ShieldCheck className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white">{ev.expTitle}</p>
                            <p className="text-xs text-slate-400">
                              Completed {ev.completedDate} · Category: {ev.category}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-400">
                          +{ev.xpEarned} XP
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                      <p className="text-sm text-slate-400">
                        No dares completed yet. Roll the wheel or enter the Shameful/Public Acts arenas to complete your first dare!
                      </p>
                      <div className="mt-4 flex justify-center gap-3">
                        <Link
                          href="/spin"
                          className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500"
                        >
                          Spin the Wheel
                        </Link>
                        <Link
                          href="/categories/shameful-acts"
                          className="rounded-xl border border-purple-500/30 bg-purple-950/40 px-5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-900/50"
                        >
                          Shameful Acts Arena
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Export & Account Settings Accordion */}
              <div className="rounded-3xl border border-white/10 bg-[#121522] p-6 sm:p-8">
                <h4 className="font-display text-base font-bold text-white">
                  Account Management & Privacy
                </h4>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExportData}
                    disabled={isExportingData}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:border-white/30"
                  >
                    <Download className="h-4 w-4" />
                    {isExportingData ? "Preparing Export..." : "Export My Data (JSON)"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>

                {showDeleteConfirm && (
                  <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-bold text-rose-300">
                          Confirm Account Deletion
                        </h5>
                        <p className="mt-1 text-xs text-rose-200/80">
                          This will permanently delete your account, earned XP, proof submissions, and progress. This action cannot be undone.
                        </p>
                        <div className="mt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={isDeletingAccount}
                            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                          >
                            {isDeletingAccount ? "Deleting..." : "Yes, Delete Permanently"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ACHIEVEMENTS */}
          {/* ============================================================== */}
          {activeTab === "achievements" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#121522] p-6 sm:p-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-bold text-white">
                  Collector Badges & Milestones
                </h3>
                <p className="text-xs text-slate-400">
                  Earn verifiable badges as you tackle dares and level up your life.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievementsList.map((ach) => (
                  <div
                    key={ach.id}
                    className={`relative overflow-hidden rounded-3xl border p-5 transition-all ${
                      ach.unlocked
                        ? "border-purple-500/40 bg-gradient-to-br from-purple-950/40 to-[#181c2e] shadow-lg shadow-purple-900/20"
                        : "border-white/5 bg-white/[0.02] opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{ach.badge}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          ach.unlocked
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {ach.unlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>

                    <h4 className="mt-4 text-base font-bold text-white">{ach.title}</h4>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      {ach.description}
                    </p>
                    <div className="mt-4 text-[10px] font-semibold text-slate-400">
                      Req: {ach.xpRequirement}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: COMPLETED CHALLENGES & PROOF */}
          {/* ============================================================== */}
          {activeTab === "challenges" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#121522] p-6 sm:p-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-bold text-white">
                  Verified Proof Submissions
                </h3>
                <p className="text-xs text-slate-400">
                  Record of your completed challenges, notes, and proofs.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {user.completedEvidences && user.completedEvidences.length > 0 ? (
                  user.completedEvidences.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-black text-purple-300 uppercase">
                            {ev.category}
                          </span>
                          <h4 className="font-display mt-2 text-lg font-bold text-white">
                            {ev.expTitle}
                          </h4>
                          <p className="text-xs text-slate-400">
                            Completed: {ev.completedDate} · Time Spent: {ev.timeSpent}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-400 w-fit">
                          +{ev.xpEarned} XP Awarded
                        </span>
                      </div>

                      {ev.whatYouDid && (
                        <p className="mt-3 text-xs text-slate-300 bg-black/30 p-3 rounded-xl border border-white/5">
                          "{ev.whatYouDid}"
                        </p>
                      )}

                      {ev.evidenceLink && (
                        <div className="mt-3">
                          <a
                            href={ev.evidenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" /> View Submitted Proof Link
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-sm text-slate-400">
                      No proofs submitted yet. Submit proof upon completing any dare from the wheel or arena to earn full bonus XP!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: MY 100 SAVED DARES */}
          {/* ============================================================== */}
          {activeTab === "my100" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#121522] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    My 100 Wishlist & Saved Dares
                  </h3>
                  <p className="text-xs text-slate-400">
                    Challenges you saved for later from the wheel and arena.
                  </p>
                </div>
                <Link
                  href="/my-life"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
                >
                  Manage Full Bucket List →
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {savedWishes.length > 0 ? (
                  savedWishes.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-purple-400">
                          {item.category || "Dare"}
                        </span>
                        <h5 className="text-sm font-bold text-white mt-1">
                          {item.title}
                        </h5>
                      </div>
                      <Link
                        href="/spin"
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-xs font-bold text-slate-300 hover:text-white"
                        title="Spin wheel for this"
                      >
                        <Dices className="h-4 w-4" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="sm:col-span-2 p-8 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-sm text-slate-400">
                      You haven't saved any dares yet. Hit "Save for later" on any dare in the wheel or arena to collect your personal 100!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: ALL RANK TIERS */}
          {/* ============================================================== */}
          {activeTab === "ranks" && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {RANK_TIERS.map((tier) => {
                const isCurrent = tier.level === currentRank.level;
                return (
                  <div
                    key={tier.level}
                    className={`rounded-3xl border p-6 transition-all ${
                      isCurrent
                        ? "border-purple-500 bg-gradient-to-b from-purple-950/40 to-[#121522] shadow-xl shadow-purple-900/30 ring-1 ring-purple-400"
                        : "border-white/10 bg-[#121522]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{tier.badge}</span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950"
                        style={{ backgroundColor: tier.color }}
                      >
                        Lvl {tier.level}
                      </span>
                    </div>

                    <h4 className="font-display mt-4 text-xl font-bold text-white">
                      {tier.name}
                    </h4>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {tier.minXp.toLocaleString()} - {tier.maxXp.toLocaleString()} XP
                    </p>

                    <div className="mt-4 rounded-2xl bg-white/5 p-3 text-xs text-slate-300">
                      <span className="font-bold text-purple-400">Perk: </span>
                      {tier.perk}
                    </div>

                    {isCurrent && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-400">
                        <CheckCircle2 className="h-4 w-4" /> Current Rank
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: GLOBAL LEADERBOARD */}
          {/* ============================================================== */}
          {activeTab === "leaderboard" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#121522] p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-bold text-white">
                  Global Hall of Living
                </h3>
                <span className="text-xs text-slate-400">Top Explorers Worldwide</span>
              </div>

              <div className="mt-4 divide-y divide-white/5">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.username}
                    className={`flex items-center justify-between py-4 px-3 rounded-2xl transition-colors ${
                      entry.isCurrentUser
                        ? "bg-purple-900/20 border border-purple-500/40"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                          entry.rank === 1
                            ? "bg-amber-400 text-slate-950"
                            : entry.rank === 2
                            ? "bg-slate-300 text-slate-950"
                            : entry.rank === 3
                            ? "bg-amber-700 text-white"
                            : "bg-white/10 text-slate-400"
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
                          <span className="text-sm font-bold text-white">@{entry.username}</span>
                          {entry.isCurrentUser && (
                            <span className="rounded-full bg-purple-500 px-2 py-0.2 text-[10px] font-black text-white uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        {entry.socialLink && (
                          <a
                            href={entry.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-slate-400 hover:text-purple-400"
                          >
                            {entry.socialLink.replace(/^https?:\/\/(www\.)?/, "")}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-base font-bold text-amber-400">
                        {entry.xp.toLocaleString()} XP
                      </span>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">
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

      {/* ============================================================== */}
      {/* EDIT PROFILE MODAL */}
      {/* ============================================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div
            className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-[#121522] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-display text-xl font-bold text-white">
              Edit Your Profile Identity
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Customize your public persona, avatar, and Instagram link.
            </p>

            {avatarError && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {avatarError}
              </div>
            )}

            {saveSuccessMsg && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                {saveSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
              {/* Profile Photo Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Profile Picture
                </label>
                <div className="mt-3 flex items-center gap-5">
                  <div
                    className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 p-1"
                    style={{ borderColor: editAccentColor }}
                  >
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-purple-900/60 text-2xl font-black text-white">
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-sm"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload Image
                      </button>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Upload any PNG, JPG, or WEBP up to 3MB.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Pre-made Default Avatars */}
                <div className="mt-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or choose an illustrated avatar:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DEFAULT_AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => handleSelectDefaultAvatar(av.emoji, av.bg)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg hover:border-purple-400 hover:scale-105 transition-all"
                        title={av.name}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="e.g. Alex Hunter"
                  className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Instagram Username Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Instagram Username
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-slate-500">
                    @
                  </span>
                  <input
                    type="text"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    placeholder="yourusername (e.g. shaizan)"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pr-4 pl-9 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                {editInstagram.trim() && (
                  <p className="mt-1.5 text-[11px] text-purple-400">
                    Preview Link: https://www.instagram.com/{editInstagram.trim().replace(/^@+/, "")}/
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Bio / Life Motto
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell the community what fuels you..."
                  className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/5 p-3.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Accent Color Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Profile Accent Theme
                </label>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {ACCENT_COLORS.map((col) => {
                    const isSelected = editAccentColor === col.hex;
                    return (
                      <button
                        type="button"
                        key={col.id}
                        onClick={() => setEditAccentColor(col.hex)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                          isSelected ? "ring-2 ring-white scale-110" : "opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.label}
                      >
                        {isSelected && <Check className="h-4 w-4 text-black" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:brightness-110 disabled:opacity-50 shadow-lg shadow-purple-600/30"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <StickyCTA />
    </>
  );
}
