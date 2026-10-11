import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import CustomCursor from "@/components/CustomCursor";
import FAQ from "@/components/FAQ";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import { HelpCircle, Mail, Sparkles, MessageSquare, ArrowRight, ShieldCheck, Dices } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Reel Dare",
  description:
    "Everything you need to know about the wish engine, safety standards, Reel Mode, and how we protect human experiences.",
};

export default function FAQPage() {
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
                <HelpCircle className="h-3.5 w-3.5" />
                Answers & Rules
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
                Frequently Asked <span className="text-gold-deep italic">Questions</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
                Got a question about how the Spin Circle works, how we ensure safety, or how to record your memories?
                We've got you covered.
              </p>
            </Reveal>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/spin"
                className="inline-flex items-center gap-2 rounded-full bg-coal px-6 py-3 text-sm font-bold text-gold transition-transform hover:-translate-y-0.5"
              >
                <Dices className="h-4 w-4" /> Try the Spin Wheel
              </Link>
            </div>
          </div>
        </section>

        {/* Existing FAQ accordion component */}
        <FAQ />

        {/* Still have questions / Contact Support */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-soft text-gold-deep">
              <Mail className="h-7 w-7" />
            </div>
            <h3 className="font-display mt-5 text-2xl font-semibold text-ink sm:text-3xl">
              Still have questions or wish ideas?
            </h3>
            <p className="mx-auto mt-2.5 max-w-lg text-sm text-ink/65 sm:text-base">
              We read every email. If you have an experience to suggest or need help with your account, reach out anytime.
            </p>
            <div className="mt-6">
              <a
                href="mailto:hello@reeldare.com"
                className="inline-flex items-center gap-2 rounded-2xl bg-coal px-7 py-3.5 text-sm font-bold text-gold transition-transform hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" /> hello@reeldare.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
