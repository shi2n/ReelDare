import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { Reveal, SectionHeading } from "@/components/ui/primitives";
import { FileText, ShieldAlert, CheckCircle, Scale, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions — Reel Dare",
  description:
    "Review the terms and conditions for using Reel Dare, including challenge safety, content submission, user conduct, and liability limits.",
};

export default function TermsPage() {
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
                <FileText className="h-3.5 w-3.5" />
                Legal Agreement
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Terms & <span className="text-gold italic">Conditions</span>
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-base">
                Last updated: October 2026. Please read these terms carefully before accessing or participating in any dares on Reel Dare.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Content Container */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="noise rounded-3xl border border-white/10 bg-coal-2 p-6 sm:p-10 lg:p-12 space-y-10 text-sm leading-relaxed text-cream/80 sm:text-base">
            
            {/* 1. Acceptance */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <Scale className="h-5 w-5 text-gold shrink-0" />
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing <strong className="text-cream">reeldare.vercel.app</strong> ("Reel Dare", "we", "us", or "our"), creating an account, or spinning our challenge wheel, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy & Cookie Policy. If you do not agree to all of these terms, you are expressly prohibited from using the platform.
              </p>
            </div>

            {/* 2. Nature of Platform & Voluntary Participation */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <CheckCircle className="h-5 w-5 text-gold shrink-0" />
                2. Voluntary Participation & Assumption of Risk
              </h2>
              <p className="mt-3">
                Reel Dare is an experiential platform providing spontaneous ideas, creative prompts, and real-life challenge suggestions ("Dares"). All participation in any dare or challenge is <strong className="text-cream">strictly voluntary</strong>.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1.5 text-cream/75">
                <li>You are solely responsible for evaluating your physical fitness, surroundings, local laws, and personal safety before attempting any prompt.</li>
                <li>You have the absolute freedom and right to skip, reject, or discontinue any dare at any time without penalty.</li>
                <li>You assume all risks associated with performing any physical activity, public interaction, or outdoor pursuit.</li>
              </ul>
            </div>

            {/* 3. Safety First & Prohibited Actions */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 sm:p-6">
              <h2 className="font-display text-lg font-semibold text-amber-300 sm:text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                3. Absolute Safety Principles & Prohibited Conduct
              </h2>
              <p className="mt-2 text-sm text-amber-200/90">
                You agree NEVER to perform, submit, or encourage any action that:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-amber-200/80">
                <li>Violates municipal, national, or international laws or regulations.</li>
                <li>Endangers yourself, bystanders, animals, public utilities, or private property.</li>
                <li>Involves harassment, trespass, cruelty, nuisance, reckless driving, or intoxication.</li>
                <li>Films or broadcasts individuals without their informed knowledge and consent.</li>
                <li>Infringes on the copyright, trademark, or privacy rights of any third party.</li>
              </ul>
            </div>

            {/* 4. User Accounts & Identity */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <Users className="h-5 w-5 text-gold shrink-0" />
                4. User Accounts & Community Conduct
              </h2>
              <p className="mt-3">
                When you create an account using Email or Google Sign-In, you are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must provide accurate, current, and honest profile information. Accounts engaged in automated bot abuse, spam, or hostile behavior will be terminated without prior notice.
              </p>
            </div>

            {/* 5. Content Submissions & Evidence */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl">
                5. User Submissions & Media Evidence
              </h2>
              <p className="mt-3">
                Users may submit proof links, journal notes, or challenge reflections to document completed dares. By submitting content, you grant Reel Dare a non-exclusive, worldwide, royalty-free license to display your public dare records and achievements within the application. You represent that you possess all rights to any submitted content.
              </p>
            </div>

            {/* 6. Disclaimer of Warranties & Limitation of Liability */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gold sm:text-2xl flex items-center gap-2.5">
                <ShieldAlert className="h-5 w-5 text-gold shrink-0" />
                6. Disclaimer & Limitation of Liability
              </h2>
              <p className="mt-3">
                Reel Dare and its operators provide the services, suggestions, and software on an "AS IS" and "AS AVAILABLE" basis. To the fullest extent permitted by applicable law, Reel Dare disclaims all warranties, express or implied.
              </p>
              <p className="mt-3">
                In no event shall Reel Dare, its founders, affiliates, or contributors be held liable for any direct, indirect, incidental, special, consequential, or punitive damages—including personal injury, property damage, or loss of life—arising from or relating to your execution of any challenge generated by the platform.
              </p>
            </div>

            {/* 7. Modifications & Contact */}
            <div className="border-t border-white/10 pt-6">
              <h2 className="font-display text-lg font-semibold text-cream">
                7. Questions & Contact
              </h2>
              <p className="mt-2 text-sm text-cream/70">
                If you have questions or concerns regarding these terms, please contact our team at{" "}
                <a href="mailto:legal@reeldare.com" className="text-gold font-semibold underline hover:brightness-110">
                  legal@reeldare.com
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
