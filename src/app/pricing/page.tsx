import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import Pricing from "@/components/Pricing";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import { Check, Crown, Sparkles, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing & Memberships — Reel Dare",
  description:
    "Forever free Wanderer plan, or unlock Explorer and Lifetime for cloud sync, Reel Mode storyboards, and custom life maps.",
};

const COMPARISON_ROWS = [
  { feature: "Full Wish Engine & Spin Circle", wanderer: true, explorer: true, lifetime: true },
  { feature: "2,000+ Curated Experience Library", wanderer: true, explorer: true, lifetime: true },
  { feature: "Daily Curated Challenge", wanderer: true, explorer: true, lifetime: true },
  { feature: "Safety & Legal Guidance Guidelines", wanderer: true, explorer: true, lifetime: true },
  { feature: "Save Locally on Device", wanderer: "Up to 25", explorer: "Unlimited", lifetime: "Unlimited" },
  { feature: "Cloud Sync Across Phone & Desktop", wanderer: false, explorer: true, lifetime: true },
  { feature: "My 100 Life Map with Drag Reorder", wanderer: false, explorer: true, lifetime: true },
  { feature: "Reel Mode: Shot Lists & Hook Ideas", wanderer: false, explorer: true, lifetime: true },
  { feature: "Photo & GPS Memory Journal", wanderer: false, explorer: true, lifetime: true },
  { feature: "Founder Badge & Lifetime VIP Access", wanderer: false, explorer: false, lifetime: true },
];

export default function PricingPage() {
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
                <Crown className="h-3.5 w-3.5" />
                Simple & Fair Pricing
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Invest in <span className="text-gold italic">Your Memories</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
                The core wish engine will always be 100% free. Upgrade only when you want persistent cloud sync, Reel
                production tools, and lifelong memory tracking.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Existing Pricing cards component */}
        <Pricing />

        {/* Full Feature Comparison Table */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            kicker="Detailed Matrix"
            title="Compare All Plan Features"
            sub="Everything you get with each tier. No hidden fees or recurring traps."
          />

          <div className="noise mt-12 overflow-x-auto rounded-3xl border border-white/10 bg-coal-2 p-6 sm:p-8">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-cream/50 uppercase">
                  <th className="pb-4">Feature</th>
                  <th className="pb-4 text-center">Wanderer (₹0)</th>
                  <th className="pb-4 text-center text-gold">Explorer (₹299/mo)</th>
                  <th className="pb-4 text-center text-amber-300">Lifetime (₹4,999)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-4 font-medium text-cream">{row.feature}</td>
                    <td className="py-4 text-center text-cream/70">
                      {typeof row.wanderer === "boolean" ? (
                        row.wanderer ? (
                          <Check className="mx-auto h-4 w-4 text-emerald-400" />
                        ) : (
                          <span className="text-cream/20">—</span>
                        )
                      ) : (
                        row.wanderer
                      )}
                    </td>
                    <td className="py-4 text-center font-bold text-cream">
                      {typeof row.explorer === "boolean" ? (
                        row.explorer ? (
                          <Check className="mx-auto h-4 w-4 text-emerald-400" />
                        ) : (
                          <span className="text-cream/20">—</span>
                        )
                      ) : (
                        row.explorer
                      )}
                    </td>
                    <td className="py-4 text-center font-bold text-gold">
                      {typeof row.lifetime === "boolean" ? (
                        row.lifetime ? (
                          <Check className="mx-auto h-4 w-4 text-gold" />
                        ) : (
                          <span className="text-cream/20">—</span>
                        )
                      ) : (
                        row.lifetime
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Guarantee Box */}
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8 text-center sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-cream">30-Day Pure Memory Guarantee</h4>
              <p className="mt-1 text-sm text-cream/70">
                If Explorer or Lifetime doesn't inspire you to complete at least three meaningful experiences in your first
                month, email us for a full refund. Zero questions asked.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
