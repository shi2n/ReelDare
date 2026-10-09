"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Parallax, Reveal } from "@/components/ui/primitives";

const BG =
  "https://images.pexels.com/photos/32399568/pexels-photo-32399568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

const REGRETS = [
  "Call my parents more",
  "Travel somewhere alone",
  "Tell someone how I feel",
  "Create something of my own",
  "Start the business",
  "Learn the skill I keep postponing",
  "Take the trip I keep pricing",
  "Forgive someone",
  "Say thank you properly",
  "Spend a real day with family",
  "Do one thing that scares me",
  "Make one ridiculous memory",
];

export default function BeforeIDie() {
  const [picked, setPicked] = useState<number[]>([]);

  const toggle = (i: number) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <section id="before-i-die" className="relative overflow-hidden bg-coal py-24 sm:py-36">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BG} alt="" loading="lazy" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-coal via-coal/75 to-coal" />
      </div>

      <Parallax speed={0.4} className="pointer-events-none absolute top-16 -left-10 select-none">
        <span className="font-display text-outline text-[22vw] leading-none font-semibold tracking-tight uppercase opacity-40 lg:text-[16rem]">
          ONE
        </span>
      </Parallax>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-[11px] font-bold tracking-[0.28em] text-gold uppercase">The regret filter</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display mt-5 text-5xl leading-[1.02] font-semibold text-cream sm:text-6xl lg:text-7xl">
            Before I die…
            <span className="mt-2 block text-3xl text-cream/60 italic sm:text-4xl">
              what would I regret never doing?
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/60 sm:text-lg">
            Tap every sentence that stings a little. That's not guilt — it's a compass. We'll turn those into the
            first entries of your list.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {REGRETS.map((r, i) => {
              const on = picked.includes(i);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition-all duration-300 ${
                    on
                      ? "border-gold bg-gold text-coal shadow-[0_12px_30px_rgba(212,168,67,0.35)]"
                      : "border-white/20 bg-white/5 text-cream/80 backdrop-blur-sm hover:border-gold/60 hover:text-cream"
                  }`}
                >
                  <span
                    className={`grid h-4.5 w-4.5 place-items-center rounded-full border text-[10px] ${
                      on ? "border-coal bg-coal text-gold" : "border-cream/40 text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {r}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-10">
            <p className="text-sm font-bold tracking-wide text-cream/50">
              {picked.length === 0
                ? "Your list is waiting to be written."
                : `Your list already has ${picked.length} honest thing${picked.length === 1 ? "" : "s"} in it.`}
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#spin"
                className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-4 text-base font-black text-coal transition-all hover:bg-gold"
              >
                Build my list
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
              <a
                href="#faq"
                className="text-sm font-bold text-cream/60 underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold"
              >
                How does My 100 work?
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
