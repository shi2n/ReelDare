import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import Features from "@/components/Features";
import Modes from "@/components/Modes";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import { Sparkles, Dices, Film, Trophy, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features & Modes of Living — Reel Dare",
  description:
    "Explore Reel Mode, the 6 Modes of Living, My 100 Life Dashboard, and the wish engine that turns idle days into unforgettable memories.",
};

export default function FeaturesPage() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-coal pt-24 pb-20 text-cream">
        {/* Header */}
        <section className="relative overflow-hidden px-4 pt-12 pb-10 sm:px-6 lg:px-10">
          <div className="pointer-events-none absolute top-10 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                The System
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Engineered for <span className="text-gold italic">Real Living</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
                Most apps are designed to steal your attention and keep you looking at a screen. We built an anti-doomscroll
                engine that pushes you back out into reality.
              </p>
            </Reveal>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/spin"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-coal transition-transform hover:-translate-y-0.5"
              >
                <Dices className="h-4 w-4" /> Try the Spin Wheel
              </Link>
              <Link
                href="/my-life"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-cream transition-colors hover:border-gold hover:text-gold"
              >
                Explore My Life
              </Link>
            </div>
          </div>
        </section>

        {/* 6 Modes */}
        <div className="border-y border-white/10 bg-coal-2">
          <Modes />
        </div>

        {/* Deep Dive Features */}
        <Features />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
