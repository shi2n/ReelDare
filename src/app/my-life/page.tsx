"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import BeforeIDie from "@/components/BeforeIDie";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import {
  Bookmark,
  CheckCircle2,
  Trash2,
  Plus,
  Dices,
  Sparkles,
  Trophy,
  ArrowRight,
  Flame,
  Camera,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/lib/user";

interface CustomItem {
  id: number | string;
  title: string;
  category: string;
  completed: boolean;
}

const DEFAULT_GOALS: CustomItem[] = [
  { id: 1, title: "Watch a sunrise somewhere brand new", category: "Travel", completed: true },
  { id: 2, title: "Pay for a stranger's meal without them knowing", category: "Kindness", completed: true },
  { id: 3, title: "Spend 24 hours in complete silence", category: "Growth", completed: false },
  { id: 4, title: "Take my parents on a dream weekend trip", category: "Family", completed: false },
  { id: 5, title: "Write a letter to my future self 5 years out", category: "Spiritual", completed: false },
];

export default function MyLifePage() {
  const { user, awardXP } = useUser();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [customList, setCustomList] = useState<CustomItem[]>(DEFAULT_GOALS);
  const [newTitle, setNewTitle] = useState("");
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("tdbd-saved") ?? "[]") as number[];
      setSavedIds(Array.isArray(s) ? s : []);
      const d = Number(localStorage.getItem("tdbd-done") ?? "2") || 2;
      setDoneCount(d);
    } catch {}

    // Load backend wishes if logged in
    if (user?.id) {
      fetch("/api/user/wishes", {
        headers: { "x-user-id": user.id },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data?.wishes) && data.wishes.length > 0) {
            setCustomList(
              data.wishes.map((w: any) => ({
                id: w.id,
                title: w.title,
                category: w.category || "Personal",
                completed: Boolean(w.completed),
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const toggleDone = (id: number | string) => {
    const item = customList.find((x) => x.id === id);
    if (item && !item.completed) {
      awardXP(100, `Completed bucket goal: "${item.title}"`);
    }
    setCustomList((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
    if (user?.id && typeof id === "string") {
      fetch("/api/user/wishes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ userId: user.id, wishId: id }),
      }).catch(() => {});
    }
  };

  const removeGoal = (id: number | string) => {
    setCustomList((prev) => prev.filter((item) => item.id !== id));
    if (user?.id && typeof id === "string") {
      fetch(`/api/user/wishes?wishId=${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id },
      }).catch(() => {});
    }
  };

  const addCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    const tempId = "wish-" + Date.now().toString(36);
    const newItem: CustomItem = {
      id: tempId,
      title,
      category: "Personal",
      completed: false,
    };
    setCustomList((prev) => [newItem, ...prev]);
    awardXP(25, `Pinned new wish to My 100: "${title}"`);
    setNewTitle("");

    if (user?.id) {
      fetch("/api/user/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({
          userId: user.id,
          title,
          category: "Personal",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.wish) {
            setCustomList((prev) =>
              prev.map((item) => (item.id === tempId ? { ...item, id: data.wish.id } : item))
            );
          }
        })
        .catch(() => {});
    }
  };

  const completedCount = customList.filter((x) => x.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(customList.length, 1)) * 100);

  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-coal pt-24 pb-20 text-cream">
        {/* Header */}
        <section className="relative overflow-hidden px-4 pt-12 pb-14 sm:px-6 lg:px-10">
          <div className="pointer-events-none absolute top-10 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                <Bookmark className="h-3.5 w-3.5" />
                Personal Archive
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                My Life <span className="text-gold italic">& The 100</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
                Your personal repository of moments. Not a to-do list for work, but a list of things you will be glad
                you did when looking back at your one life.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Life Dashboard Overview */}
        <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="noise grid gap-6 rounded-[2.5rem] border border-white/10 bg-coal-2 p-6 sm:p-10 md:grid-cols-3">
            {/* Counter 1: Progress */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <Trophy className="h-6 w-6" />
              </div>
              <span className="font-display mt-4 text-4xl font-bold text-cream">{completedCount}</span>
              <span className="text-xs font-semibold text-gold tracking-wider uppercase">
                Completed of {customList.length}
              </span>
              <div className="mt-3 h-2 w-full max-w-[140px] overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Counter 2: Saved Wishes */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
                <Bookmark className="h-6 w-6" />
              </div>
              <span className="font-display mt-4 text-4xl font-bold text-cream">{savedIds.length}</span>
              <span className="text-xs font-semibold text-rose-300 tracking-wider uppercase">
                Saved from Wheel
              </span>
              <Link
                href="/spin"
                className="mt-3 text-xs font-bold text-gold transition-colors hover:underline"
              >
                + Spin for more
              </Link>
            </div>

            {/* Counter 3: Stories & Reels */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400">
                <Camera className="h-6 w-6" />
              </div>
              <span className="font-display mt-4 text-4xl font-bold text-cream">2</span>
              <span className="text-xs font-semibold text-purple-300 tracking-wider uppercase">
                Journal Memories
              </span>
            </div>
          </div>
        </section>

        {/* Interactive Custom Bucket List Tracker */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            kicker="Your Personal Bucket List"
            title={
              <>
                The Experiences <span className="text-gold italic">You Swore You'd Do</span>
              </>
            }
            sub="Check off completed items or type a dream experience to pin it to your board."
          />

          {/* Add Item Form */}
          <form onSubmit={addCustomGoal} className="mt-8 flex gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Sleep in a treehouse, learn pasta from scratch..."
              className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-coal transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add Wish
            </button>
          </form>

          {/* Goals List */}
          <div className="mt-6 space-y-3">
            {customList.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                  item.completed
                    ? "border-emerald-500/30 bg-emerald-950/20 text-cream/70"
                    : "border-white/10 bg-white/5 text-cream hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleDone(item.id)}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-colors ${
                      item.completed
                        ? "border-emerald-400 bg-emerald-500 text-coal"
                        : "border-white/30 hover:border-gold"
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="h-4 w-4 text-coal" />}
                  </button>
                  <span
                    className={`text-sm sm:text-base font-medium ${
                      item.completed ? "line-through text-cream/50" : "text-cream"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-cream/60">
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGoal(item.id)}
                    className="p-1.5 text-cream/40 transition-colors hover:text-rose-400"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Before I Die Section embed */}
        <div className="mt-12">
          <BeforeIDie />
        </div>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
