import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { Reveal } from "@/components/ui/primitives";
import { ShieldCheck, Lock, UserCheck, Trash2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Reel Dare",
  description:
    "Read the Reel Dare privacy policy to understand how we protect your personal information, handle authentication, and secure your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="min-h-screen bg-coal pt-28 pb-24 text-cream">
        {/* Header */}
        <section className="relative overflow-hidden px-4 pt-10 pb-12 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                Data Protection
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Privacy <span className="text-gold italic">Policy</span>
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-base">
                Last updated: October 2026. We believe in living experiences in real life without sacrificing your privacy or personal safety.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="noise rounded-3xl border border-white/10 bg-coal-2 p-6 sm:p-10 lg:p-12 space-y-10 text-sm leading-relaxed text-cream/80 sm:text-base">
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <Lock className="h-5 w-5 text-gold shrink-0" />
                1. Information We Collect
              </h2>
              <p className="mt-3">
                When you create an account, we collect your display name, chosen username, email address, optional Instagram handle, and challenge preferences. If you sign in via Google, we receive your basic Google profile name, email address, and avatar image.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <UserCheck className="h-5 w-5 text-gold shrink-0" />
                2. How We Use Your Data
              </h2>
              <p className="mt-3">
                Your data is used strictly to provide you with your personal profile, track your completed dares, compute your rank levels and XP, and customize your spin wheel recommendations. We do not sell your personal data to data brokers or advertising networks.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <Trash2 className="h-5 w-5 text-gold shrink-0" />
                3. Your Rights & Data Deletion
              </h2>
              <p className="mt-3">
                You retain complete ownership over your account. You can edit your profile details, update your preferences, or delete your entire profile and associated submissions directly from your account settings at any time.
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h2 className="font-display text-lg font-semibold text-cream">
                4. Contacting Us
              </h2>
              <p className="mt-2 text-sm text-cream/70">
                For questions regarding data processing or your privacy rights, please reach out to{" "}
                <a href="mailto:privacy@reeldare.com" className="text-gold font-semibold underline hover:brightness-110">
                  privacy@reeldare.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
