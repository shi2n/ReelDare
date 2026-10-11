import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { Reveal } from "@/components/ui/primitives";
import { Cookie, Shield, Eye, Settings, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies Policy — Reel Dare",
  description:
    "Learn how Reel Dare uses essential cookies, local storage, and session tokens to deliver authentication, saved wishes, and personalized settings.",
};

export default function CookiesPage() {
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
                <Cookie className="h-3.5 w-3.5" />
                Transparency & Privacy
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Cookies <span className="text-gold italic">Policy</span>
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-base">
                Last updated: October 2026. This policy explains what cookies and local storage technologies we use on Reel Dare and why.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="noise rounded-3xl border border-white/10 bg-coal-2 p-6 sm:p-10 lg:p-12 space-y-10 text-sm leading-relaxed text-cream/80 sm:text-base">
            
            {/* 1. What Are Cookies */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-gold shrink-0" />
                1. What Are Cookies & Web Storage?
              </h2>
              <p className="mt-3">
                Cookies and browser local storage (HTML5 LocalStorage) are small pieces of data saved on your computer, tablet, or smartphone when you visit a website. They allow the site to remember your actions, session state, and preferences over time so you don't have to re-enter them on every visit.
              </p>
            </div>

            {/* 2. How We Use Them */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <Eye className="h-5 w-5 text-gold shrink-0" />
                2. How Reel Dare Uses Cookies & Storage
              </h2>
              <p className="mt-3">
                Reel Dare prioritizes user privacy. <strong className="text-cream">We do NOT sell your data, and we do not use invasive third-party cross-site behavioral tracking cookies.</strong> We use storage solely for essential operational and preference features:
              </p>

              {/* Table / Cards of cookies */}
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cream">Essential Authentication (Firebase / Session)</span>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">Strictly Necessary</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-cream/70">
                    Maintains your active login session with Firebase Authentication and Google Sign-In so you stay signed in across page transitions.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cream">Saved Dares & Wish List (`tdbd-saved`)</span>
                    <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-gold">Functional Storage</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-cream/70">
                    Stores the dares and wishes you pin to your "My 100" list locally in your browser so you don't lose your progress even without signing in.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cream">Cookie Consent Preference (`reeldare-cookie-consent`)</span>
                    <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-gold">Preference</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-cream/70">
                    Remembers whether you have acknowledged our privacy and cookie banner so we don't prompt you repeatedly.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Managing Your Cookies */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <Settings className="h-5 w-5 text-gold shrink-0" />
                3. Managing & Disabling Cookies
              </h2>
              <p className="mt-3">
                You can control, block, or delete cookies at any time through your browser settings (Chrome, Safari, Firefox, Edge). Please note that disabling essential storage may prevent you from saving dares, logging into your profile, or tracking your earned XP properly.
              </p>
            </div>

            {/* 4. Updates to this policy */}
            <div className="border-t border-white/10 pt-6">
              <h2 className="font-display text-lg font-semibold text-cream">
                4. Questions & Inquiries
              </h2>
              <p className="mt-2 text-sm text-cream/70">
                If you have questions regarding our cookie practices, please contact us at{" "}
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
