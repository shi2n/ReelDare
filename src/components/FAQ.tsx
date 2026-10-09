"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/primitives";

const FAQS = [
  {
    q: "Is this just another bucket-list app?",
    a: "No. A bucket list asks what you want to do someday. We answer what you could do today. The wish engine deals you one concrete experience based on your mood, time, budget, energy and company — and it works even if you never make a list at all.",
  },
  {
    q: "Do I need to create an account to use it?",
    a: "No. Spinning, saving to your device and completing challenges all work without an account. Accounts (coming with Explorer) add cloud sync so your My 100, journal and life map survive a phone change.",
  },
  {
    q: "What if I spin and hate the result?",
    a: "Then it wasn't the one. Skip it — no guilt, no streak lost, no 'you failed' screen. Our rule: life is too short to force the wrong experience. The next wish is one roll away.",
  },
  {
    q: "Are the challenges actually safe?",
    a: "Every experience carries a safety level, and anything involving travel, water, heights, strangers or physical risk ships with specific guidance. There are no illegal challenges, no dangerous stunts, no pranks on strangers and no humiliating anyone for content. If something feels unsafe, skip it. Live more — don't risk your life for content.",
  },
  {
    q: "How does Reel Mode work?",
    a: "Accept any challenge and we generate a 40-second storyboard: hook (0–3s), setup, journey, moment, result, lesson and the signature ending line — plus shot list, caption, thumbnail text and hashtag ideas. One caveat built in: film your own story. Ask consent before filming people, and never film vulnerable people for content.",
  },
  {
    q: "What is My 100 exactly?",
    a: "A list you choose yourself — 25, 50, 100 or 500 experiences. Add from spins, categories or the community, reorder by dragging, mark in-progress, skip freely, and watch your life dashboard fill with cities, kind acts, reels and memories instead of tasks.",
  },
  {
    q: "I have ₹0 and 10 minutes. Is there anything here for me?",
    a: "Hundreds of things. Watch a sunrise you've never seen, call someone you've been meaning to, photograph your own street, write a letter to your future self. The engine has a dedicated ₹0 filter and a 10-minute filter — some of the best memories cost nothing.",
  },
  {
    q: "When do Explorer and Lifetime launch?",
    a: "We're onboarding in small batches to keep the community kind and useful. Join the waitlist below — early members get two months free and a permanent founding badge.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          kicker="Fair questions"
          title={
            <>
              Before you roll the dice, <span className="text-gold-deep italic">read this.</span>
            </>
          }
        />
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i * 0.05, 0.2)}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                    isOpen ? "border-gold/60 shadow-[0_16px_40px_rgba(33,29,25,0.08)]" : "border-ink/8"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-lg font-semibold text-ink sm:text-xl">{f.q}</span>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-45 bg-gold text-coal" : "bg-cream text-ink/50"
                      }`}
                    >
                      <Plus className="h-5 w-5" aria-hidden />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink/60">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
