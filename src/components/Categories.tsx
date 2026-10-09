"use client";

import { ArrowUpRight, Brain, Coins, Compass, Dumbbell, Flame, Heart, HeartHandshake, Laugh, Moon, Palette, Wand2, Dices, SmilePlus, Megaphone } from "lucide-react";
import { CATEGORIES, type CategoryKey } from "@/lib/shared";
import { Reveal, SectionHeading } from "@/components/ui/primitives";

const ICONS: Record<CategoryKey, typeof Compass> = {
  travel: Compass,
  physical: Dumbbell,
  create: Palette,
  fun: Laugh,
  crazy: Flame,
  growth: Brain,
  family: Heart,
  kindness: HeartHandshake,
  money: Coins,
  spiritual: Moon,
  weird: Wand2,
  shameful_acts: SmilePlus,
  public_acts: Megaphone,
};

const COUNTS: Record<CategoryKey, number> = {
  travel: 206,
  physical: 92,
  create: 96,
  fun: 128,
  crazy: 74,
  growth: 270,
  family: 96,
  kindness: 78,
  money: 64,
  spiritual: 58,
  weird: 52,
  shameful_acts: 1000,
  public_acts: 1000,
};

const MOOD_FOR: Record<CategoryKey, string> = {
  travel: "adventure",
  physical: "fun",
  create: "create",
  fun: "fun",
  crazy: "crazy",
  growth: "growth",
  family: "meaningful",
  kindness: "kindness",
  money: "growth",
  spiritual: "meaningful",
  weird: "fun",
  shameful_acts: "crazy",
  public_acts: "crazy",
};

export default function Categories() {
  const goCategory = (key: CategoryKey) => {
    window.dispatchEvent(new CustomEvent("tdbd-preset", { detail: { mood: MOOD_FOR[key], time: "any", budget: "any" } }));
  };

  return (
    <section id="categories" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          kicker="Pick a flavour of living"
          title={
            <>
              Your life. <span className="text-gold-deep italic">Your list.</span>
            </>
          }
          sub="Adventure, family, chaos, kindness or quiet — there's no single correct bucket list. Explore the aisles, steal ideas, build a list that sounds like you."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.key];
            return (
              <Reveal key={cat.key} delay={(i % 3) * 0.08}>
                <a
                  href="#spin"
                  onClick={() => goCategory(cat.key)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/5 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(33,29,25,0.12)] sm:p-7"
                  style={{ backgroundColor: cat.bg }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl text-white transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-black tracking-[0.14em] uppercase" style={{ color: cat.color }}>
                      ~{COUNTS[cat.key]} wishes
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </div>
                  <h3 className="font-display mt-5 text-2xl font-semibold text-ink">{cat.label}</h3>
                  <p className="mt-1 text-sm font-semibold" style={{ color: cat.color }}>
                    {cat.tagline}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {cat.examples.slice(0, 3).map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-[13px] leading-snug text-ink/60">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                        {ex}
                      </li>
                    ))}
                  </ul>
                  <span
                    className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full opacity-15 transition-transform duration-500 group-hover:scale-150"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden
                  />
                </a>
              </Reveal>
            );
          })}

          {/* all-in card */}
          <Reveal delay={0.24}>
            <a
              href="#spin"
              className="noise group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl bg-coal p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(33,29,25,0.3)] sm:p-7"
            >
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-coal">
                  <Dices className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-display mt-5 text-2xl leading-snug font-semibold text-cream">
                  Can't decide between 2,000+ wishes?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">
                  That's literally what the dice are for.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-black text-coal transition-colors group-hover:bg-gold">
                Spin the whole library
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
