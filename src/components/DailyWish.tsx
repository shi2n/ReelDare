"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookmarkCheck, CalendarDays, Dices, RotateCw, Star, Sun } from "lucide-react";
import { categoryMeta, type ExperienceDTO } from "@/lib/shared";
import { Reveal } from "@/components/ui/primitives";

const FALLBACK_DAILY: ExperienceDTO = {
  id: 7,
  title: "Talk to someone you've never met and learn one thing about their life",
  description: "One genuine question to one stranger. One story you didn't have this morning.",
  category: "kindness",
  mood: "meaningful",
  difficulty: 3,
  budget: 0,
  time: "30min",
  energy: "normal",
  location: "city",
  social: "alone",
  safety: "safe",
  reel: 4,
  completions: 1412,
  tags: "",
};

const QUICK = [
  { label: "I have 10 minutes", time: "10min", mood: "any" },
  { label: "I have ₹0", budget: "free", mood: "any" },
  { label: "I'm bored", mood: "bored" },
  { label: "This weekend", time: "weekend", mood: "adventure" },
] as { label: string; time?: string; mood?: string; budget?: string }[];

export default function DailyWish() {
  const [exp, setExp] = useState<ExperienceDTO>(FALLBACK_DAILY);
  const [savedIt, setSavedIt] = useState(false);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    fetch("/api/daily")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.experience) setExp(d.experience);
      })
      .catch(() => {});
  }, []);

  const quickGo = (q: (typeof QUICK)[number]) => {
    window.dispatchEvent(
      new CustomEvent("tdbd-preset", { detail: { time: q.time, mood: q.mood, budget: q.budget } })
    );
    document.getElementById("spin")?.scrollIntoView({ behavior: "smooth" });
  };

  const saveIt = () => {
    try {
      const s = JSON.parse(localStorage.getItem("tdbd-saved") ?? "[]") as number[];
      if (!s.includes(exp.id)) {
        localStorage.setItem("tdbd-saved", JSON.stringify([...s, exp.id]));
      }
    } catch {}
    setSavedIt(true);
    window.dispatchEvent(new Event("tdbd-update"));
  };

  const notToday = async () => {
    setRotating(true);
    try {
      const r = await fetch("/api/wish");
      if (r.ok) {
        const d = (await r.json()) as { experience: ExperienceDTO };
        setExp(d.experience);
        setSavedIt(false);
      }
    } catch {}
    setRotating(false);
  };

  const meta = categoryMeta(exp.category);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section id="today" className="relative bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-coal px-4 py-1.5 text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
              <Sun className="h-3.5 w-3.5" aria-hidden />
              Today's wish · {today}
            </p>
            <h2 className="font-display text-4xl leading-[1.06] font-semibold text-ink sm:text-5xl">
              “{exp.title}”
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/60">{exp.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3.5 py-1.5 text-[11px] font-black tracking-[0.14em] uppercase"
                style={{ backgroundColor: meta.bg, color: meta.color }}
              >
                {meta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-black tracking-[0.14em] text-ink/70 uppercase">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < exp.difficulty ? "fill-gold text-gold" : "text-ink/15"}`} aria-hidden />
                ))}
              </span>
              <span className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-black tracking-[0.14em] text-ink/70 uppercase">
                ₹0 friendly? {exp.budget === 0 ? "Yes" : "Almost"}
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#spin"
                onClick={() => quickGo({ label: "", mood: "any" })}
                className="inline-flex items-center gap-2 rounded-full bg-coal px-6 py-3.5 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
              >
                <Dices className="h-4 w-4 text-gold" aria-hidden />
                Do it today
              </a>
              <button
                type="button"
                onClick={saveIt}
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-white px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-gold"
              >
                <BookmarkCheck className={`h-4 w-4 ${savedIt ? "fill-gold text-gold" : "text-ink/50"}`} aria-hidden />
                {savedIt ? "Saved" : "Save it"}
              </button>
              <button
                type="button"
                onClick={notToday}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-bold text-ink/50 transition-colors hover:text-ink"
              >
                <RotateCw className={`h-4 w-4 ${rotating ? "animate-spin" : ""}`} aria-hidden />
                Not today
              </button>
            </div>
            <p className="mt-4 text-xs font-semibold text-ink/40">
              Skipped one? Life happened. That's okay — start again tomorrow.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="noise relative overflow-hidden rounded-[2rem] bg-coal p-7 sm:p-9">
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                I don't know what to do
              </p>
              <p className="font-display mt-4 text-2xl leading-snug font-semibold text-cream">
                Answer two taps. Get one thing worth doing.
              </p>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {QUICK.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => quickGo(q)}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-left text-sm font-bold text-cream transition-all hover:border-gold/60 hover:bg-gold/10"
                  >
                    {q.label}
                    <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" aria-hidden />
                  </button>
                ))}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-cream/40">
                The engine weighs your mood, time, budget, energy and company — then deals you one wish from thousands.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
