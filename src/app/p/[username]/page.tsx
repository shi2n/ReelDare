"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { useParams } from "next/navigation";
import {
  Trophy,
  Zap,
  Sparkles,
  Dices,
  Bookmark,
  Share2,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Flame,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function PublicProfilePage() {
  const params = useParams();
  const rawUsername = params?.username as string;
  const username = decodeURIComponent(rawUsername || "");

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/user/public/${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (data?.profile) setProfile(data.profile);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${profile?.displayName || username}'s Reel Dare Profile`,
        text: `Check out @${profile?.username || username}'s dares, XP, and rank on Reel Dare!`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const instagramUrl = profile?.instagram
    ? `https://www.instagram.com/${profile.instagram.replace(/^@/, "")}/`
    : profile?.socialLink?.includes("instagram.com")
    ? profile.socialLink
    : null;

  const instagramHandle = profile?.instagram
    ? profile.instagram.replace(/^@/, "")
    : profile?.socialLink?.includes("instagram.com")
    ? profile.socialLink.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")
    : null;

  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-[#0d0f17] pt-28 pb-24 text-slate-100 selection:bg-purple-500 selection:text-white">
        {/* Glow ambient */}
        <div
          className="pointer-events-none fixed top-16 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-25 blur-[140px]"
          style={{ backgroundColor: profile?.accentColor || "#a855f7" }}
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          {loading ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
            </div>
          ) : error || !profile ? (
            <div className="my-20 rounded-3xl border border-white/10 bg-[#141724] p-10 text-center">
              <Trophy className="mx-auto h-12 w-12 text-slate-500" />
              <h2 className="mt-4 text-2xl font-bold">Explorer Not Found</h2>
              <p className="mt-2 text-sm text-slate-400">
                The profile @{username} doesn't exist or hasn't been created yet.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/"
                  className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-500"
                >
                  Explore Reel Dare
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Identity Card */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#141724]/90 p-7 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                {/* Accent top ribbon */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${profile.accentColor || "#a855f7"}, #ec4899, #06b6d4)`,
                  }}
                />

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                    {/* Avatar */}
                    <div className="relative group">
                      <div
                        className="h-28 w-28 overflow-hidden rounded-3xl border-2 p-1 transition-all duration-300"
                        style={{ borderColor: profile.rank?.color || "#a855f7" }}
                      >
                        {profile.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profile.avatar}
                            alt={profile.username}
                            className="h-full w-full rounded-[1.25rem] object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-purple-700 to-indigo-900 text-3xl font-black text-white">
                            {profile.username.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div
                        className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black text-black shadow-lg"
                        style={{ backgroundColor: profile.rank?.color || "#eab308" }}
                      >
                        Lvl {profile.rank?.level || 1}
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                          {profile.displayName || profile.username}
                        </h1>
                        <span
                          className="rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider"
                          style={{
                            backgroundColor: `${profile.rank?.color}25`,
                            color: profile.rank?.color,
                            border: `1px solid ${profile.rank?.color}40`,
                          }}
                        >
                          {profile.rank?.badge} {profile.rank?.name}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        @{profile.username}
                      </p>

                      {instagramUrl && (
                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-300 transition-colors hover:border-pink-400 hover:text-pink-200"
                        >
                          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          @{instagramHandle}
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      )}

                      <p className="mt-3 max-w-md text-xs sm:text-sm text-slate-300 italic">
                        "{profile.bio}"
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center sm:justify-end">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-white transition-all hover:border-purple-400 hover:bg-purple-500/20 shadow-sm"
                    >
                      <Share2 className="h-4 w-4 text-purple-400" />
                      {copied ? "Link Copied!" : "Share Profile"}
                    </button>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/10 pt-6">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Total XP
                    </span>
                    <p className="font-display mt-1 text-2xl font-black text-amber-400">
                      {profile.xp?.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Completed Tasks
                    </span>
                    <p className="font-display mt-1 text-2xl font-black text-emerald-400">
                      {profile.completedTasks}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Wheel Spins
                    </span>
                    <p className="font-display mt-1 text-2xl font-black text-cyan-400">
                      {profile.spinsCount}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center sm:text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Proof Submissions
                    </span>
                    <p className="font-display mt-1 text-2xl font-black text-purple-400">
                      {profile.completedChallengesCount || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Submissions / Milestones */}
              {profile.recentEvidences && profile.recentEvidences.length > 0 && (
                <div className="mt-8 rounded-3xl border border-white/10 bg-[#141724]/80 p-6 sm:p-8 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      Verified Dares & Completed Quests
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">
                      {profile.recentEvidences.length} verified
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {profile.recentEvidences.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                      >
                        <div>
                          <p className="text-sm font-bold text-white">{item.expTitle}</p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            Completed on {item.completedDate} · Category: {item.category}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-emerald-400">
                          +{item.xpEarned} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action for visitors */}
              <div className="mt-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-coal p-7 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-display text-xl font-extrabold text-white">
                    Ready to spin and take your own dares?
                  </h4>
                  <p className="mt-1 text-xs text-slate-300">
                    Join Reel Dare. 2,000+ real-life dares, Shameful Acts, Public Acts, and XP rewards.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex shrink-0 justify-center">
                  <Link
                    href="/spin"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-xs font-black text-white hover:brightness-110 shadow-lg"
                  >
                    Spin the Wheel <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
