import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import Community from "@/components/Community";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import { Users, Sparkles, Heart, MessageSquare, Plus, ArrowRight, Dices } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Memories & Proof — Reel Dare",
  description:
    "See proof of real people actually doing things. Solo mountain hikes, 5 AM sunrises, cooking experiments, and kind acts.",
};

export default function CommunityPage() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-paper pt-24 pb-20 text-ink">
        {/* Header */}
        <section className="relative overflow-hidden px-4 pt-12 pb-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold-deep uppercase">
                <Users className="h-3.5 w-3.5" />
                Live Proof of Life
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
                The Community <span className="text-gold-deep italic">Wall</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
                No influencers staging fake sunsets. Real people taking the leap: awkward first reels, quiet morning walks,
                nervous conversations with strangers, and lifelong memories.
              </p>
            </Reveal>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/spin"
                className="inline-flex items-center gap-2 rounded-full bg-coal px-6 py-3 text-sm font-bold text-gold transition-transform hover:-translate-y-0.5"
              >
                <Dices className="h-4 w-4" /> Spin for your next memory
              </Link>
              <Link
                href="/my-life"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-gold"
              >
                My Saved Experiences
              </Link>
            </div>
          </div>
        </section>

        {/* Existing full-featured Community feed */}
        <Community />

        {/* Community Guidelines banner */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="noise rounded-3xl border border-ink/10 bg-coal p-8 text-cream sm:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-xs font-bold tracking-widest text-gold uppercase">The Human Pact</span>
                <h3 className="font-display mt-2 text-2xl font-semibold text-cream sm:text-3xl">
                  Filming with Respect & Humanity
                </h3>
                <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-cream/70">
                  We believe in living in the moment first, capturing second. Always seek consent when including
                  others, never humiliate anyone for views, and keep memories authentic.
                </p>
              </div>
              <Link
                href="/faq"
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-coal transition-all hover:brightness-110"
              >
                Read Safety Rules <ArrowRight className="h-4 w-4" />
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
