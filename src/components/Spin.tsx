"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BedDouble,
  Bookmark,
  BookmarkCheck,
  Brain,
  Check,
  ChevronDown,
  Compass,
  Dices,
  Film,
  Flame,
  Heart,
  HeartHandshake,
  Laugh,
  MapPin,
  Palette,
  PartyPopper,
  RotateCw,
  Star,
  Timer,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import {
  categoryMeta,
  budgetLabel,
  timeLabel,
  calculateTaskXP,
  SOCIAL_LABELS,
  LOCATION_LABELS,
  SPIN_TITLES,
  type ExperienceDTO,
} from "@/lib/shared";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import SpinWheel from "./SpinWheel";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/user";

type Phase = "idle" | "spinning" | "result" | "challenge";

const MOODS = [
  { key: "any", label: "Surprise me", icon: Dices },
  { key: "bored", label: "I'm bored", icon: BedDouble },
  { key: "fun", label: "Fun", icon: Laugh },
  { key: "crazy", label: "Crazy", icon: Flame },
  { key: "growth", label: "Growth", icon: Brain },
  { key: "meaningful", label: "Meaningful", icon: Heart },
  { key: "adventure", label: "Adventure", icon: Compass },
  { key: "create", label: "Creative", icon: Palette },
  { key: "kindness", label: "Kindness", icon: HeartHandshake },
];

const TIMES = [
  { key: "any", label: "Any time" },
  { key: "10min", label: "10 min" },
  { key: "30min", label: "30 min" },
  { key: "1hour", label: "1 hour" },
  { key: "3hours", label: "3 hours" },
  { key: "day", label: "Today" },
  { key: "weekend", label: "Weekend" },
];

const BUDGETS = [
  { key: "any", label: "Any budget" },
  { key: "free", label: "₹0 — free" },
  { key: "low", label: "Under ₹500" },
  { key: "mid", label: "Under ₹1,000" },
];

const ENERGIES = [
  { key: "any", label: "Any energy" },
  { key: "lazy", label: "Lazy" },
  { key: "low", label: "Low" },
  { key: "normal", label: "Normal" },
  { key: "active", label: "Active" },
  { key: "extreme", label: "Extreme" },
];

const SOCIALS = [
  { key: "any", label: "Any company" },
  { key: "alone", label: "Alone" },
  { key: "one", label: "One person" },
  { key: "friends", label: "Friends" },
  { key: "family", label: "Family" },
  { key: "strangers", label: "Strangers" },
];

const FALLBACK: ExperienceDTO[] = [
  { id: 101, title: "Watch the sunrise somewhere new", description: "Wake before dawn, find a horizon you've never watched light up, and just be there.", category: "travel", mood: "adventure", difficulty: 1, budget: 0, time: "3hours", energy: "low", location: "outdoor", social: "any", safety: "safe", reel: 4, completions: 2410, tags: "" },
  { id: 102, title: "Talk to 10 strangers in one day", description: "Ask genuine questions, listen, and collect ten tiny human stories.", category: "crazy", mood: "crazy", difficulty: 4, budget: 0, time: "day", energy: "active", location: "city", social: "alone", safety: "safe", reel: 5, completions: 1731, tags: "" },
  { id: 103, title: "Eat breakfast for dinner", description: "Pancakes at 8 PM. Nobody can stop you. That's the whole point.", category: "fun", mood: "fun", difficulty: 1, budget: 1, time: "1hour", energy: "lazy", location: "home", social: "any", safety: "safe", reel: 3, completions: 1982, tags: "" },
  { id: 104, title: "Write a letter to your future self", description: "Seal it, date it, hide it somewhere you'll find in five years.", category: "spiritual", mood: "meaningful", difficulty: 1, budget: 0, time: "1hour", energy: "lazy", location: "home", social: "alone", safety: "safe", reel: 2, completions: 1354, tags: "" },
  { id: 105, title: "Create a fake museum in your room", description: "Curate your own junk with tiny exhibit labels. Charge admission in snacks.", category: "weird", mood: "fun", difficulty: 2, budget: 0, time: "3hours", energy: "lazy", location: "home", social: "friends", safety: "safe", reel: 5, completions: 940, tags: "" },
  { id: 106, title: "Pay for a stranger's meal", description: "Leave the money before they know. Exit like a superhero.", category: "kindness", mood: "meaningful", difficulty: 1, budget: 1, time: "30min", energy: "lazy", location: "city", social: "alone", safety: "safe", reel: 3, completions: 2208, tags: "" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-[13px] font-bold transition-all duration-200 ${
        active
          ? "border-gold bg-gold text-coal shadow-[0_8px_20px_rgba(212,168,67,0.35)]"
          : "border-white/15 bg-white/5 text-cream/70 hover:border-gold/50 hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}

function checklistFor(exp: ExperienceDTO): string[] {
  return [
    `Plan it — pick a day for “${exp.title}”`,
    "Prepare what you'll need",
    "Start the experience",
    "Capture one memory — a photo, a note, anything",
    "Complete it and tell your story",
  ];
}

export default function Spin() {
  const { awardXP, isLoggedIn, isReady } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<"wheel" | "deck">("wheel");
  const [phase, setPhase] = useState<Phase>("idle");
  const [mood, setMood] = useState("any");
  const [time, setTime] = useState("any");
  const [budget, setBudget] = useState("any");
  const [energy, setEnergy] = useState("any");
  const [social, setSocial] = useState("any");
  const [showTune, setShowTune] = useState(false);
  const [ticker, setTicker] = useState(SPIN_TITLES[0]);
  const [exp, setExp] = useState<ExperienceDTO | null>(null);
  const [checks, setChecks] = useState<boolean[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [doneCount, setDoneCount] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [spins, setSpins] = useState(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("tdbd-saved") ?? "[]") as number[];
      setSaved(Array.isArray(s) ? s : []);
      setDoneCount(Number(localStorage.getItem("tdbd-done") ?? "0") || 0);
      setSpins(Number(localStorage.getItem("tdbd-spins") ?? "0") || 0);
    } catch {}
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, []);

  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent<{ time?: string; mood?: string; budget?: string }>).detail;
      if (d?.time) setTime(d.time);
      if (d?.mood) setMood(d.mood);
      if (d?.budget) setBudget(d.budget);
    };
    window.addEventListener("tdbd-preset", h);
    return () => window.removeEventListener("tdbd-preset", h);
  }, []);

  const emitUpdate = () => window.dispatchEvent(new Event("tdbd-update"));

  const spin = useCallback(async () => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    if (tickerRef.current) clearInterval(tickerRef.current);
    setCelebrating(false);
    setPhase("spinning");
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    tickerRef.current = setInterval(() => {
      setTicker(SPIN_TITLES[Math.floor(Math.random() * SPIN_TITLES.length)]);
    }, 75);

    const params = new URLSearchParams();
    if (mood !== "any") params.set("mood", mood);
    if (time !== "any") params.set("time", time);
    if (budget !== "any") params.set("budget", budget);
    if (energy !== "any") params.set("energy", energy);
    if (social !== "any") params.set("social", social);

    let storedSeen: number[] = [];
    try {
      storedSeen = JSON.parse(localStorage.getItem("tdbd-seen-wishes") ?? "[]") as number[];
    } catch {}
    if (storedSeen.length > 0) {
      params.set("exclude", storedSeen.join(","));
    }

    let result: ExperienceDTO | null = null;
    try {
      const res = await fetch(`/api/wish?${params.toString()}`);
      if (res.ok) {
        const data = (await res.json()) as { experience: ExperienceDTO };
        result = data.experience;
      }
    } catch {}

    if (!result) {
      const { RICH_EXPERIENCES } = await import("@/lib/experiences-catalog");
      const unpicked = RICH_EXPERIENCES.filter((e) => !storedSeen.includes(e.id));
      result = (unpicked.length > 0 ? unpicked : RICH_EXPERIENCES)[Math.floor(Math.random() * (unpicked.length || RICH_EXPERIENCES.length))];
    }

    if (result) {
      const nextSeen = [...storedSeen.filter((id) => id !== result!.id), result.id];
      try {
        localStorage.setItem("tdbd-seen-wishes", JSON.stringify(nextSeen));
      } catch {}
    }

    await new Promise((r) => setTimeout(r, 1600));
    if (tickerRef.current) clearInterval(tickerRef.current);
    setExp(result);
    setChecks(new Array(checklistFor(result).length).fill(false));
    setPhase("result");
    const next = (Number(localStorage.getItem("tdbd-spins") ?? "0") || 0) + 1;
    setSpins(next);
    try {
      localStorage.setItem("tdbd-spins", String(next));
      window.dispatchEvent(new Event("tdbd-update"));
    } catch {}
  }, [mood, time, budget, energy, social, isLoggedIn, pathname, router]);

  const saveCurrent = () => {
    if (!exp) return;
    if (saved.includes(exp.id)) return;
    const next = [...saved, exp.id];
    setSaved(next);
    try {
      localStorage.setItem("tdbd-saved", JSON.stringify(next));
      emitUpdate();
    } catch {}
  };

  const accept = () => setPhase("challenge");

  const complete = () => {
    const next = doneCount + 1;
    setDoneCount(next);
    if (exp) {
      const earnedXp = calculateTaskXP(exp.difficulty, exp.time);
      awardXP(earnedXp, `Completed challenge: "${exp.title}"`);
    }
    try {
      localStorage.setItem("tdbd-done", String(next));
      emitUpdate();
    } catch {}
    setCelebrating(true);
  };

  const progress = checks.length ? Math.round((checks.filter(Boolean).length / checks.length) * 100) : 0;

  const confetti = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.8,
        duration: 2.6 + Math.random() * 2,
        color: ["#d4a843", "#faf7f0", "#c94f7c", "#3f9e6d", "#3f7fbf", "#8b5fbf"][i % 6],
      })),
    [celebrating]
  );

  const meta = exp ? categoryMeta(exp.category) : null;

  return (
    <section id="spin" className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          kicker="The wish engine"
          title={
            <>
              Don't know what to do? <span className="text-gold-deep italic">Let us decide.</span>
            </>
          }
          sub="Tell us your mood, your time and your budget — then spin. The engine picks one real experience out of thousands. No pressure, no judgement. Not this one? That's okay. Spin again."
        />

        {/* View Mode Toggle */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex rounded-full border border-ink/10 bg-coal/5 p-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("wheel")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                viewMode === "wheel"
                  ? "bg-coal text-gold shadow-md"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              <Dices className="h-3.5 w-3.5" />
              Spin Circle (Wheel)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("deck")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                viewMode === "deck"
                  ? "bg-coal text-gold shadow-md"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Custom Filters
            </button>
          </div>
          <Link
            href="/spin"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-bold text-gold-deep transition-all hover:bg-gold hover:text-coal"
          >
            Full Page Spin Circle →
          </Link>
        </div>

        {viewMode === "wheel" ? (
          <Reveal delay={0.15} className="mt-10">
            <div className="noise relative overflow-hidden rounded-[2.5rem] bg-coal p-6 shadow-[0_40px_90px_rgba(33,29,25,0.35)] sm:p-10">
              <SpinWheel />
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.15} className="mt-10">
            <div className="noise relative overflow-hidden rounded-[2rem] bg-coal p-5 shadow-[0_40px_90px_rgba(33,29,25,0.35)] sm:rounded-[2.5rem] sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

            <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-10">
              {/* controls */}
              <div>
                <div className="space-y-5">
                  <div>
                    <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                      <PartyPopper className="h-3.5 w-3.5" aria-hidden /> Mood
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((m) => (
                        <Chip key={m.key} active={mood === m.key} onClick={() => setMood(m.key)}>
                          <span className="inline-flex items-center gap-1.5">
                            <m.icon className="h-3.5 w-3.5" aria-hidden />
                            {m.label}
                          </span>
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                      <Timer className="h-3.5 w-3.5" aria-hidden /> Time you have
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TIMES.map((t) => (
                        <Chip key={t.key} active={time === t.key} onClick={() => setTime(t.key)}>
                          {t.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                      <Wallet className="h-3.5 w-3.5" aria-hidden /> Budget
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <Chip key={b.key} active={budget === b.key} onClick={() => setBudget(b.key)}>
                          {b.label}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTune((v) => !v)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-cream/60 transition-colors hover:text-gold"
                  >
                    <Zap className="h-4 w-4" aria-hidden />
                    Fine-tune energy & company
                    <ChevronDown className={`h-4 w-4 transition-transform ${showTune ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  <AnimatePresence initial={false}>
                    {showTune && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 pt-1">
                          <div>
                            <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                              <Zap className="h-3.5 w-3.5" aria-hidden /> Energy
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {ENERGIES.map((e) => (
                                <Chip key={e.key} active={energy === e.key} onClick={() => setEnergy(e.key)}>
                                  {e.label}
                                </Chip>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                              <Users className="h-3.5 w-3.5" aria-hidden /> Company
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {SOCIALS.map((s) => (
                                <Chip key={s.key} active={social === s.key} onClick={() => setSocial(s.key)}>
                                  {s.label}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={spin}
                  disabled={phase === "spinning"}
                  className="group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gold px-8 py-5 text-lg font-black tracking-tight text-coal shadow-[0_18px_50px_rgba(212,168,67,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(212,168,67,0.55)] disabled:translate-y-0 disabled:opacity-70"
                >
                  <Dices
                    className={`h-6 w-6 ${phase === "spinning" ? "animate-spin" : "transition-transform duration-500 group-hover:rotate-[180deg]"}`}
                    aria-hidden
                  />
                  {phase === "spinning"
                    ? "Shuffling the deck…"
                    : isReady && !isLoggedIn
                    ? "Login to get a wish"
                    : spins > 0
                    ? "Give me another wish"
                    : "Give me a wish"}
                </button>
                <p className="mt-3 text-center text-xs font-semibold text-cream/40">
                  {spins > 0 ? `${spins} wish${spins === 1 ? "" : "es"} granted this session · ` : ""}2,000+ possible outcomes
                </p>
              </div>

              {/* display */}
              <div
                ref={panelRef}
                className="relative flex min-h-[430px] scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-white/10 bg-coal-2"
              >
                <AnimatePresence mode="wait">
                  {phase === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center"
                    >
                      <div className="relative">
                        <div className="animate-pulse-soft absolute inset-0 rounded-full bg-gold/20 blur-2xl" />
                        <div className="relative grid h-28 w-28 place-items-center rounded-full border-2 border-dashed border-gold/50">
                          <Dices className="h-10 w-10 text-gold" aria-hidden />
                        </div>
                      </div>
                      <div>
                        <p className="font-display text-3xl font-semibold text-cream">What should I do today?</p>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/55">
                          Set your filters on the left, hit the gold button, and we'll hand you one thing worth doing —
                          from the world's biggest library of experiences.
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["Something cheap", "Something scary", "Something weird", "Something today"].map((t) => (
                          <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-cream/40">
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {phase === "spinning" && (
                    <motion.div
                      key="spinning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center"
                    >
                      <p className="text-[11px] font-bold tracking-[0.3em] text-gold uppercase">Rolling through 2,000+ experiences</p>
                      <div className="flex h-32 items-center overflow-hidden">
                        <motion.p
                          key={ticker}
                          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          className="font-display max-w-md text-3xl font-semibold text-cream/90 sm:text-4xl"
                        >
                          {ticker}
                        </motion.p>
                      </div>
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.span
                            key={i}
                            className="h-2 w-2 rounded-full bg-gold"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {(phase === "result" || phase === "challenge") && exp && meta && (
                    <motion.div
                      key={`${phase}-${exp.id}`}
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-1 flex-col p-6 sm:p-8"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-full px-3 py-1 text-[11px] font-black tracking-[0.14em] uppercase"
                          style={{ backgroundColor: meta.color, color: "#211d19" }}
                        >
                          {meta.label}
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-gold uppercase">
                          Your experience #{exp.id}
                        </span>
                        <span className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-gold uppercase">
                          +{calculateTaskXP(exp.difficulty, exp.time)} XP Bounty
                        </span>
                        {saved.includes(exp.id) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-gold uppercase">
                            <BookmarkCheck className="h-3 w-3" aria-hidden /> Saved
                          </span>
                        )}
                      </div>

                      <h3 className="font-display mt-5 text-3xl leading-tight font-semibold text-cream sm:text-4xl">{exp.title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/60 sm:text-base">{exp.description}</p>

                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white/5 p-3.5">
                          <p className="text-[10px] font-bold tracking-[0.18em] text-cream/40 uppercase">Difficulty</p>
                          <p className="mt-1.5 flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3.5 w-3.5 ${s <= exp.difficulty ? "fill-gold text-gold" : "text-cream/20"}`}
                                aria-hidden
                              />
                            ))}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3.5">
                          <p className="text-[10px] font-bold tracking-[0.18em] text-cream/40 uppercase">Budget</p>
                          <p className="mt-1.5 text-sm font-bold text-cream">{budgetLabel(exp.budget)}</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3.5">
                          <p className="text-[10px] font-bold tracking-[0.18em] text-cream/40 uppercase">Time</p>
                          <p className="mt-1.5 text-sm font-bold text-cream">{timeLabel(exp.time)}</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3.5">
                          <p className="text-[10px] font-bold tracking-[0.18em] text-cream/40 uppercase">Company</p>
                          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-cream">
                            <Users className="h-3.5 w-3.5 text-gold" aria-hidden />
                            {SOCIAL_LABELS[exp.social] ?? "Any"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3.5">
                          <p className="text-[10px] font-bold tracking-[0.18em] text-cream/40 uppercase">Where</p>
                          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-cream">
                            <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden />
                            {LOCATION_LABELS[exp.location] ?? "Anywhere"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3.5">
                          <p className="text-[10px] font-bold tracking-[0.18em] text-cream/40 uppercase">Reel potential</p>
                          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-cream">
                            <Film className="h-3.5 w-3.5 text-gold" aria-hidden />
                            {exp.reel}/5
                          </p>
                        </div>
                      </div>

                      {phase === "challenge" ? (
                        <div className="mt-6">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">You accepted the challenge</p>
                            <p className="font-display text-sm font-bold text-gold">{progress}%</p>
                          </div>
                          <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="h-full rounded-full bg-gold"
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                          <ul className="space-y-2">
                            {checklistFor(exp).map((step, i) => (
                              <li key={i}>
                                <button
                                  type="button"
                                  onClick={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
                                  data-done={checks[i]}
                                  className="checkline flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10"
                                >
                                  <span className="checkline-box grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-cream/30 transition-colors">
                                    {checks[i] && <Check className="h-3.5 w-3.5 text-coal" aria-hidden />}
                                  </span>
                                  <span className={`text-sm font-semibold ${checks[i] ? "text-cream/40 line-through" : "text-cream/85"}`}>
                                    {step}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <button
                              type="button"
                              onClick={complete}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 text-base font-black text-coal transition-all hover:-translate-y-0.5"
                            >
                              <PartyPopper className="h-5 w-5" aria-hidden />
                              Complete experience (+{calculateTaskXP(exp.difficulty, exp.time)} XP)
                            </button>
                            <button
                              type="button"
                              onClick={spin}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-4 text-sm font-bold text-cream/70 transition-colors hover:border-gold/50 hover:text-cream"
                            >
                              <RotateCw className="h-4 w-4" aria-hidden />
                              Life is short — try another
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={accept}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 text-base font-black text-coal shadow-[0_14px_40px_rgba(212,168,67,0.35)] transition-all hover:-translate-y-0.5"
                          >
                            <Check className="h-5 w-5" aria-hidden />
                            I'll do it
                          </button>
                          <button
                            type="button"
                            onClick={spin}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-4 text-sm font-bold text-cream/80 transition-colors hover:border-gold/50 hover:text-cream"
                          >
                            <RotateCw className="h-4 w-4" aria-hidden />
                            Spin again
                          </button>
                          <button
                            type="button"
                            onClick={saveCurrent}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-4 text-sm font-bold text-cream/80 transition-colors hover:border-gold/50 hover:text-gold"
                          >
                            <Bookmark className={`h-4 w-4 ${saved.includes(exp.id) ? "fill-gold text-gold" : ""}`} aria-hidden />
                            {saved.includes(exp.id) ? "Saved" : "Save this"}
                          </button>
                        </div>
                      )}
                      <p className="mt-4 text-center text-xs text-cream/35">
                        {exp.completions.toLocaleString("en-IN")} people have done this · Safety first: skip anything that feels unsafe, always.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      )}
      </div>

      {/* celebration overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="noise fixed inset-0 z-[90] flex items-center justify-center bg-coal/95 p-6"
          >
            {confetti.map((c) => (
              <motion.span
                key={c.id}
                className="absolute top-0 rounded-full"
                style={{ left: `${c.left}%`, width: c.size, height: c.size, backgroundColor: c.color }}
                initial={{ y: -30, opacity: 1 }}
                animate={{ y: "110vh", opacity: [1, 1, 0.4] }}
                transition={{ duration: c.duration, delay: c.delay, ease: "easeIn" }}
              />
            ))}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-lg text-center"
            >
              <p className="font-display text-6xl font-semibold text-cream sm:text-7xl">
                You <span className="text-gold italic">did it.</span>
              </p>
              <p className="mt-4 text-lg text-cream/70">One more dare crushed and captured.</p>
              {exp && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-5 py-2 text-sm font-black tracking-wider text-gold uppercase">
                  +{calculateTaskXP(exp.difficulty, exp.time)} XP added to profile
                </div>
              )}
              <p className="font-display mt-8 text-5xl font-semibold text-gold">
                {String(doneCount).padStart(3, "0")}
                <span className="text-cream/40 text-2xl"> / experiences completed</span>
              </p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setCelebrating(false);
                    setPhase("idle");
                    spin();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-black text-coal"
                >
                  <Dices className="h-5 w-5" aria-hidden />
                  Do another
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCelebrating(false);
                    setPhase("idle");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-bold text-cream"
                >
                  Keep exploring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
