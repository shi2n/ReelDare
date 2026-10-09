"use client";

import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Camera,
  Coins,
  Film,
  Flame,
  Globe,
  GripVertical,
  HeartHandshake,
  ListChecks,
  Lock,
  MapPin,
  Mountain,
  PenLine,
  ShieldCheck,
  Sunrise,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/primitives";

function Ring({ pct, size = 170, stroke = 13 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(250,247,240,0.12)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#d4a843"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - pct / 100) }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold text-cream">{pct}</span>
        <span className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">of 100</span>
      </div>
    </div>
  );
}

const REEL_BEATS = [
  { label: "HOOK", time: "0–3s", flex: 3, color: "#d4a843" },
  { label: "SETUP", time: "3–8s", flex: 5, color: "#c94f7c" },
  { label: "JOURNEY", time: "8–20s", flex: 12, color: "#3f7fbf" },
  { label: "MOMENT", time: "20–27s", flex: 7, color: "#c2453e" },
  { label: "LESSON", time: "32–37s", flex: 5, color: "#3f9e6d" },
  { label: "ENDING", time: "37–40s", flex: 3, color: "#8b5fbf" },
];

const PINS = [
  { x: "24%", y: "38%", label: "Jaipur" },
  { x: "32%", y: "58%", label: "Goa" },
  { x: "18%", y: "70%", label: "Munnar" },
  { x: "44%", y: "26%", label: "Leh" },
  { x: "70%", y: "44%", label: "Tokyo", soon: true },
];

const BADGES = [
  { icon: Award, label: "First Experience", earned: true },
  { icon: Flame, label: "10 Random Wishes", earned: true },
  { icon: Globe, label: "First Solo Trip", earned: true },
  { icon: Film, label: "First Reel", earned: true },
  { icon: Sunrise, label: "Sunrise Chaser", earned: true },
  { icon: HeartHandshake, label: "10 Kindness Acts", earned: false },
  { icon: Mountain, label: "10 Cities", earned: false },
  { icon: Coins, label: "First Business", earned: false },
];

const STORY = [
  { icon: Globe, text: "Travelled alone to Jaipur", tag: "Adventure" },
  { icon: Film, text: "Made my first short film", tag: "Created" },
  { icon: HeartHandshake, text: "Fed 100 people", tag: "Kindness" },
  { icon: Mountain, text: "Completed a half marathon", tag: "Physical" },
  { icon: PenLine, text: "Wrote a letter to future me", tag: "Quiet" },
];

export default function Features() {
  return (
    <section id="mylife" className="noise relative overflow-hidden bg-coal py-24 text-cream sm:py-32">
      <div className="pointer-events-none absolute top-0 left-1/4 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-80 w-80 rounded-full bg-[#c94f7c]/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          dark
          kicker="My life dashboard"
          title={
            <>
              A dashboard for the life <span className="text-gold italic">you actually lived.</span>
            </>
          }
          sub="Not tasks. Not productivity. Your 100, your streaks, your map, your reel plans and your story — proof that you showed up for your own life."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* MY 100 */}
          <Reveal className="md:col-span-2 lg:col-span-3 lg:row-span-2">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-coal-2 p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-[0.22em] text-gold uppercase">My 100</p>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-gold uppercase">
                  Lifetime quest
                </span>
              </div>
              <h3 className="font-display mt-4 text-3xl leading-tight font-semibold">
                “These are the things I want to experience in this lifetime.”
              </h3>
              <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row">
                <Ring pct={37} />
                <div className="flex-1 space-y-3">
                  {[
                    { label: "To do", n: 54, color: "bg-cream/20" },
                    { label: "In progress", n: 9, color: "bg-c94f7c" },
                    { label: "Completed", n: 37, color: "bg-gold" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="mb-1 flex justify-between text-xs font-bold">
                        <span className="tracking-wide text-cream/60 uppercase">{s.label}</span>
                        <span className="text-cream">{s.n}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          className={`h-full rounded-full ${s.color === "bg-c94f7c" ? "bg-[#c94f7c]" : s.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.n}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-7 space-y-2">
                {[
                  { t: "Take my parents on a trip", done: false, live: true },
                  { t: "Run a half marathon", done: true },
                  { t: "Sleep under the stars", done: true },
                  { t: "Make a song and publish it", done: false, live: true },
                ].map((r) => (
                  <div
                    key={r.t}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                      r.done ? "bg-white/4 text-cream/45" : "bg-white/7 text-cream/90"
                    }`}
                  >
                    <GripVertical className="h-4 w-4 shrink-0 text-cream/25" aria-hidden />
                    <span className={r.done ? "line-through" : ""}>{r.t}</span>
                    {r.live && !r.done && (
                      <span className="ml-auto rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-black tracking-[0.12em] text-gold uppercase">
                        Active
                      </span>
                    )}
                    {r.done && (
                      <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-black tracking-[0.12em] text-cream/50 uppercase">
                        Done
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-cream/40">
                Drag to reorder. Skip without guilt. 25, 50, 100 or 500 — it's your list, not a syllabus.
              </p>
            </div>
          </Reveal>

          {/* REEL MODE */}
          <Reveal delay={0.08} className="md:col-span-2 lg:col-span-3 lg:row-span-2">
            <div className="flex h-full flex-col rounded-3xl border border-gold/25 bg-gradient-to-b from-[#2b2620] to-coal-2 p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
                  <Film className="h-4 w-4" aria-hidden /> Reel mode
                </p>
                <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-black tracking-[0.14em] text-coal uppercase">
                  Creator built-in
                </span>
              </div>
              <h3 className="font-display mt-4 text-3xl leading-tight font-semibold">
                Every wish comes with a storyboard.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">
                Accept a challenge and we generate the hook, the shot list, the edit beats, caption, thumbnail text and
                ending line: “That's one more Reel Dare completed.”
              </p>
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-[10px] font-black tracking-[0.18em] text-cream/40 uppercase">
                  <span>Timeline · 40s</span>
                  <span>#ReelDare</span>
                </div>
                <div className="flex h-20 gap-1 overflow-hidden rounded-2xl bg-black/30 p-1.5">
                  {REEL_BEATS.map((b, i) => (
                    <motion.div
                      key={b.label}
                      className="relative flex flex-col justify-end overflow-hidden rounded-lg px-2 pb-1.5"
                      style={{ backgroundColor: `${b.color}26`, flexGrow: b.flex, flexBasis: 0 }}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                    >
                      <div className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: b.color }} />
                      <p className="truncate text-[9px] font-black tracking-wider" style={{ color: b.color }}>
                        {b.label}
                      </p>
                      <p className="text-[9px] font-semibold text-cream/50">{b.time}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[10px] font-black tracking-[0.18em] text-gold uppercase">Hook — 0 to 3 sec</p>
                    <p className="mt-1 text-[13px] leading-snug text-cream/80">
                      “I've never done this before… so today I'm doing it.”
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[10px] font-black tracking-[0.18em] text-gold uppercase">Thumbnail text</p>
                    <p className="font-display mt-1 text-lg leading-snug font-semibold text-cream">
                      Day 1 of doing things I was scared of
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-auto pt-5 text-xs leading-relaxed text-cream/40">
                One rule: film your own story, never someone else's wound. Ask before filming people. Inspiration, not
                exploitation.
              </p>
            </div>
          </Reveal>

          {/* LIFE MAP */}
          <Reveal className="md:col-span-1 lg:col-span-2">
            <div className="relative h-full min-h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-coal-2 p-6">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage: "radial-gradient(rgba(250,247,240,0.14) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
                aria-hidden
              />
              {PINS.map((p, i) => (
                <motion.div
                  key={p.label}
                  className="absolute"
                  style={{ left: p.x, top: p.y }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 260, damping: 18 }}
                >
                  <div className={`group relative ${p.soon ? "opacity-50" : ""}`}>
                    <span
                      className={`animate-pulse-soft absolute -inset-3 rounded-full ${p.soon ? "bg-white/10" : "bg-gold/20"}`}
                      aria-hidden
                    />
                    <MapPin className={`relative h-6 w-6 -translate-x-1/2 -translate-y-full ${p.soon ? "text-cream/40" : "fill-gold text-gold"}`} aria-hidden />
                    <span className="absolute top-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-cream">
                      {p.label}
                      {p.soon ? " · soon" : ""}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div className="relative z-10 max-w-[65%]">
                <p className="text-[11px] font-bold tracking-[0.22em] text-gold uppercase">Where I've lived</p>
                <p className="font-display mt-2 text-xl leading-snug font-semibold text-cream">
                  Every pin is a memory.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-cream/50">
                  12 cities so far. The rest of the map is negotiable.
                </p>
              </div>
            </div>
          </Reveal>

          {/* JOURNAL */}
          <Reveal delay={0.06} className="md:col-span-1 lg:col-span-2">
            <div className="h-full rounded-3xl bg-cream p-6 text-ink">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-gold-deep uppercase">
                <BookOpen className="h-4 w-4" aria-hidden /> Memory journal
              </p>
              <div
                className="mt-4 rounded-2xl border border-ink/8 p-4"
                style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(51,51,51,0.09) 28px)" }}
              >
                <p className="font-display text-lg leading-[28px] font-medium italic">
                  “Grandma laughed for forty straight minutes telling us how she met grandpa. I recorded all of it.”
                </p>
                <p className="mt-4 text-[11px] font-bold tracking-[0.14em] text-ink/45 uppercase">
                  — Interview my grandparents · Oct 2026
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["What happened?", "How did you feel?", "What surprised you?", "Would you do it again?"].map((q) => (
                  <span key={q} className="rounded-full bg-paper px-3 py-1 text-[11px] font-bold text-ink/60">
                    {q}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-ink/50">
                <Camera className="h-4 w-4 text-gold-deep" aria-hidden />
                Photos, voice notes and locations attach automatically
              </div>
            </div>
          </Reveal>

          {/* BADGES */}
          <Reveal delay={0.12} className="md:col-span-2 lg:col-span-2">
            <div className="h-full rounded-3xl border border-white/10 bg-coal-2 p-6">
              <p className="text-[11px] font-bold tracking-[0.22em] text-gold uppercase">Collect them all</p>
              <p className="font-display mt-2 text-xl font-semibold text-cream">Badges that mean you lived.</p>
              <div className="mt-5 grid grid-cols-4 gap-2.5">
                {BADGES.map((b) => (
                  <div
                    key={b.label}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center ${
                      b.earned ? "bg-gold/12 text-gold" : "bg-white/4 text-cream/30"
                    }`}
                    title={b.label}
                  >
                    {b.earned ? <b.icon className="h-6 w-6" aria-hidden /> : <Lock className="h-5 w-5" aria-hidden />}
                    <span className="text-[9px] leading-tight font-bold tracking-wide uppercase">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* MY STORY */}
          <Reveal className="md:col-span-2 lg:col-span-4">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-coal-2 p-7 sm:p-8 lg:flex-row lg:items-center lg:gap-10">
              <div className="lg:w-64 lg:shrink-0">
                <p className="text-[11px] font-bold tracking-[0.22em] text-gold uppercase">My story</p>
                <p className="font-display mt-2 text-2xl leading-snug font-semibold text-cream">
                  Your profile becomes a timeline of the life you actually lived.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-cream/50">2026 — the year it started counting.</p>
              </div>
              <div className="relative mt-6 flex-1 space-y-4 pl-7 lg:mt-0">
                <div className="absolute top-1 bottom-1 left-[9px] w-px bg-gradient-to-b from-gold via-white/15 to-transparent" aria-hidden />
                {STORY.map((s, i) => (
                  <motion.div
                    key={s.text}
                    className="relative flex items-center gap-3"
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                  >
                    <span className="absolute top-1/2 -left-7 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-coal ring-2 ring-gold">
                      <s.icon className="h-3 w-3 text-gold" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold text-cream/85">{s.text}</span>
                    <span className="rounded-full bg-white/6 px-2.5 py-0.5 text-[10px] font-black tracking-[0.12em] text-cream/50 uppercase">
                      {s.tag}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* SAFETY STRIP */}
          <Reveal delay={0.08} className="md:col-span-2 lg:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-3xl bg-gold p-6 text-coal">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-8 w-8 shrink-0" aria-hidden />
                <div>
                  <p className="font-display text-xl leading-snug font-semibold">Live more. Don't risk your life for content.</p>
                  <p className="mt-2 text-[13px] leading-relaxed font-medium text-coal/75">
                    No illegal challenges, no dangerous stunts, no humiliating strangers. Guided pros for real adventure.
                    Skip anything that feels unsafe — life is too short to force the wrong experience.
                  </p>
                </div>
              </div>
              <p className="mt-4 inline-flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase">
                <ListChecks className="h-4 w-4" aria-hidden />
                Every challenge ships with a safety level
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
