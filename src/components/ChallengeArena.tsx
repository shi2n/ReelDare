"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dices,
  Flame,
  Sparkles,
  Trophy,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Video,
  CheckCircle2,
  Bookmark,
  Share2,
  Camera,
  X,
  Upload,
  Heart,
  Volume2,
  VolumeX,
  Filter,
  Check,
  ChevronRight,
} from "lucide-react";
import { ChallengeTask, ChallengeFilters } from "@/lib/challenges";
import { useUser } from "@/lib/user";
import Link from "next/link";

interface ChallengeArenaProps {
  category: "shameful_acts" | "public_acts";
}

export default function ChallengeArena({ category }: ChallengeArenaProps) {
  const { user, awardXP } = useUser();
  const isShameful = category === "shameful_acts";

  // Visual Theme Variables
  const theme = isShameful
    ? {
        accent: "from-purple-500 via-pink-500 to-rose-500",
        border: "border-purple-500/30",
        bgBadge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        glow: "shadow-[0_0_50px_rgba(168,85,247,0.35)]",
        btnColor: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white",
        meterFill: "bg-gradient-to-r from-purple-400 to-pink-500",
        titleColor: "text-purple-400",
        tagline: "Can You Handle the Embarrassment?",
        taglineSub: "1,000 cringe-worthy, awkward, and confidence-testing challenges to obliterate your comfort zone.",
        emoji: "😳",
        name: "Shameful Acts",
        storageKey: "reeldare_seen_shameful",
      }
    : {
        accent: "from-amber-500 via-orange-500 to-red-500",
        border: "border-orange-500/30",
        bgBadge: "bg-orange-500/15 text-orange-300 border-orange-500/30",
        glow: "shadow-[0_0_50px_rgba(249,115,22,0.35)]",
        btnColor: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white",
        meterFill: "bg-gradient-to-r from-amber-400 to-orange-500",
        titleColor: "text-orange-400",
        tagline: "Do It in Public. If You Dare.",
        taglineSub: "1,000 bold, respectful, street-smart dares designed to build unshakable real-world confidence.",
        emoji: "🔥",
        name: "Public Acts",
        storageKey: "reeldare_seen_public",
      };

  // State
  const [currentTask, setCurrentTask] = useState<ChallengeTask | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showReelStudio, setShowReelStudio] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Reel Studio State
  const [reelHook, setReelHook] = useState("");
  const [reelCaption, setReelCaption] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Sound synthesis
  const playSound = (freq = 440, type: OscillatorType = "sine", duration = 0.15) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {}
  };

  // Load seen IDs from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(theme.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSeenIds(parsed);
      }
    } catch {}

    // Initial spin on load
    spinTask();
  }, [category]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      playSound(880, "triangle", 0.5);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Set timer default when current task changes
  useEffect(() => {
    if (currentTask) {
      setTimerRunning(false);
      const dur = currentTask.duration.toLowerCase();
      if (dur.includes("30 second")) setTimerSeconds(30);
      else if (dur.includes("45 second")) setTimerSeconds(45);
      else if (dur.includes("90 second")) setTimerSeconds(90);
      else if (dur.includes("1 minute")) setTimerSeconds(60);
      else if (dur.includes("2 minute")) setTimerSeconds(120);
      else if (dur.includes("3 minute")) setTimerSeconds(180);
      else if (dur.includes("5 minute")) setTimerSeconds(300);
      else if (dur.includes("10 minute")) setTimerSeconds(600);
      else setTimerSeconds(120);

      // Setup reel defaults
      setReelHook(
        isShameful
          ? `I spun the Shameful Wheel and got this awkward dare: "${currentTask.title}"...`
          : `I took a public dare from Reel Dare: "${currentTask.title}"...`
      );
      setReelCaption(
        `Crushing the "${currentTask.title}" challenge on #ReelDare! ${isShameful ? "#ShamefulActs #FaceTheCringe" : "#PublicActs #ComfortZone"} @reeldare`
      );
    }
  }, [currentTask]);

  // Spin function
  const spinTask = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    playSound(350, "sine", 0.1);

    // Audio clicks during spin
    let spinStep = 0;
    const clickInterval = setInterval(() => {
      spinStep++;
      playSound(300 + spinStep * 20, "sine", 0.05);
      if (spinStep > 8) clearInterval(clickInterval);
    }, 120);

    try {
      const query = new URLSearchParams({
        category,
        spin: "true",
        exclude: seenIds.join(","),
        difficulty: difficultyFilter !== "all" ? difficultyFilter : "",
        location: locationFilter !== "all" ? locationFilter : "",
        duration: durationFilter !== "all" ? durationFilter : "",
      });

      const res = await fetch(`/api/challenges?${query.toString()}`);
      const data = await res.json();

      setTimeout(() => {
        clearInterval(clickInterval);
        if (data?.challenge) {
          setCurrentTask(data.challenge);
          const nextSeen = [...seenIds, data.challenge.id];
          setSeenIds(nextSeen);
          try {
            localStorage.setItem(theme.storageKey, JSON.stringify(nextSeen.slice(-800)));
          } catch {}
          setSpinCount((prev) => prev + 1);
          playSound(650, "triangle", 0.3);
        }
        setIsSpinning(false);
      }, 1100);
    } catch {
      setIsSpinning(false);
    }
  };

  // Complete Challenge action
  const handleComplete = async () => {
    if (!currentTask) return;
    playSound(587, "sine", 0.2);
    setTimeout(() => playSound(880, "triangle", 0.4), 150);

    // Calculate XP
    const xp = currentTask.difficulty === "Extreme" ? 350 : currentTask.difficulty === "Hard" ? 220 : currentTask.difficulty === "Medium" ? 150 : 100;
    awardXP(xp, `Completed ${isShameful ? "Shameful Act" : "Public Act"}: ${currentTask.title}`);
    setCompletedCount((prev) => prev + 1);
    setShowCompletionModal(true);
  };

  // Save for Later
  const handleSaveForLater = () => {
    if (!currentTask) return;
    try {
      const raw = localStorage.getItem("tdbd-saved-challenges") || "[]";
      const savedList = JSON.parse(raw);
      if (!savedList.some((c: { id: string }) => c.id === currentTask.id)) {
        savedList.push({
          id: currentTask.id,
          title: currentTask.title,
          category: currentTask.category,
          difficulty: currentTask.difficulty,
          savedAt: new Date().toISOString(),
        });
        localStorage.setItem("tdbd-saved-challenges", JSON.stringify(savedList));
        window.dispatchEvent(new Event("tdbd-update"));
      }
    } catch {}
    setSavedSuccess(true);
    playSound(520, "sine", 0.15);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Camera recording functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        stopStream();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Unable to access camera or microphone. Please check browser permissions or upload a video file instead.");
    }
  };

  const stopCameraRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedVideoUrl(url);
    }
  };

  return (
    <div className="relative min-h-screen bg-coal px-4 pt-24 pb-24 text-cream selection:bg-gold selection:text-coal">
      {/* Background Ambience */}
      <div
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(147,51,234,0.18),transparent)] ${
          !isShameful ? "bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(234,88,12,0.2),transparent)]" : ""
        }`}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Navigation back and sound toggle */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-cream/70 hover:bg-white/10 hover:text-cream transition-all"
          >
            ← All Categories
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label="Toggle Sound"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-cream/70 hover:text-cream hover:bg-white/10 transition-colors"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-gold" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-cream/80 hover:bg-white/10 transition-colors"
            >
              <Filter className="h-3.5 w-3.5 text-gold" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Header Card */}
        <div className={`relative overflow-hidden rounded-3xl border ${theme.border} bg-coal-2/80 p-8 sm:p-10 backdrop-blur-xl ${theme.glow}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold">
                <span>{theme.emoji} Official Category</span>
                <span className="text-white/30">•</span>
                <span className="font-mono text-emerald-400">1,000 Verified Tasks</span>
              </div>
              <h1 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                {theme.name}
              </h1>
              <p className={`mt-2 font-display text-xl sm:text-2xl font-semibold italic ${theme.titleColor}`}>
                “{theme.tagline}”
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-base">
                {theme.taglineSub}
              </p>
            </div>

            {/* Quick Stats Box */}
            <div className="flex shrink-0 flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-right sm:min-w-[180px]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-cream/40">Catalog Pool</p>
                <p className="font-display text-3xl font-black text-gold">1,000</p>
              </div>
              <div className="border-t border-white/10 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-cream/40">Dares Explored</p>
                <p className="text-base font-bold text-cream">
                  {seenIds.length} <span className="text-xs text-cream/40">/ 1000</span>
                </p>
              </div>
              <div className="border-t border-white/10 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-cream/40">Dares Crushed</p>
                <p className="text-base font-bold text-emerald-400">
                  {completedCount} <span className="text-xs text-cream/40">done</span>
                </p>
              </div>
            </div>
          </div>

          {/* Filter Bar Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 border-t border-white/10 pt-6"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-bold text-cream/50 uppercase">Difficulty</label>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-coal px-3 py-2 text-xs font-semibold text-cream"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy (Mild Awkwardness)</option>
                      <option value="medium">Medium (Noticeable Effort)</option>
                      <option value="hard">Hard (Embarrassment Test)</option>
                      <option value="extreme">Extreme (Psychological Bravery)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-cream/50 uppercase">Location</label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-coal px-3 py-2 text-xs font-semibold text-cream"
                    >
                      <option value="all">All Locations</option>
                      <option value="home">Home / Indoors</option>
                      <option value="private">Private Space</option>
                      <option value="public">Public / Open Air</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-cream/50 uppercase">Duration</label>
                    <select
                      value={durationFilter}
                      onChange={(e) => setDurationFilter(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-coal px-3 py-2 text-xs font-semibold text-cream"
                    >
                      <option value="all">Any Duration</option>
                      <option value="quick">Quick (&lt; 2 minutes)</option>
                      <option value="medium">Medium (2 – 5 minutes)</option>
                      <option value="long">Extended (10 – 30 minutes)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Big Animated Wheel & Challenge Display */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {isSpinning ? (
              <motion.div
                key="spinning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-coal-2/60 p-16 text-center backdrop-blur-xl"
              >
                <div className="relative">
                  <div className={`h-24 w-24 animate-spin rounded-full border-4 border-dashed border-gold ${theme.glow}`} />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">
                    {theme.emoji}
                  </div>
                </div>
                <h3 className="font-display mt-6 text-2xl font-bold text-cream">
                  Summoning Your Next Dare...
                </h3>
                <p className="mt-2 text-sm text-cream/50">
                  Filtering 1,000 unique challenges to find something you have never attempted.
                </p>
              </motion.div>
            ) : currentTask ? (
              <motion.div
                key={currentTask.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={`relative overflow-hidden rounded-3xl border ${theme.border} bg-coal-2 p-7 sm:p-10 shadow-2xl`}
              >
                {/* Header Tag Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gold">#{currentTask.id}</span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-[11px] font-black uppercase tracking-wider ${
                        currentTask.difficulty === "Extreme"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : currentTask.difficulty === "Hard"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : currentTask.difficulty === "Medium"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {currentTask.difficulty}
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-cream/60">
                      📍 {currentTask.location}
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-cream/60">
                      ⏱️ {currentTask.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-cream/50">
                    <Video className="h-3.5 w-3.5 text-gold" />
                    <span>Reel Potential: <strong className="text-gold">{currentTask.reel_potential}/10</strong></span>
                  </div>
                </div>

                {/* Main Challenge Content */}
                <div className="py-6">
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-cream">
                    {currentTask.title}
                  </h2>
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-cream/80">
                    {currentTask.description}
                  </p>

                  {/* Safety Guidance Callout */}
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs text-cream/70">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <strong className="text-cream block font-bold">Safety & Respect Rule:</strong>
                      <span>{currentTask.safety_note}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Meters Grid */}
                <div className="grid gap-4 sm:grid-cols-3 border-t border-white/10 pt-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-cream/50 uppercase">Embarrassment</span>
                      <span className="text-rose-400 font-mono">{currentTask.embarrassment_level} / 10</span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-rose-500 to-red-600 transition-all duration-500"
                        style={{ width: `${currentTask.embarrassment_level * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-cream/50 uppercase">Social Intensity</span>
                      <span className="text-orange-400 font-mono">{currentTask.social_intensity} / 10</span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-500 transition-all duration-500"
                        style={{ width: `${currentTask.social_intensity * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-cream/50 uppercase">Reel Viral Factor</span>
                      <span className="text-gold font-mono">{currentTask.reel_potential} / 10</span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-gold transition-all duration-500"
                        style={{ width: `${currentTask.reel_potential * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Countdown Timer Widget */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cream/40">Execution Countdown</p>
                      <p className="font-mono text-2xl font-black text-cream">
                        {Math.floor(timerSeconds / 60)}:
                        {String(timerSeconds % 60).padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-xs font-bold text-coal hover:brightness-110 transition-all"
                    >
                      {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      {timerRunning ? "Pause" : "Start Timer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(60);
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 p-2 text-cream/60 hover:text-cream hover:bg-white/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-coal shadow-lg hover:bg-emerald-400 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Challenge (+XP)
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReelStudio(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3.5 text-sm font-bold text-gold hover:bg-gold/20 transition-all"
                  >
                    <Camera className="h-4 w-4" />
                    Record Reel Studio
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveForLater}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-cream/70 hover:bg-white/10 hover:text-cream transition-all"
                  >
                    <Bookmark className="h-4 w-4" />
                    {savedSuccess ? "Saved to My 100!" : "Save for Later"}
                  </button>

                  <button
                    type="button"
                    onClick={spinTask}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-cream/70 hover:bg-white/10 hover:text-cream transition-all ml-auto"
                  >
                    Skip Challenge →
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Big High-Impact Spin Button */}
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={spinTask}
              disabled={isSpinning}
              className={`group relative inline-flex items-center gap-4 rounded-full px-12 py-5 text-xl font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${theme.btnColor} ${theme.glow}`}
            >
              <Dices className={`h-7 w-7 ${isSpinning ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              <span>SPIN {theme.name.toUpperCase()}</span>
              <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-mono">1,000 TASKS</span>
            </button>
            <p className="mt-3 text-xs text-cream/40">
              Non-repeating algorithm. Every spin draws a fresh, untried dare from the 1,000 task library.
            </p>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl border border-emerald-500/40 bg-coal-2 p-8 text-center shadow-2xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Trophy className="h-8 w-8 animate-bounce" />
            </div>
            <h3 className="font-display mt-5 text-2xl font-bold text-cream">
              DARE COMPLETED!
            </h3>
            <p className="mt-2 text-sm text-cream/70">
              You had the guts to conquer <strong>"{currentTask.title}"</strong>.
            </p>

            <div className="my-6 rounded-2xl border border-gold/30 bg-gold/10 p-4">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Reward Earned</span>
              <p className="font-display text-3xl font-black text-gold mt-1">
                +{currentTask.difficulty === "Extreme" ? 350 : currentTask.difficulty === "Hard" ? 220 : 150} XP
              </p>
              <p className="text-[11px] text-cream/60 mt-1">Added to your explorer rank profile.</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  setShowReelStudio(true);
                }}
                className="w-full rounded-xl bg-gold py-3 text-xs font-bold text-coal hover:brightness-110"
              >
                Upload / Record Reel Proof
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  spinTask();
                }}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-cream/80 hover:bg-white/10"
              >
                Spin Next Dare
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reel Studio Workflow Modal */}
      {showReelStudio && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-coal-2 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/20 text-gold">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-cream">Reel Creation Studio</h3>
                  <p className="text-xs text-cream/50">Capture your proof & create an epic short</p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopStream();
                  setShowReelStudio(false);
                }}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-cream/60 hover:text-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Suggested Hook Card */}
              <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4">
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider">Opening Hook Idea</span>
                <input
                  type="text"
                  value={reelHook}
                  onChange={(e) => setReelHook(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-semibold text-cream"
                />
              </div>

              {/* Shot List Blueprint */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                <span className="font-bold uppercase tracking-wider text-cream/40">Storyboard Blueprint (30s)</span>
                <div className="mt-3 grid gap-2 sm:grid-cols-4">
                  <div className="rounded-xl bg-white/5 p-2.5">
                    <p className="font-bold text-gold">0-3s Hook</p>
                    <p className="mt-1 text-cream/60 text-[11px]">Show the dare screen with your shocked face.</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2.5">
                    <p className="font-bold text-purple-400">4-12s Hesitation</p>
                    <p className="mt-1 text-cream/60 text-[11px]">The awkward setup & deep breath.</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2.5">
                    <p className="font-bold text-orange-400">13-22s The Dare</p>
                    <p className="mt-1 text-cream/60 text-[11px]">Execute the challenge without breaking.</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2.5">
                    <p className="font-bold text-emerald-400">23-30s Victory</p>
                    <p className="mt-1 text-cream/60 text-[11px]">"That's one more Reel Dare completed!"</p>
                  </div>
                </div>
              </div>

              {/* Video Recording / Upload Area */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                {recordedVideoUrl ? (
                  <div className="space-y-3">
                    <video
                      src={recordedVideoUrl}
                      controls
                      className="mx-auto max-h-56 rounded-xl border border-white/10"
                    />
                    <p className="text-xs text-emerald-400 font-bold">✓ Video Recorded / Uploaded Successfully!</p>
                  </div>
                ) : (
                  <div>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className={`mx-auto max-h-56 rounded-xl border border-white/10 ${isRecording ? "block ring-4 ring-rose-500 animate-pulse" : "hidden"}`}
                    />
                    {!isRecording && (
                      <div className="py-6">
                        <Video className="mx-auto h-10 w-10 text-cream/30" />
                        <p className="mt-2 text-xs font-semibold text-cream/70">
                          Record with device camera or upload a video clip
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                    >
                      <Camera className="h-4 w-4" /> Start Camera Recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCameraRecording}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-coal hover:bg-amber-400"
                    >
                      Stop & Save Recording
                    </button>
                  )}

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-cream hover:bg-white/10">
                    <Upload className="h-4 w-4 text-gold" />
                    <span>Upload Video File</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Caption & Hashtags */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-cream/40">Suggested Caption</label>
                <textarea
                  rows={3}
                  value={reelCaption}
                  onChange={(e) => setReelCaption(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-cream"
                />
              </div>

              {/* Submit Reel Button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReelStudio(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-cream/70 hover:bg-white/10"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Reel proof submitted! +150 bonus XP awarded.");
                    awardXP(150, `Reel Studio proof bonus for ${currentTask?.title || "challenge"}`);
                    setShowReelStudio(false);
                  }}
                  className="rounded-xl bg-gold px-6 py-2.5 text-xs font-bold text-coal hover:brightness-110"
                >
                  Save Reel Proof & Claim XP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
