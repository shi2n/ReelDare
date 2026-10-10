"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Compass,
  Dices,
  Flame,
  Palette,
  Laugh,
  Brain,
  HeartHandshake,
  Zap,
  Wand2,
  Moon,
  Camera,
  Star,
  Users,
  MapPin,
  Film,
  RotateCw,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  Lock,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  categoryMeta,
  budgetLabel,
  timeLabel,
  calculateTaskXP,
  SOCIAL_LABELS,
  LOCATION_LABELS,
  type ExperienceDTO,
} from "@/lib/shared";
import { useUser } from "@/lib/user";

export interface WheelSegment {
  id: string;
  label: string;
  shortLabel: string;
  category: string;
  mood: string;
  color: string;
  textColor: string;
  icon: typeof Compass;
  sampleWish: {
    title: string;
    description: string;
    budget: number;
    time: string;
    difficulty: number;
    social: string;
    location: string;
    reel: number;
  };
}

export const WHEEL_SEGMENTS: WheelSegment[] = [
  {
    id: "adventure",
    label: "Adventure",
    shortLabel: "ADVENTURE",
    category: "travel",
    mood: "adventure",
    color: "#2563eb", // vibrant royal blue
    textColor: "#ffffff",
    icon: Compass,
    sampleWish: {
      title: "Watch the sunrise somewhere new",
      description: "Wake before dawn, find a horizon you've never watched light up, and just be there.",
      budget: 0,
      time: "3hours",
      difficulty: 1,
      social: "alone",
      location: "outdoor",
      reel: 4,
    },
  },
  {
    id: "crazy",
    label: "Crazy Stunt",
    shortLabel: "CRAZY",
    category: "crazy",
    mood: "crazy",
    color: "#db2777", // electric pink
    textColor: "#ffffff",
    icon: Flame,
    sampleWish: {
      title: "Talk to 10 strangers in one day",
      description: "Ask genuine questions, listen, and collect ten tiny human stories.",
      budget: 0,
      time: "day",
      difficulty: 4,
      social: "strangers",
      location: "city",
      reel: 5,
    },
  },
  {
    id: "create",
    label: "Create Art",
    shortLabel: "CREATE",
    category: "create",
    mood: "create",
    color: "#7c3aed", // violet
    textColor: "#ffffff",
    icon: Palette,
    sampleWish: {
      title: "Make a 40-second short film this weekend",
      description: "No cinema cameras. Just your phone, one emotion, and a story waiting to be shown.",
      budget: 0,
      time: "weekend",
      difficulty: 3,
      social: "alone",
      location: "home",
      reel: 5,
    },
  },
  {
    id: "fun",
    label: "Random Joy",
    shortLabel: "FUN",
    category: "fun",
    mood: "fun",
    color: "#d97706", // warm golden amber
    textColor: "#ffffff",
    icon: Laugh,
    sampleWish: {
      title: "Eat breakfast for dinner in your pajamas",
      description: "Fluffy pancakes and syrup at 8:30 PM. Nobody can stop you. That's the whole point.",
      budget: 1,
      time: "1hour",
      difficulty: 1,
      social: "friends",
      location: "home",
      reel: 3,
    },
  },
  {
    id: "growth",
    label: "Deep Growth",
    shortLabel: "GROWTH",
    category: "growth",
    mood: "growth",
    color: "#059669", // emerald
    textColor: "#ffffff",
    icon: Brain,
    sampleWish: {
      title: "24-hour total digital silence",
      description: "Turn off notifications, screen time down to zero. Discover your own real thoughts.",
      budget: 0,
      time: "day",
      difficulty: 3,
      social: "alone",
      location: "home",
      reel: 4,
    },
  },
  {
    id: "kindness",
    label: "Pure Kindness",
    shortLabel: "KINDNESS",
    category: "kindness",
    mood: "kindness",
    color: "#dc2626", // bold crimson
    textColor: "#ffffff",
    icon: HeartHandshake,
    sampleWish: {
      title: "Pay for a stranger's meal secretly",
      description: "Leave the table quietly before they know. Slip away like a real-life superhero.",
      budget: 1,
      time: "30min",
      difficulty: 1,
      social: "strangers",
      location: "city",
      reel: 4,
    },
  },
  {
    id: "physical",
    label: "Body Quest",
    shortLabel: "PHYSICAL",
    category: "physical",
    mood: "fun",
    color: "#ea580c", // fiery orange
    textColor: "#ffffff",
    icon: Zap,
    sampleWish: {
      title: "Walk 30,000 steps exploring your city",
      description: "Take small streets you never noticed. Let your feet draw a map of pure discovery.",
      budget: 0,
      time: "halfday",
      difficulty: 3,
      social: "any",
      location: "city",
      reel: 4,
    },
  },
  {
    id: "weird",
    label: "Wild & Weird",
    shortLabel: "WEIRD",
    category: "weird",
    mood: "fun",
    color: "#65a30d", // olive lime
    textColor: "#ffffff",
    icon: Wand2,
    sampleWish: {
      title: "Curate a fake museum exhibition in your room",
      description: "Assign tiny museum placards to ordinary objects. Charge room entrance in cookies.",
      budget: 0,
      time: "3hours",
      difficulty: 2,
      social: "friends",
      location: "home",
      reel: 5,
    },
  },
  {
    id: "spiritual",
    label: "Soul & Peace",
    shortLabel: "SOUL",
    category: "spiritual",
    mood: "meaningful",
    color: "#4f46e5", // indigo
    textColor: "#ffffff",
    icon: Moon,
    sampleWish: {
      title: "Write a letter to your future self in 5 years",
      description: "Tell them who you loved, what broke your heart, and what you still believe in.",
      budget: 0,
      time: "1hour",
      difficulty: 1,
      social: "alone",
      location: "home",
      reel: 2,
    },
  },
  {
    id: "memories",
    label: "Memory Shot",
    shortLabel: "MEMORY",
    category: "family",
    mood: "meaningful",
    color: "#0d9488", // deep teal
    textColor: "#ffffff",
    icon: Camera,
    sampleWish: {
      title: "Recreate an old childhood family photo",
      description: "Find the exact same awkward poses and clothes. Send it to family without context.",
      budget: 0,
      time: "2hours",
      difficulty: 2,
      social: "family",
      location: "home",
      reel: 5,
    },
  },
  {
    id: "shameful_acts",
    label: "Shameful Acts",
    shortLabel: "SHAMEFUL",
    category: "shameful_acts",
    mood: "crazy",
    color: "#9333ea", // vibrant purple
    textColor: "#ffffff",
    icon: Flame,
    sampleWish: {
      title: "Dramatic Oscar speech to your bathroom mirror",
      description: "Deliver a 45-second emotional Oscar acceptance speech to your mirror as if you won Best Actor.",
      budget: 0,
      time: "10min",
      difficulty: 2,
      social: "alone",
      location: "home",
      reel: 5,
    },
  },
  {
    id: "public_acts",
    label: "Public Acts",
    shortLabel: "PUBLIC",
    category: "public_acts",
    mood: "crazy",
    color: "#ea580c", // bold electric orange
    textColor: "#ffffff",
    icon: Flame,
    sampleWish: {
      title: "Compliment 3 strangers with genuine warmth",
      description: "Approach 3 different people in public, give each a sincere, hyper-specific compliment, and walk away smiling.",
      budget: 0,
      time: "30min",
      difficulty: 3,
      social: "strangers",
      location: "city",
      reel: 5,
    },
  },
];

// Web Audio API sound generator for mechanical click & win chime
function playClickSound(ctx: AudioContext | null) {
  if (!ctx || ctx.state !== "running") return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

function playWinChime(ctx: AudioContext | null) {
  if (!ctx || ctx.state !== "running") return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.5);
    });
  } catch {}
}

export default function SpinWheel({
  onSelectWish,
  initialCategory,
  className = "",
}: {
  onSelectWish?: (exp: ExperienceDTO) => void;
  initialCategory?: string;
  className?: string;
}) {
  const { awardXP, submitEvidence, user, isLoggedIn, isReady } = useUser();
  const pathname = usePathname();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<string>("all");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceDTO | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saved, setSaved] = useState<number[]>([]);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [flipperTick, setFlipperTick] = useState(false);
  const [seenWishIds, setSeenWishIds] = useState<number[]>([]);

  // Evidence Verification Modal states
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [whatYouDid, setWhatYouDid] = useState("");
  const [timeSpent, setTimeSpent] = useState("45 mins");
  const [completedDate, setCompletedDate] = useState("");
  const [evidenceLink, setEvidenceLink] = useState("");
  const [evidenceError, setEvidenceError] = useState("");
  const [evidenceSuccess, setEvidenceSuccess] = useState(false);

  useEffect(() => {
    setCompletedDate(new Date().toISOString().split("T")[0]);
    try {
      const storedSeen = JSON.parse(localStorage.getItem("tdbd-seen-wishes") ?? "[]") as number[];
      if (Array.isArray(storedSeen)) setSeenWishIds(storedSeen);
    } catch {}
  }, []);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const wheelRef = useRef<SVGSVGElement | null>(null);
  const numSegments = WHEEL_SEGMENTS.length;
  const segmentAngle = 360 / numSegments;

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("tdbd-saved") ?? "[]") as number[];
      setSaved(Array.isArray(s) ? s : []);
    } catch {}
    if (user?.completedEvidences) {
      setCompletedIds(user.completedEvidences.map((e) => e.expId));
    }
  }, [user]);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const spin = useCallback(async () => {
    if (isSpinning) return;
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    initAudio();
    setIsSpinning(true);
    setWinningIndex(null);
    setSelectedExperience(null);
    setCopied(false);

    // Pick target segment based on user's selected activity type filter
    let targetIdx: number;
    const filterCat = selectedActivityCategory !== "all" ? selectedActivityCategory : initialCategory;

    if (filterCat) {
      const matchingIndices = WHEEL_SEGMENTS.map((s, idx) => ({ s, idx })).filter(
        ({ s }) => s.category === filterCat || s.id === filterCat
      );
      if (matchingIndices.length > 0) {
        const picked = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
        targetIdx = picked.idx;
      } else {
        targetIdx = Math.floor(Math.random() * numSegments);
      }
    } else {
      targetIdx = Math.floor(Math.random() * numSegments);
    }

    // Top pointer is at 0 degrees (12 o'clock).
    const segmentCenter = (targetIdx + 0.5) * segmentAngle;
    const targetModAngle = (360 - segmentCenter + 360) % 360;

    // Full rotations: 6 to 9 spins
    const fullSpins = (6 + Math.floor(Math.random() * 3)) * 360;
    const currentMod = rotation % 360;
    const extraOffset = (targetModAngle - currentMod + 360) % 360;
    const finalRotation = rotation + fullSpins + extraOffset;

    setRotation(finalRotation);

    // Trigger ticker sounds as wheel accelerates and decelerates
    const startTime = Date.now();
    const duration = 4400; // ms

    const tickInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(tickInterval);
        return;
      }
      setFlipperTick((prev) => !prev);
      if (soundEnabled) {
        playClickSound(audioCtxRef.current);
      }
    }, 95);

    // Fetch non-repeating matching experience
    const targetSegment = WHEEL_SEGMENTS[targetIdx];
    let resolvedExp: ExperienceDTO | null = null;
    const excludeParam = seenWishIds.join(",");

    try {
      const res = await fetch(
        `/api/wish?category=${targetSegment.category}&mood=${targetSegment.mood}&exclude=${excludeParam}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.experience) {
          resolvedExp = data.experience;
        }
      }
    } catch {}

    // Fallback guaranteed non-repeating selection
    if (!resolvedExp) {
      if (targetSegment.category === "shameful_acts" || targetSegment.category === "public_acts") {
        try {
          const { getRandomChallenge } = await import("@/lib/challenges");
          const picked = getRandomChallenge(targetSegment.category as "shameful_acts" | "public_acts");
          const numId = (targetSegment.category === "shameful_acts" ? 100000 : 200000) + (parseInt(picked.challenge.id.replace(/\D/g, ""), 10) || 1);
          resolvedExp = {
            id: numId,
            title: picked.challenge.title,
            description: picked.challenge.description,
            category: picked.challenge.category,
            mood: "crazy",
            difficulty: picked.challenge.difficulty === "Extreme" ? 5 : picked.challenge.difficulty === "Hard" ? 3 : 2,
            budget: 0,
            time: picked.challenge.duration.includes("second") ? "10min" : "30min",
            energy: "active",
            location: picked.challenge.location.toLowerCase(),
            social: picked.challenge.category === "public_acts" ? "strangers" : "friends",
            safety: picked.challenge.safety_note || "safe",
            reel: picked.challenge.reel_potential,
            completions: 1400,
            tags: picked.challenge.tags.join(", "),
          };
        } catch {}
      }

      if (!resolvedExp) {
        const { RICH_EXPERIENCES } = await import("@/lib/experiences-catalog");
        const unusedInCat = RICH_EXPERIENCES.filter(
          (e) => e.category === targetSegment.category && !seenWishIds.includes(e.id)
        );
        const pool =
          unusedInCat.length > 0
            ? unusedInCat
            : RICH_EXPERIENCES.filter((e) => !seenWishIds.includes(e.id));

        if (pool.length > 0) {
          resolvedExp = pool[Math.floor(Math.random() * pool.length)];
        } else {
          // In the rare event user saw all 53+ catalog wishes, pick any from catalog
          resolvedExp = RICH_EXPERIENCES[Math.floor(Math.random() * RICH_EXPERIENCES.length)];
        }
      }
    }

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWinningIndex(targetIdx);
      setSelectedExperience(resolvedExp);
      if (soundEnabled) {
        playWinChime(audioCtxRef.current);
      }
      if (onSelectWish && resolvedExp) {
        onSelectWish(resolvedExp);
      }

      // Add to seen wishes so it NEVER repeats on future spins
      if (resolvedExp) {
        setSeenWishIds((prev) => {
          const next = [...prev.filter((id) => id !== resolvedExp!.id), resolvedExp!.id];
          try {
            localStorage.setItem("tdbd-seen-wishes", JSON.stringify(next));
          } catch {}
          return next;
        });
      }

      // Increment spin count in localStorage
      try {
        const curSpins = Number(localStorage.getItem("tdbd-spins") ?? "0") || 0;
        localStorage.setItem("tdbd-spins", String(curSpins + 1));
        window.dispatchEvent(new Event("tdbd-update"));
      } catch {}
    }, duration);
  }, [
    isSpinning,
    isLoggedIn,
    rotation,
    numSegments,
    segmentAngle,
    selectedActivityCategory,
    initialCategory,
    soundEnabled,
    seenWishIds,
    onSelectWish,
  ]);

  const saveCurrent = () => {
    if (!selectedExperience) return;
    if (saved.includes(selectedExperience.id)) return;
    const next = [...saved, selectedExperience.id];
    setSaved(next);
    try {
      localStorage.setItem("tdbd-saved", JSON.stringify(next));
      window.dispatchEvent(new Event("tdbd-update"));
    } catch {}
  };

  const shareWish = () => {
    if (!selectedExperience) return;
    const text = `I just spun: "${selectedExperience.title}" — One life. Do something with it!`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate SVG path for a circular sector
  const radius = 190;
  const center = 210;

  const round2 = (num: number) => Math.round(num * 100) / 100;

  const sectorPaths = useMemo(() => {
    return WHEEL_SEGMENTS.map((seg, i) => {
      const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);

      const x1 = round2(center + radius * Math.cos(startAngle));
      const y1 = round2(center + radius * Math.sin(startAngle));
      const x2 = round2(center + radius * Math.cos(endAngle));
      const y2 = round2(center + radius * Math.sin(endAngle));

      const largeArc = segmentAngle > 180 ? 1 : 0;
      const pathD = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      // Text position angle
      const midAngle = round2((i + 0.5) * segmentAngle - 90);
      const textRadius = radius * 0.68;
      const textAngleRad = midAngle * (Math.PI / 180);
      const tx = round2(center + textRadius * Math.cos(textAngleRad));
      const ty = round2(center + textRadius * Math.sin(textAngleRad));

      return {
        ...seg,
        index: i,
        pathD,
        tx,
        ty,
        midAngle,
      };
    });
  }, [segmentAngle, center, radius]);

  // Decorative outer lights (pegs)
  const outerPegs = useMemo(() => {
    const totalPegs = numSegments * 2;
    return Array.from({ length: totalPegs }, (_, i) => {
      const angle = (i * (360 / totalPegs) - 90) * (Math.PI / 180);
      const pegRadius = radius + 11;
      return {
        x: round2(center + pegRadius * Math.cos(angle)),
        y: round2(center + pegRadius * Math.sin(angle)),
        index: i,
      };
    });
  }, [numSegments, center, radius]);

  const activeSegment = winningIndex !== null ? WHEEL_SEGMENTS[winningIndex] : null;

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Activity Type Selection Bar */}
      <div className="mb-6 w-full max-w-2xl">
        <div className="flex items-center justify-between px-2 pb-2">
          <label className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
            Select Activity Type To Spin
          </label>
          <span className="text-[11px] text-cream/50">
            {selectedActivityCategory === "all"
              ? "Surprise me (All 12 realms)"
              : selectedActivityCategory === "shameful_acts"
              ? "😳 Shameful Acts (1,000 Dares)"
              : selectedActivityCategory === "public_acts"
              ? "🔥 Public Acts (1,000 Dares)"
              : `Filtered: ${selectedActivityCategory}`}
          </span>
        </div>

        {/* Featured Prominent Category Badges for Shameful & Public Acts */}
        <div className="mb-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setSelectedActivityCategory((prev) =>
                prev === "shameful_acts" ? "all" : "shameful_acts"
              )
            }
            className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-300 ${
              selectedActivityCategory === "shameful_acts"
                ? "border-purple-400 bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 text-white shadow-[0_8px_25px_rgba(168,85,247,0.45)] ring-2 ring-purple-400"
                : "border-purple-500/30 bg-purple-950/40 text-purple-200 hover:border-purple-400 hover:bg-purple-900/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-lg shadow-inner">
                😳
              </span>
              <div className="text-left">
                <div className="flex items-center gap-1.5 font-bold text-sm leading-tight text-white">
                  Shameful Acts
                  <span className="rounded-full bg-purple-400/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-purple-300 uppercase">
                    1,000 Dares
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/70">
                  Can You Handle the Embarrassment?
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase transition-all ${
                selectedActivityCategory === "shameful_acts"
                  ? "bg-white text-purple-900"
                  : "bg-purple-500/20 text-purple-300 group-hover:bg-purple-500/40"
              }`}
            >
              {selectedActivityCategory === "shameful_acts" ? "Active" : "Select"}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedActivityCategory((prev) =>
                prev === "public_acts" ? "all" : "public_acts"
              )
            }
            className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-300 ${
              selectedActivityCategory === "public_acts"
                ? "border-orange-400 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-[0_8px_25px_rgba(234,88,12,0.45)] ring-2 ring-orange-400"
                : "border-orange-500/30 bg-orange-950/40 text-orange-200 hover:border-orange-400 hover:bg-orange-900/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/20 text-lg shadow-inner">
                🔥
              </span>
              <div className="text-left">
                <div className="flex items-center gap-1.5 font-bold text-sm leading-tight text-white">
                  Public Acts
                  <span className="rounded-full bg-orange-400/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-orange-300 uppercase">
                    1,000 Dares
                  </span>
                </div>
                <p className="text-[11px] text-orange-200/70">
                  Do It in Public. If You Dare.
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase transition-all ${
                selectedActivityCategory === "public_acts"
                  ? "bg-white text-orange-900"
                  : "bg-orange-500/20 text-orange-300 group-hover:bg-orange-500/40"
              }`}
            >
              {selectedActivityCategory === "public_acts" ? "Active" : "Select"}
            </span>
          </button>
        </div>

        {/* Existing Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-2">
          {[
            { id: "all", label: "🎲 All Types" },
            { id: "adventure", label: "🧭 Adventure" },
            { id: "crazy", label: "🔥 Crazy Stunts" },
            { id: "create", label: "🎨 Creative Art" },
            { id: "fun", label: "😂 Random Fun" },
            { id: "growth", label: "🧠 Mind & Growth" },
            { id: "kindness", label: "🤝 Kindness" },
            { id: "spiritual", label: "✨ Soul & Silence" },
            { id: "physical", label: "⚡ Body Quest" },
          ].map((act) => {
            const active = selectedActivityCategory === act.id;
            return (
              <button
                type="button"
                key={act.id}
                onClick={() => setSelectedActivityCategory(act.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-gold text-coal font-bold shadow-[0_2px_10px_rgba(212,168,67,0.35)]"
                    : "text-cream/70 hover:bg-white/10 hover:text-cream"
                }`}
              >
                {act.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sound toggle & quick instructions */}
      <div className="mb-4 flex w-full max-w-md items-center justify-between px-2 text-xs font-semibold text-cream/60">
        <span className="flex items-center gap-1.5 text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          Click SPIN or the wheel center to roll
        </span>
        <button
          type="button"
          onClick={() => setSoundEnabled((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-cream/70 transition-colors hover:border-gold hover:text-cream"
          title={soundEnabled ? "Mute spin sound" : "Enable spin sound"}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="h-3.5 w-3.5 text-gold" /> Sound ON
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5 text-cream/40" /> Sound OFF
            </>
          )}
        </button>
      </div>

      {/* Wheel Circle Container */}
      <div className="relative flex items-center justify-center">
        {/* Glow halo behind wheel */}
        <div
          className={`pointer-events-none absolute h-[440px] w-[440px] rounded-full transition-all duration-700 sm:h-[480px] sm:w-[480px] ${
            isSpinning
              ? "bg-gradient-to-tr from-gold/30 via-rose-500/20 to-purple-600/30 blur-3xl animate-pulse"
              : "bg-gold/15 blur-2xl"
          }`}
        />

        {/* Top Pointer / Ticker Arrow at 12 o'clock */}
        <div className="pointer-events-none absolute top-1 z-30 flex flex-col items-center">
          <motion.div
            animate={{
              rotate: isSpinning ? (flipperTick ? -12 : 12) : 0,
              scale: isSpinning ? 1.08 : 1,
            }}
            transition={{ type: "spring", stiffness: 600, damping: 20 }}
            className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          >
            <svg width="42" height="46" viewBox="0 0 42 46" fill="none">
              <path
                d="M21 44L7 6C5.5 3 7.8 0 11.2 0H30.8C34.2 0 36.5 3 35 6L21 44Z"
                fill="url(#pointerGoldGrad)"
                stroke="#211d19"
                strokeWidth="2.5"
              />
              <circle cx="21" cy="9" r="4.5" fill="#211d19" />
              <defs>
                <linearGradient id="pointerGoldGrad" x1="21" y1="0" x2="21" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fde047" />
                  <stop offset="0.5" stopColor="#d4a843" />
                  <stop offset="1" stopColor="#a16207" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* SVG Wheel Circle */}
        <div className="relative p-2">
          <svg
            ref={wheelRef}
            suppressHydrationWarning
            width="420"
            height="420"
            viewBox="0 0 420 420"
            className="touch-none select-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.6)] sm:w-[430px] sm:h-[430px]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 4.4s cubic-bezier(0.12, 0.88, 0.2, 1)"
                : "none",
            }}
          >
            <defs>
              {/* Outer rim metallic gradient */}
              <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="#2b2620" />
                <stop offset="93%" stopColor="#d4a843" />
                <stop offset="97%" stopColor="#584824" />
                <stop offset="100%" stopColor="#211d19" />
              </radialGradient>
            </defs>

            {/* Outer Rim Circle */}
            <circle cx={center} cy={center} r={radius + 18} fill="url(#rimGrad)" stroke="#d4a843" strokeWidth="4" />

            {/* Sector Wedges */}
            <g id="wheel-wedges">
              {sectorPaths.map((seg) => {
                const isSelected = winningIndex === seg.index;
                return (
                  <g key={seg.id} className="cursor-pointer" onClick={!isSpinning ? spin : undefined}>
                    <path
                      d={seg.pathD}
                      fill={seg.color}
                      stroke="#211d19"
                      strokeWidth="2.5"
                      className="transition-opacity duration-300 hover:opacity-95"
                    />

                    {/* Sector Text & Icon */}
                    <g
                      transform={`translate(${seg.tx}, ${seg.ty}) rotate(${seg.midAngle + 90})`}
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      <text
                        fill={seg.textColor}
                        fontSize="12.5"
                        fontWeight="900"
                        letterSpacing="0.08em"
                        fontFamily="var(--font-sans), sans-serif"
                        className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                      >
                        {seg.shortLabel}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Decorative golden pegs/rivets along the outer rim */}
            <g id="wheel-pegs">
              {outerPegs.map((peg) => (
                <circle
                  key={peg.index}
                  cx={peg.x}
                  cy={peg.y}
                  r="3.5"
                  fill={isSpinning ? "#fef08a" : "#d4a843"}
                  stroke="#211d19"
                  strokeWidth="1.5"
                  className={isSpinning ? "animate-pulse" : ""}
                />
              ))}
            </g>

            {/* Subtle inner ring divider */}
            <circle
              cx={center}
              cy={center}
              r={radius * 0.44}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Center Hub Button (Fixed position over wheel center) */}
          <button
            type="button"
            onClick={spin}
            disabled={isSpinning}
            aria-label="Spin the wheel"
            className="group absolute top-1/2 left-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full border-4 border-coal bg-gradient-to-b from-amber-300 via-gold to-amber-700 shadow-[0_6px_25px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.7)] transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center justify-center">
              <Dices
                className={`h-7 w-7 text-coal transition-transform ${
                  isSpinning ? "animate-spin" : "group-hover:rotate-45"
                }`}
              />
              <span className="mt-0.5 text-[12px] font-black tracking-widest text-coal uppercase">
                {isSpinning ? "ROLL" : "SPIN"}
              </span>
            </div>
            {/* Center ring flare */}
            <div className="absolute inset-0.5 rounded-full border border-white/50 pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="mt-7 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gold px-10 py-4 text-lg font-black tracking-wide text-coal shadow-[0_16px_40px_rgba(212,168,67,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(212,168,67,0.55)] active:translate-y-0 disabled:opacity-75"
        >
          {isReady && !isLoggedIn ? (
            <Lock className="h-6 w-6" />
          ) : (
            <Dices className={`h-6 w-6 ${isSpinning ? "animate-spin" : "group-hover:rotate-180 transition-transform"}`} />
          )}
          <span>
            {isSpinning
              ? "Spinning Wheel of Life…"
              : isReady && !isLoggedIn
              ? "LOGIN TO SPIN"
              : "SPIN THE CIRCLE"}
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cream opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cream"></span>
          </span>
        </button>

        <p className="text-center text-xs text-cream/50">
          {isReady && !isLoggedIn
            ? "Create a free profile (+150 XP) or sign in to spin the wheel"
            : "10 unique life realms · Over 2,000 hand-picked experiences"}
        </p>
      </div>

      {/* Login required modal */}
      <AnimatePresence>
        {showLoginPrompt && !isLoggedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-coal/80 p-4 backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Login required to spin"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-gold/40 bg-coal-2 p-7 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:p-9"
            >
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                aria-label="Close"
                className="absolute top-4 right-4 text-cream/40 transition-colors hover:text-cream"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="font-display mt-5 text-2xl font-semibold text-cream">Login to spin the wheel</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-cream/70">
                Spinning is for members only. Create a free profile to get{" "}
                <span className="font-bold text-gold">+150 XP</span>, spin the wheel, and earn XP for every
                challenge you complete.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={`/login?next=${encodeURIComponent(pathname || "/spin")}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-coal transition-all hover:brightness-110"
                >
                  Create Profile / Login
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLoginPrompt(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-cream/70 transition-colors hover:border-gold hover:text-gold"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winning Experience Full-Screen Modal Popup */}
      <AnimatePresence>
        {selectedExperience && !isSpinning && activeSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-coal/85 p-4 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedExperience(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Your spun wish"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-gold/40 bg-coal-2 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.7)] sm:p-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedExperience(null)}
                aria-label="Close wish card"
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-cream/60 transition-colors hover:bg-white/20 hover:text-cream"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Sector match banner */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 pr-8">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
                    style={{ backgroundColor: activeSegment.color }}
                  >
                    <activeSegment.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                      Landed on {activeSegment.label}
                    </span>
                    <p className="text-xs text-cream/60">Your granted wish #{selectedExperience.id}</p>
                  </div>
                </div>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-extrabold text-gold uppercase">
                  {selectedExperience.category}
                </span>
              </div>

              {/* Wish Title & Description */}
              <div className="mt-5">
                <h3 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
                  {selectedExperience.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/75 sm:text-base">
                  {selectedExperience.description}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-cream/40 uppercase">Budget</p>
                  <p className="mt-1 text-xs font-bold text-cream">{budgetLabel(selectedExperience.budget)}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-cream/40 uppercase">Time</p>
                  <p className="mt-1 text-xs font-bold text-cream">{timeLabel(selectedExperience.time)}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-cream/40 uppercase">Difficulty</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= selectedExperience.difficulty ? "fill-gold text-gold" : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-gold/40 bg-gold/15 p-3">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-gold uppercase">Reward Bounty</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-black text-gold">
                    <Zap className="h-3.5 w-3.5" />
                    +{calculateTaskXP(selectedExperience.difficulty, selectedExperience.time)} XP
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {(() => {
                  const taskXp = calculateTaskXP(selectedExperience.difficulty, selectedExperience.time);
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        if (completedIds.includes(selectedExperience.id)) return;
                        setWhatYouDid("");
                        setTimeSpent(timeLabel(selectedExperience.time));
                        setCompletedDate(new Date().toISOString().split("T")[0]);
                        setEvidenceLink("");
                        setEvidenceError("");
                        setEvidenceSuccess(false);
                        setShowEvidenceModal(true);
                      }}
                      disabled={completedIds.includes(selectedExperience.id)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-black transition-all ${
                        completedIds.includes(selectedExperience.id)
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-emerald-500 text-coal hover:bg-emerald-400 shadow-md active:scale-95"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      {completedIds.includes(selectedExperience.id)
                        ? `Verified & Completed (+${taskXp} XP)`
                        : `Submit Proof to Complete (+${taskXp} XP)`}
                    </button>
                  );
                })()}

                <button
                  type="button"
                  onClick={saveCurrent}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold transition-all ${
                    saved.includes(selectedExperience.id)
                      ? "bg-gold/20 text-gold border border-gold/40"
                      : "bg-white/10 text-cream hover:bg-white/15"
                  }`}
                >
                  {saved.includes(selectedExperience.id) ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 text-gold" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      Save Wish
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={shareWish}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-gold" /> Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" /> Share
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedExperience(null);
                    setTimeout(() => spin(), 200);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-coal transition-all hover:brightness-110"
                >
                  <RotateCw className="h-4 w-4" /> Spin Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proof / Evidence Verification Modal */}
      <AnimatePresence>
        {showEvidenceModal && selectedExperience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-coal/85 p-4 backdrop-blur-md overflow-y-auto"
            onClick={() => setShowEvidenceModal(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Proof of wish completion"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-8 w-full max-w-lg rounded-3xl border border-gold/40 bg-coal-2 p-6 text-left shadow-[0_30px_90px_rgba(0,0,0,0.7)] sm:p-8"
            >
              <button
                type="button"
                onClick={() => setShowEvidenceModal(false)}
                aria-label="Close"
                className="absolute top-4 right-4 text-cream/40 transition-colors hover:text-cream"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
                    Challenge Verification
                  </span>
                  <h3 className="font-display text-xl font-bold text-cream">
                    Submit Proof of Completion
                  </h3>
                </div>
              </div>

              <p className="mt-2.5 text-xs text-cream/70">
                To earn XP and maintain integrity on the leaderboard, provide authentic evidence of what you did.
              </p>

              <div className="mt-3.5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-cream/80">
                <div className="truncate mr-3">
                  <span className="font-bold text-gold">Wish: </span>
                  <span>{selectedExperience.title}</span>
                </div>
                <div className="shrink-0 rounded-lg border border-gold/40 bg-gold/15 px-2.5 py-1 text-[11px] font-black text-gold">
                  +{calculateTaskXP(selectedExperience.difficulty, selectedExperience.time)} XP Bounty
                </div>
              </div>

              {evidenceError && (
                <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                  {evidenceError}
                </div>
              )}

              {evidenceSuccess ? (
                <div className="py-8 text-center">
                  <Check className="mx-auto h-12 w-12 text-emerald-400" />
                  <h4 className="font-display mt-3 text-lg font-bold text-cream">
                    Evidence Verified!
                  </h4>
                  <p className="mt-1 text-xs text-gold font-bold">
                    +{calculateTaskXP(selectedExperience.difficulty, selectedExperience.time)} XP Awarded to your profile!
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEvidenceError("");

                    if (!whatYouDid.trim() || whatYouDid.trim().length < 10) {
                      setEvidenceError("Please describe what you actually did (at least 10 characters).");
                      return;
                    }
                    if (!timeSpent.trim()) {
                      setEvidenceError("Please specify how much time it took.");
                      return;
                    }
                    if (!completedDate.trim()) {
                      setEvidenceError("Please specify when you completed this.");
                      return;
                    }
                    if (!evidenceLink.trim()) {
                      setEvidenceError("Please provide a link to video/photo/reel/story proof.");
                      return;
                    }

                    // Format proof link
                    let formattedLink = evidenceLink.trim();
                    if (!formattedLink.startsWith("http://") && !formattedLink.startsWith("https://")) {
                      formattedLink = `https://${formattedLink}`;
                    }

                    submitEvidence({
                      expId: selectedExperience.id,
                      expTitle: selectedExperience.title,
                      category: selectedExperience.category,
                      whatYouDid: whatYouDid.trim(),
                      timeSpent: timeSpent.trim(),
                      completedDate: completedDate.trim(),
                      evidenceLink: formattedLink,
                      xpEarned: calculateTaskXP(selectedExperience.difficulty, selectedExperience.time),
                    });

                    setCompletedIds((prev) => [...prev, selectedExperience.id]);
                    setEvidenceSuccess(true);
                    setTimeout(() => {
                      setShowEvidenceModal(false);
                      setEvidenceSuccess(false);
                    }, 1400);
                  }}
                  className="mt-4 space-y-3.5 text-xs"
                >
                  {/* 1. What you did */}
                  <div>
                    <label className="block font-bold text-cream/70 uppercase tracking-wider">
                      1. What did you do? <span className="text-gold">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={whatYouDid}
                      onChange={(e) => setWhatYouDid(e.target.value)}
                      placeholder="e.g. Woke up at 5:15 AM, climbed the eastern ridge, and watched the fog burn off."
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream placeholder-cream/35 focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* 2. How much time + 3. When */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-bold text-cream/70 uppercase tracking-wider">
                        2. Time Taken <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={timeSpent}
                        onChange={(e) => setTimeSpent(e.target.value)}
                        placeholder="e.g. 45 mins, 2 hours"
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream placeholder-cream/35 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-cream/70 uppercase tracking-wider">
                        3. Date Completed <span className="text-gold">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={completedDate}
                        onChange={(e) => setCompletedDate(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 4. Link of video / photo */}
                  <div>
                    <label className="block font-bold text-cream/70 uppercase tracking-wider">
                      4. Link of Video / Photo / Reel Proof <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={evidenceLink}
                      onChange={(e) => setEvidenceLink(e.target.value)}
                      placeholder="e.g. instagram.com/reel/..., youtube.com/..., or drive.google.com/..."
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-cream placeholder-cream/35 focus:border-gold focus:outline-none"
                    />
                    <p className="mt-1 text-[10px] text-cream/45">
                      Ensures genuine completion so everyone on the leaderboard has verified achievements.
                    </p>
                  </div>

                  {/* Submit button */}
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEvidenceModal(false)}
                      className="flex-1 rounded-xl border border-white/10 p-3 font-semibold text-cream/60 hover:text-cream"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-2 rounded-xl bg-gold p-3 font-black text-coal hover:brightness-110 shadow-lg"
                    >
                      Verify & Claim +{calculateTaskXP(selectedExperience.difficulty, selectedExperience.time)} XP
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
