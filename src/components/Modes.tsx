"use client";

import { Brain, CalendarDays, Coins, Compass, Dices, Film, Flame, Heart, Laugh, Timer } from "lucide-react";
import { Reveal } from "@/components/ui/primitives";

const MODES = [
  { label: "Totally random", icon: Dices, color: "#d4a843", preset: { mood: "any" } },
  { label: "Fun random", icon: Laugh, color: "#e08a3c", preset: { mood: "fun" } },
  { label: "Crazy random", icon: Flame, color: "#c94f7c", preset: { mood: "crazy" } },
  { label: "Meaningful random", icon: Heart, color: "#c2453e", preset: { mood: "meaningful" } },
  { label: "Adventure random", icon: Compass, color: "#3f7fbf", preset: { mood: "adventure" } },
  { label: "Growth random", icon: Brain, color: "#3f9e6d", preset: { mood: "growth" } },
  { label: "Creator random", icon: Film, color: "#8b5fbf", preset: { mood: "create" } },
  { label: "₹0 random", icon: Coins, color: "#2e7d5b", preset: { budget: "free" } },
  { label: "10-minute wishes", icon: Timer, color: "#6b6fc0", preset: { time: "10min" } },
  { label: "Weekend mode", icon: CalendarDays, color: "#d05b3a", preset: { time: "weekend" } },
];

export default function Modes() {
  const pick = (preset: { mood?: string; time?: string; budget?: string }) => {
    window.dispatchEvent(new CustomEvent("tdbd-preset", { detail: preset }));
    document.getElementById("spin")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="border-y border-ink/8 bg-paper py-10" aria-label="Randomizer modes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col items-center gap-6">
            <p className="text-[11px] font-bold tracking-[0.26em] text-ink/50 uppercase">
              Ten ways to answer “I don't know what to do”
            </p>
            <div className="flex max-w-full flex-wrap items-center justify-center gap-2.5">
              {MODES.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => pick(m.preset)}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(33,29,25,0.12)]"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full text-white transition-transform group-hover:scale-110" style={{ backgroundColor: m.color }}>
                    <m.icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
