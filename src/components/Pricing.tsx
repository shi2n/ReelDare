"use client";

import { Check, Crown, Dices, Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/primitives";

const PLANS = [
  {
    name: "Wanderer",
    price: "₹0",
    cadence: "forever free",
    tagline: "For the curious. Spin, do, remember — no account needed to start.",
    cta: "Start spinning",
    href: "#spin",
    highlight: false,
    features: [
      "Full wish engine + all filters",
      "2,000+ experience library",
      "Daily wish on the homepage",
      "Save up to 25 experiences locally",
      "Safety guidance on every challenge",
    ],
  },
  {
    name: "Explorer",
    price: "₹299",
    cadence: "per month",
    tagline: "For the ones collecting memories on purpose.",
    cta: "Join the waitlist",
    href: "#newsletter",
    highlight: true,
    badge: "Most chosen",
    features: [
      "Everything in Wanderer",
      "My 100 with cloud sync & drag-to-reorder",
      "Reel Mode: hooks, shot lists & captions",
      "Memory journal with photos & map pins",
      "Streaks, badges & challenge levels",
      "'I'm doing this' checklist mode",
      "Creator Mode for Reels, Shorts & films",
    ],
  },
  {
    name: "Lifetime",
    price: "₹4,999",
    cadence: "once, forever",
    tagline: "One payment. Every update for as long as you're alive. Which is the point.",
    cta: "Claim lifetime",
    href: "#newsletter",
    highlight: false,
    features: [
      "Everything in Explorer, forever",
      "Founding-member badge & gold profile",
      "Early access to new categories",
      "Vote on the next 1,000 experiences",
      "Your name in the credits of a life's work",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          kicker="Simple pricing"
          title={
            <>
              Cost less than <span className="text-gold-deep italic">one forgotten subscription.</span>
            </>
          }
          sub="Start free — the dice don't charge. Upgrade when you want your memories to sync, your Reels planned, and your 100 to live forever."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-[1.75rem] p-7 transition-all duration-300 sm:p-8 ${
                  p.highlight
                    ? "noise z-10 bg-coal text-cream shadow-[0_35px_80px_rgba(33,29,25,0.35)] lg:-translate-y-4 lg:scale-[1.02]"
                    : "border border-ink/10 bg-white hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(33,29,25,0.1)]"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 text-[11px] font-black tracking-[0.16em] text-coal uppercase">
                    <Crown className="h-3.5 w-3.5" aria-hidden />
                    {p.badge}
                  </span>
                )}
                <p className={`text-[11px] font-bold tracking-[0.22em] uppercase ${p.highlight ? "text-gold" : "text-gold-deep"}`}>
                  {p.name}
                </p>
                <div className="mt-4 flex items-end gap-2">
                  <span className={`font-display text-5xl font-semibold ${p.highlight ? "text-cream" : "text-ink"}`}>
                    {p.price}
                  </span>
                  <span className={`pb-1.5 text-sm font-bold ${p.highlight ? "text-cream/50" : "text-ink/45"}`}>
                    {p.cadence}
                  </span>
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${p.highlight ? "text-cream/65" : "text-ink/55"}`}>
                  {p.tagline}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-semibold">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          p.highlight ? "bg-gold/20 text-gold" : "bg-gold-soft text-gold-deep"
                        }`}
                      >
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <span className={p.highlight ? "text-cream/85" : "text-ink/75"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={p.href}
                  className={`mt-7 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black tracking-wide uppercase transition-all hover:-translate-y-0.5 ${
                    p.highlight
                      ? "bg-gold text-coal shadow-[0_14px_40px_rgba(212,168,67,0.4)]"
                      : "bg-coal text-cream hover:bg-ink"
                  }`}
                >
                  {p.name === "Wanderer" ? <Dices className="h-4 w-4" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
                  {p.cta}
                </a>
                {p.href === "#newsletter" && (
                  <p className={`mt-3 text-center text-[11px] font-bold ${p.highlight ? "text-cream/40" : "text-ink/35"}`}>
                    Launching soon — leave your email, get 2 months free.
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-sm font-semibold text-ink/45">
            Money shouldn't decide who gets to live. Hundreds of ₹0 wishes stay free, forever.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
