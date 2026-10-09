import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import Categories from "@/components/Categories";
import { CATEGORIES } from "@/lib/shared";
import { SectionHeading, Reveal } from "@/components/ui/primitives";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight, Dices, Star, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Categories & Flavours — Reel Dare",
  description:
    "Explore 11 dimensions of living. From solo travel and radical kindness to crazy challenges and deep growth.",
};

export default function CategoriesPage() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-cream pt-24 pb-20 text-ink">
        {/* Header */}
        <section className="relative overflow-hidden px-4 pt-12 pb-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold-deep uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Flavours of Life
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
                Choose Your <span className="text-gold-deep italic">Category</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/65 sm:text-lg">
                Not everyone wants to skydive. Sometimes you need a quiet morning letter, a midnight walk, or a
                spontaneous gift for a stranger. Explore every flavor below.
              </p>
            </Reveal>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/categories/shameful-acts"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all hover:-translate-y-0.5"
              >
                😳 Shameful Acts (1,000 Dares)
              </Link>
              <Link
                href="/categories/public-acts"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/30 hover:bg-orange-500 transition-all hover:-translate-y-0.5"
              >
                🔥 Public Acts (1,000 Dares)
              </Link>
              <Link
                href="/spin"
                className="inline-flex items-center gap-2 rounded-full bg-coal px-6 py-3 text-sm font-bold text-gold transition-transform hover:-translate-y-0.5"
              >
                <Dices className="h-4 w-4" /> Spin Wheel
              </Link>
            </div>
          </div>
        </section>

        {/* Premier 2,000 Challenges Feature Section */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Shameful Acts Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950 via-coal to-purple-900/40 p-8 text-cream shadow-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-black tracking-wider text-purple-300 uppercase">
                😳 1,000 Dares · Extreme Cringe
              </div>
              <h2 className="font-display mt-4 text-3xl font-bold text-white">Shameful Acts</h2>
              <p className="font-display text-lg font-semibold italic text-purple-300">
                “Can You Handle the Embarrassment?”
              </p>
              <p className="mt-3 text-xs leading-relaxed text-cream/70 sm:text-sm">
                Face awkward monologues to inanimate objects, ridiculous mirror speeches, cringe dances, and dramatic grocery readings. Voluntary embarrassment designed to destroy your social hesitation.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">1,000 Unique Tasks</span>
                <Link
                  href="/categories/shameful-acts"
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-400 transition-all"
                >
                  Enter Arena →
                </Link>
              </div>
            </div>

            {/* Public Acts Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-950 via-coal to-red-900/40 p-8 text-cream shadow-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3.5 py-1 text-xs font-black tracking-wider text-orange-300 uppercase">
                🔥 1,000 Dares · Public Bravery
              </div>
              <h2 className="font-display mt-4 text-3xl font-bold text-white">Public Acts</h2>
              <p className="font-display text-lg font-semibold italic text-orange-300">
                “Do It in Public. If You Dare.”
              </p>
              <p className="mt-3 text-xs leading-relaxed text-cream/70 sm:text-sm">
                Real-world confidence exercises, respectful cafe micro-interactions, street-style park performances, creative public photography, and cooperative friend challenges. Bold, safe, and legal.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-bold text-orange-300">1,000 Unique Tasks</span>
                <Link
                  href="/categories/public-acts"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-400 transition-all"
                >
                  Enter Arena →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Existing interactive Categories component */}
        <Categories />

        {/* Deep Dive Grid into Categories */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
          <SectionHeading
            kicker="Detailed Breakdown"
            title={
              <>
                Every Journey has a <span className="text-gold-deep italic">Starting Point</span>
              </>
            }
            sub="Pick any realm to see sample bucket list inspirations curated from people around the world."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={cat.key}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-ink/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="absolute top-0 right-0 h-28 w-28 -translate-y-8 translate-x-8 rounded-full opacity-20 blur-xl"
                  style={{ backgroundColor: cat.color }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-black tracking-wider uppercase"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      {cat.label}
                    </span>
                    <span className="text-xs font-semibold text-ink/40">0{idx + 1}</span>
                  </div>

                  <h3 className="font-display mt-4 text-2xl font-semibold text-ink">{cat.label}</h3>
                  <p className="mt-1.5 text-sm font-medium text-ink/60 italic">{cat.tagline}</p>

                  <div className="mt-6 space-y-2.5">
                    <p className="text-[11px] font-bold tracking-[0.16em] text-ink/40 uppercase">
                      Real Examples
                    </p>
                    {cat.examples.map((ex, exI) => (
                      <div key={exI} className="flex items-start gap-2.5 text-xs text-ink/80">
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-ink/5 pt-5">
                  <Link
                    href={
                      cat.key === "shameful_acts"
                        ? "/categories/shameful-acts"
                        : cat.key === "public_acts"
                        ? "/categories/public-acts"
                        : `/spin?category=${cat.key}`
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-paper py-2.5 text-xs font-bold text-ink transition-colors group-hover:bg-coal group-hover:text-gold"
                  >
                    <Dices className="h-3.5 w-3.5" /> {cat.key === "shameful_acts" || cat.key === "public_acts" ? "Enter Challenge Arena" : "Spin this category"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
