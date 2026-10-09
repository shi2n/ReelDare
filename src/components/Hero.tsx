"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Compass, Dices } from "lucide-react";
import { Parallax } from "@/components/ui/primitives";
import Link from "next/link";

const VIDEO_HD = "https://videos.pexels.com/video-files/8973321/8973321-hd_1920_1080_24fps.mp4";
const VIDEO_UHD = "https://videos.pexels.com/video-files/8973321/8973321-hd_1920_1080_24fps.mp4";
const POSTER = "https://images.pexels.com/videos/8973321/pexels-photo-8973321.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200";

const ease = [0.22, 1, 0.36, 1] as const;

function Word({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className={`inline-block ${className ?? ""}`}
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  return (
    <section id="top" className="noise relative flex min-h-[100svh] flex-col overflow-hidden bg-coal">
      {/* video backdrop */}
      <div className="absolute inset-0">
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster={POSTER} aria-hidden>
          <source src={VIDEO_HD} type="video/mp4" />
          <source src={VIDEO_UHD} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-coal/85 via-coal/45 to-coal" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_30%,rgba(33,29,25,0.55)_100%)]" />
      </div>

      {/* parallax floating chips */}
      <Parallax speed={0.9} className="absolute top-[22%] left-[6%] hidden lg:block">
        <span className="animate-float-y inline-block rotate-[-6deg] rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-cream backdrop-blur-md">
          Sleep under the stars
        </span>
      </Parallax>
      <Parallax speed={1.5} className="absolute top-[30%] right-[7%] hidden lg:block">
        <span
          className="animate-float-y-slow inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-coal shadow-[0_16px_40px_rgba(212,168,67,0.4)] rotate-[5deg]"
        >
          Talk to 10 strangers
        </span>
      </Parallax>
      <Parallax speed={1.1} className="absolute bottom-[26%] left-[10%] hidden lg:block">
        <span className="inline-block rotate-[-4deg] rounded-full border border-gold/40 bg-gold/15 px-5 py-2.5 text-sm font-semibold text-gold backdrop-blur-md">
          Make your first Reel
        </span>
      </Parallax>
      <Parallax speed={1.8} className="absolute right-[12%] bottom-[20%] hidden lg:block">
        <span className="animate-float-y inline-block rotate-[7deg] rounded-full bg-white/90 px-5 py-2.5 text-sm font-bold text-coal">
          Learn something useless
        </span>
      </Parallax>

      {/* content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pt-32 pb-24 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-[11px] font-bold tracking-[0.24em] text-gold uppercase backdrop-blur-md"
        >
          <Dices className="h-4 w-4" aria-hidden />
          One life. Don't just live it — do something with it
        </motion.p>

        <h1 className="font-display leading-[0.95] font-semibold tracking-tight text-cream">
          <span className="block text-[14.5vw] sm:text-[12vw] lg:text-[9.5rem]">
            <Word delay={0.25}>REEL</Word>{" "}
            <Word delay={0.45} className="text-gold italic">
              DARE
            </Word>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-cream/80 sm:text-xl"
        >
          You don't need another reason to wait.{" "}
          <span className="text-cream font-semibold">Find something you've never done. Do it. Remember it.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/spin"
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-base font-bold text-coal shadow-[0_18px_50px_rgba(212,168,67,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(212,168,67,0.55)]"
          >
            <Dices className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[180deg]" aria-hidden />
            Spin The Circle
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center gap-3 rounded-full border border-cream/30 bg-white/5 px-8 py-4 text-base font-bold text-cream backdrop-blur-md transition-all hover:border-cream/60 hover:bg-white/10"
          >
            <Compass className="h-5 w-5" aria-hidden />
            Explore categories
          </Link>
          <Link
            href="/my-life"
            className="group inline-flex items-center gap-2 px-2 py-4 text-sm font-bold tracking-wide text-cream/70 uppercase transition-colors hover:text-gold"
          >
            Build my 100
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-semibold text-cream/60"
        >
          <span>
            <span className="font-display text-xl font-semibold text-gold">2,000+</span> experiences to steal
          </span>
          <span className="hidden h-4 w-px bg-cream/20 sm:block" />
          <span>
            <span className="font-display text-xl font-semibold text-gold">1.2M</span> memories made
          </span>
          <span className="hidden h-4 w-px bg-cream/20 sm:block" />
          <span>
            <span className="font-display text-xl font-semibold text-gold">63</span> countries pinned
          </span>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-label="Scroll to the wish engine"
      >
        <span className="flex flex-col items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-cream/50 uppercase">
          Scroll
          <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-cream/30 pt-2">
            <ChevronDown className="h-4 w-4 animate-bounce text-gold" aria-hidden />
          </span>
        </span>
      </motion.a>
    </section>
  );
}
