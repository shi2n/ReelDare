"use client";

import { ArrowRight, Dices } from "lucide-react";
import { Parallax, Reveal } from "@/components/ui/primitives";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="noise relative overflow-hidden bg-coal py-28 sm:py-40">
      <Parallax speed={0.5} className="pointer-events-none absolute -top-10 -right-16 opacity-20">
        <Dices className="animate-spin-slower h-[340px] w-[340px] text-gold" aria-hidden strokeWidth={0.6} />
      </Parallax>
      <Parallax speed={1} className="pointer-events-none absolute bottom-10 -left-20 opacity-15">
        <Dices className="animate-spin-slower h-[220px] w-[220px] text-cream" aria-hidden strokeWidth={0.6} />
      </Parallax>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-5xl leading-[1.02] font-semibold text-cream sm:text-7xl">
            You only get <span className="text-gold italic">one life.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mx-auto mt-8 max-w-2xl space-y-2 text-lg leading-relaxed text-cream/70 sm:text-xl">
            <p>Don't wait until you have more money.</p>
            <p>Don't wait until you have more time.</p>
            <p>Don't wait until you're ready.</p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-display mx-auto mt-8 max-w-3xl text-2xl font-medium text-cream italic sm:text-3xl">
            Find something worth doing.
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/spin"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-10 py-5 text-lg font-black text-coal shadow-[0_20px_60px_rgba(212,168,67,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(212,168,67,0.55)]"
            >
              <Dices className="h-6 w-6 transition-transform duration-500 group-hover:rotate-[180deg]" aria-hidden />
              Spin The Circle
            </Link>
            <Link
              href="/my-life"
              className="inline-flex items-center gap-3 rounded-full border border-cream/25 px-10 py-5 text-lg font-bold text-cream transition-all hover:border-gold hover:text-gold"
            >
              Build my 100
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.36}>
          <p className="mt-16 text-[11px] font-bold tracking-[0.3em] text-cream/40 uppercase">
            One life. Thousands of possibilities. What will you do next?
          </p>
        </Reveal>
      </div>
    </section>
  );
}
