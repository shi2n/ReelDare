"use client";

import { useEffect, useState } from "react";
import { Bookmark, Flame, Heart, Loader2, MapPin, Search, Sparkles, Zap } from "lucide-react";
import { categoryMeta } from "@/lib/shared";
import { Reveal, SectionHeading } from "@/components/ui/primitives";

interface TrendingItem {
  id: number;
  title: string;
  category: string;
  difficulty: number;
  time: string;
  budget: number;
  completions: number;
}

const MEMORIES = [
  {
    img: "https://images.pexels.com/photos/34207481/pexels-photo-34207481.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    name: "Aarav",
    place: "Grand Teton trail, solo at 5 AM",
    exp: "Hiked a mountain alone",
    note: "My legs filed complaints. My brain sent a thank-you letter.",
    likes: 214,
  },
  {
    img: "https://images.pexels.com/photos/8902226/pexels-photo-8902226.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    name: "Meera",
    place: "Her own kitchen, Pune",
    exp: "Cooked 10 dishes from 10 countries",
    note: "Week 3 of the 30-day cooking challenge. Nobody has complained. Loudly.",
    likes: 167,
  },
  {
    img: "https://images.pexels.com/photos/2990835/pexels-photo-2990835.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    name: "Dinesh",
    place: "First concert, front row, Delhi",
    exp: "Saw a live show completely sober",
    note: "Turns out the music was always loud enough.",
    likes: 298,
  },
  {
    img: "https://images.pexels.com/photos/30271173/pexels-photo-30271173.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    name: "Sara",
    place: "Sunset hill, Ooty",
    exp: "Watched a sunset and did absolutely nothing",
    note: "Day 18 of the always-rushing recovery program. Highly recommend.",
    likes: 143,
  },
];

export default function Community() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [liked, setLiked] = useState<Record<number, number>>({});
  const [savedM, setSavedM] = useState<Record<number, boolean>>({});

  const load = (q?: string) => {
    setLoading(true);
    fetch(q ? `/api/trending?q=${encodeURIComponent(q)}` : "/api/trending")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.experiences) setTrending(d.experiences);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(!!query.trim());
    load(query.trim() || undefined);
  };

  return (
    <section id="community" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          kicker="The community"
          title={
            <>
              What are people doing <span className="text-gold-deep italic">right now?</span>
            </>
          }
          sub="No follower counts, no popularity contests. Just proof, from real humans, that the library works."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-14">
          {/* trending + search */}
          <Reveal>
            <form onSubmit={onSearch} className="relative">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "something cheap" or "with friends"'
                aria-label="Search experiences"
                className="w-full rounded-2xl border border-ink/10 bg-white py-3.5 pr-24 pl-11 text-sm font-semibold text-ink placeholder:text-ink/35 focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl bg-coal px-4 py-2 text-xs font-black tracking-wide text-cream uppercase transition-colors hover:bg-ink"
              >
                Search
              </button>
            </form>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["something fun", "something cheap", "something scary", "something weird"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    setSearched(true);
                    load(s);
                  }}
                  className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-ink/50 transition-colors hover:text-gold-deep"
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="mt-6 mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-ink/50 uppercase">
              <Flame className="h-4 w-4 text-gold-deep" aria-hidden />
              {searched ? "Best matches" : "People are doing this"}
            </p>
            <div className="space-y-2">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/60 p-3.5" aria-hidden>
                      <Loader2 className="h-4 w-4 animate-spin text-gold-deep" />
                      <div className="h-3 flex-1 animate-pulse rounded bg-ink/10" />
                    </div>
                  ))
                : trending.map((t, i) => {
                    const meta = categoryMeta(t.category);
                    return (
                      <a
                        key={t.id}
                        href="#spin"
                        onClick={() =>
                          window.dispatchEvent(new CustomEvent("tdbd-preset", { detail: { mood: "any" } }))
                        }
                        className="group flex items-center gap-4 rounded-2xl border border-transparent bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_14px_30px_rgba(33,29,25,0.08)]"
                      >
                        <span className="font-display w-8 text-2xl font-semibold text-gold-deep">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-ink transition-colors group-hover:text-gold-deep">
                            {t.title}
                          </span>
                          <span className="mt-0.5 flex items-center gap-2 text-[11px] font-bold text-ink/45">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                            {t.completions.toLocaleString("en-IN")} people did this
                          </span>
                        </span>
                        <Zap className="h-4 w-4 shrink-0 text-ink/25 transition-colors group-hover:text-gold" aria-hidden />
                      </a>
                    );
                  })}
              {!loading && trending.length === 0 && (
                <p className="rounded-2xl bg-white p-4 text-sm font-semibold text-ink/50">
                  Nothing matched that — but the library is huge. Try "adventure", "free" or "weird".
                </p>
              )}
            </div>
          </Reveal>

          {/* memory cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {MEMORIES.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.07} className={i % 2 === 1 ? "sm:translate-y-8" : ""}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(33,29,25,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(33,29,25,0.12)]">
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.img}
                      alt={`${m.name} — ${m.exp}`}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-coal/80 px-3 py-1.5 text-[11px] font-bold text-cream backdrop-blur-sm">
                      <MapPin className="h-3 w-3 text-gold" aria-hidden />
                      {m.place}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-black tracking-[0.16em] text-gold-deep uppercase">
                      {m.name} · {m.exp}
                    </p>
                    <p className="font-display mt-2 text-lg leading-snug font-medium text-ink italic">“{m.note}”</p>
                    <div className="mt-4 flex items-center gap-2 border-t border-ink/8 pt-4">
                      <button
                        type="button"
                        onClick={() => setLiked((l) => ({ ...l, [i]: (l[i] ?? 0) ? 0 : 1 }))}
                        className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:text-[#c94f7c]"
                        aria-pressed={!!liked[i]}
                        aria-label="Inspire me"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${liked[i] ? "fill-[#c94f7c] text-[#c94f7c]" : "text-ink/40"}`}
                          aria-hidden
                        />
                        {m.likes + (liked[i] ?? 0)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSavedM((s) => ({ ...s, [i]: !s[i] }))}
                        className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-ink/60 transition-colors hover:text-gold-deep"
                        aria-label="Save this memory"
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${savedM[i] ? "fill-gold text-gold" : "text-ink/40"}`} aria-hidden />
                        {savedM[i] ? "Saved" : "Save"}
                      </button>
                      <a
                        href="#spin"
                        className="ml-auto inline-flex items-center gap-1 rounded-full text-xs font-black text-gold-deep transition-transform hover:translate-x-0.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden />
                        I want this
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
