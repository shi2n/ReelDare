import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import SpinWheel from "@/components/SpinWheel";
import Spin from "@/components/Spin";
import { Reveal, SectionHeading, MarqueeRow } from "@/components/ui/primitives";
import Link from "next/link";
import { Compass, Dices, Flame, Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Spin Circle — Reel Dare",
  description:
    "Spin the wheel of life. 10 categories, 2,000+ real experiences. One spin decides what you do today.",
};

const MARQUEE_ITEMS = [
  "SPIN THE WHEEL",
  "RANDOM ADVENTURE",
  "RADICAL KINDNESS",
  "CRAZY STUNTS",
  "SOUL & SILENCE",
  "CREATIVE SPARK",
  "BODY QUEST",
  "UNSCRIPTED MEMORIES",
];

export default function SpinPage() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-coal pt-24 pb-20 text-cream">
        {/* Hero Banner */}
        <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:px-6 lg:px-10">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                The Life Roulette
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                The <span className="text-gold italic">Spin Circle</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
                Can't decide what to do today? Let the circle spin. 10 life dimensions, real challenges, zero guilt if
                you skip. Tap the center hub or the gold button to roll.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Ticker marquee */}
        <div className="relative z-10 my-4 -rotate-1 scale-[1.01]">
          <MarqueeRow
            items={MARQUEE_ITEMS}
            className="bg-gold py-3 font-display text-xs font-bold tracking-[0.2em] text-coal"
          />
        </div>

        {/* Interactive Spin Wheel Section */}
        <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="noise relative rounded-[2.5rem] border border-white/10 bg-coal-2 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.6)] sm:p-12">
            <SpinWheel />
          </div>
        </section>

        {/* Features / Why Spin Here */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            kicker="The Rules of the Wheel"
            title={
              <>
                How the <span className="text-gold italic">Wish Engine</span> Works
              </>
            }
            sub="No algorithm trying to keep you scrolling. Just random inspiration engineered to get you outside."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <Dices className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-5 text-xl font-semibold text-cream">True Randomness</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-cream/65">
                Each slice carries an equal, unbiased probability of landing. No sponsored promotions, just pure human experiences.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-5 text-xl font-semibold text-cream">Zero Guilt Skipping</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-cream/65">
                Don't like what you got? Spin again. Life is too short to force an experience that doesn't feel right for this moment.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-5 text-xl font-semibold text-cream">100% Safe & Wholesome</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-cream/65">
                Every prompt in our library is vetted for safety. No illegal stunts, no prank harassments, no social media vanity traps.
              </p>
            </div>
          </div>

          {/* Quick navigation to other pages */}
          <div className="mt-16 rounded-3xl border border-gold/30 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent p-8 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h3 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
                  Prefer browsing by topic?
                </h3>
                <p className="mt-2 text-sm text-cream/70 sm:text-base">
                  Explore all 11 curated categories with sample wishlists and difficulty ratings.
                </p>
              </div>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-coal transition-transform hover:-translate-y-0.5"
              >
                Browse Categories <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
